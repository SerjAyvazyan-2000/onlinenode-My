#!/bin/bash

# Начало замера времени
START_TIME=$(date +%s)

# Параметры
NAMESPACE="deflationcoin-test"               # Пространство имен, по умолчанию "default"
IMAGE_NAME="defcoinapp-test"       # Новый образ, который вы хотите установить
KUBECONFIG_PATH="deflation_config.yaml" # Путь к файлу конфигурации kubeconfig
VERSION_FILE="app_version_test"
DEPLOYMENT_PATH="kubernetes/test/deployment.yml" # Путь к файлу деплоймента
SERVICE_PATH="kubernetes/test/service.yml"
INGRESS_PATH="kubernetes/test/ingress.yml"

# Проверяем, существует ли файл version.txt
if [ ! -f "$VERSION_FILE" ]; then
  echo "Error: Version file '$VERSION_FILE' does not exist."
  exit 1
fi

# Читаем текущую версию из файла
CURRENT_VERSION=$(cat $VERSION_FILE)

# Проверяем, что версия существует
if [[ -z "$CURRENT_VERSION" ]]; then
  echo "Error: Current version is not defined in '$VERSION_FILE'."
  exit 1
fi

# Разбиваем строку на части: major, minor, patch
IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"

# Инкрементируем patch-версию
new_patch=$((patch + 1))

# Собираем новую версию
NEW_VERSION="$major.$minor.$new_patch"

# Обновляем файл с новой версией
echo $NEW_VERSION > $VERSION_FILE

# Новый тег для образа
IMAGE_NAME="$IMAGE_NAME:$NEW_VERSION"
FULL_IMAGE="deflationcoin.ru/$IMAGE_NAME"

npm install
if [ $? -ne 0 ]; then
  echo "Error: npm install failed. Aborting further steps."
  exit 1
fi

# Устанавливаем NODE_ENV=test перед сборкой
export NODE_ENV=test
echo "Building with NODE_ENV=$NODE_ENV"

# Используем cp .env.test .env, чтобы гарантировать, что сборка использует правильные переменные
cp .env.test .env

npx next build --no-lint
if [ $? -ne 0 ]; then
  echo "Error: next build failed. Aborting further steps."
  exit 1
fi

# Добавляем аргумент NODE_ENV=test для сборки Docker образа
docker buildx build --platform linux/amd64,linux/arm64 --build-arg NODE_ENV=test -t $FULL_IMAGE --push .
if [ $? -ne 0 ]; then
  echo "Error: Docker build failed. Aborting further steps."
  exit 1
fi

# Устанавливаем путь к kubeconfig
export KUBECONFIG=$KUBECONFIG_PATH

# Проверяем, что у нас есть все необходимые параметры
if [[ -z "$DEPLOYMENT_PATH" || -z "$FULL_IMAGE" || -z "$KUBECONFIG_PATH" ]]; then
  echo "Error: Missing required parameters."
  exit 1
fi

# Печатаем информацию о текущем деплойменте
echo "Updating deployment '$DEPLOYMENT_PATH' in namespace '$NAMESPACE' with image '$FULL_IMAGE'"

# Обновляем файл деплоймента с новой версией образа
# Используем `sed` для замены старого тега образа на новый
sed -i '' "s|image: deflationcoin.ru/defcoinapp-test:.*|image: $FULL_IMAGE|" "$DEPLOYMENT_PATH"

# Применяем изменения в деплойменте
kubectl apply -f "$DEPLOYMENT_PATH" -n $NAMESPACE
kubectl apply -f "$SERVICE_PATH" -n $NAMESPACE
kubectl apply -f "$INGRESS_PATH" -n $NAMESPACE


# Проверяем успешность команды
if [ $? -eq 0 ]; then
  echo "Successfully updated deployment with image: $FULL_IMAGE."
else
  echo "Failed to update deployment."
  exit 1
fi

cp .env.production .env

# Конец замера времени
END_TIME=$(date +%s)

# Рассчитываем время выполнения
ELAPSED_TIME=$((END_TIME - START_TIME))
echo "Script execution time: $ELAPSED_TIME seconds."