"use client"

import {locales} from "@shared/config";
import {useTranslations} from "next-intl";
import {useLanguageSelector} from "../lib/use-language-selector";

export const SelectLanguage = () => {
    const {change, isPending, currentLocale} = useLanguageSelector()
    const t = useTranslations("features.selectLanguage")

    return (
        <select
            defaultValue={currentLocale}
            aria-label={t("label")}
            onChange={change}
            disabled={isPending}
        >
            {locales.map((currLocale) => (
                <option
                    key={currLocale}
                    value={currLocale}
                >
                    {t(`localeNames.${currLocale}`)}
                </option>
            ))}
        </select>
    );
};