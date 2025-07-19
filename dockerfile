# Используем официальный образ Node.js на базе Alpine
FROM node:20.18.3-alpine

# Устанавливаем аргумент сборки NODE_ENV
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем build-зависимости
RUN apk add --no-cache python3 py3-pip make g++

# Копируем все файлы проекта, исключая те, что указаны в .dockerignore
COPY . .

# Копируем соответствующий .env файл в зависимости от NODE_ENV
RUN if [ "$NODE_ENV" = "test" ]; then cp .env.test .env; \
    elif [ "$NODE_ENV" = "development" ]; then cp .env.development .env; \
    else cp .env.production .env; \
    fi

# Экспонируем порт 3000
EXPOSE 3000

# Запуск приложения
CMD ["sh", "-c", "npm install && npm start"]