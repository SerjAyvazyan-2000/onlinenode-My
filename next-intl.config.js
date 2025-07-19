import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  // Получаем локаль из запроса (асинхронно)
  let locale = await requestLocale;
  const routing = {
    locales: ["en", "ru"],
    defaultLocale: "en",
  };
  // Если локаль не определена или неизвестна – используем defaultLocale
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default,
  };
});
