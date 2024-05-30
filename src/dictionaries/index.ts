export const defaultLocale = "cn";
export const locales = ["cn", "en"] as const;
const dictionaries = {
  "cn": () => import("./cn.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

export type Locale = (typeof locales)[number];

/**
 * 生成多语言 meta hreflang 标签
 */
export const getMetaDataAlternates = (suffix: string, lang: Locale) => {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = `/${locale}${suffix}`;
  }

  return {
    languages,
    canonical: `/${lang}${suffix}`,
  };
};

const defaultsConfig = (
  de: Record<string, string | object>,
  target: Record<string, string | object | undefined>,
) => {
  for (const key in de) {
    if (target[key] === undefined) {
      target[key] = de[key];
    } else if (typeof de[key] === "object") {
      defaultsConfig(
        de[key] as Record<string, string | object>,
        target[key] as Record<string, string | object>,
      );
    }
  }

  return target;
};

export const getDictionary = async (locale: Locale = "cn") => {
  const zhHans = await dictionaries.cn();
  const targetLocale = await dictionaries[locale]();

  return defaultsConfig(zhHans, targetLocale) as typeof zhHans;
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const getLangText = (obj: Record<string, string>, lang: Locale) =>
  obj[lang] ?? obj[defaultLocale] ?? "";

export const getLangUrl = (url: string, lang: Locale) => `/${lang}${url}`;
