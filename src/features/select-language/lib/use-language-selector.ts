import { usePathname, useRouter } from "@shared/lib/i18n";
import { ChangeEvent, useTransition } from "react";
import { useLocale } from "next-intl";
import {useParams, useSearchParams} from "next/navigation";

type RouteParams = Record<string, string | string[] | undefined>;

const resolveParamsForTemplate = (template: string, params: RouteParams): Record<string, string> => {
    const names = Array.from(template.matchAll(/\[(\w+)]/g)).map(([, name]) => name);
    if (names.length === 0) return {};

    if (names.every((name) => typeof params[name] === "string")) {
        return Object.fromEntries(names.map((name) => [name, params[name] as string]));
    }

    const catchAll = params.catchAll;
    if (Array.isArray(catchAll) && catchAll.length >= names.length) {
        const trailing = catchAll.slice(-names.length);
        return Object.fromEntries(names.map((name, i) => [name, trailing[i]]));
    }

    return {};
};

export const useLanguageSelector = () => {
    const currentLocale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const query = Object.fromEntries(searchParams?.entries() ?? []);


    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        if (nextLocale === currentLocale) return;

        const resolvedParams = resolveParamsForTemplate(pathname, params ?? {});

        startTransition(() => {
            router.replace(
                // @ts-expect-error -- `resolvedParams` always corresponds to the
                // current `pathname` at runtime, but TS can't verify this.
                { pathname, params: resolvedParams, query },
                { locale: nextLocale },
            );
        });
    };

    return { change: handleLanguageChange, isPending, currentLocale };
};
