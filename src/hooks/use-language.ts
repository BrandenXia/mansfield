import { useMemo } from "react";
import { translations, type Translations } from "@/i18n/translations";

const getBrowserLanguage = (): string => {
  const lang = navigator.language || navigator.languages?.[0] || "en";
  return lang.split("-")[0]?.toLowerCase() ?? "en";
};

const useLanguage = (): Translations => {
  const lang = useMemo(getBrowserLanguage, []);
  return translations[lang] ?? translations["en"] ?? ({} as Translations);
};

export default useLanguage;
