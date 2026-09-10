"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import type { AuthErrorCode } from "@entities/user";
import { signIn, signUp } from "@entities/user";
import { useRouter } from "@shared/lib/i18n";
import { navigateAfterAuth, resolveReturnTo } from "@shared/lib/routing";
import { Button, Input } from "@shared/ui";
import { useSearchParams } from "next/navigation";

type AuthMode = "signIn" | "signUp";

type SignInFormValues = {
    email: string;
    password: string;
    confirmPassword?: string;
};

const DEMO_EMAIL = "demo@pizza.local";
const DEMO_PASSWORD = "password123";

const demoDefaultValues: SignInFormValues = {
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    confirmPassword: DEMO_PASSWORD,
};

interface SignInFormProps {
    onSuccess?: () => void;
}

export const SignInForm = ({ onSuccess }: SignInFormProps) => {
    const t = useTranslations("features.signIn");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<AuthMode>("signIn");
    const [formError, setFormError] = useState<AuthErrorCode | null>(null);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SignInFormValues>({
        defaultValues: demoDefaultValues,
    });

    const switchMode = (nextMode: AuthMode) => {
        setMode(nextMode);
        setFormError(null);
        reset(demoDefaultValues);
    };

    const onSubmit = handleSubmit((values) => {
        setFormError(null);

        startTransition(async () => {
            const result =
                mode === "signIn"
                    ? await signIn({
                          email: values.email,
                          password: values.password,
                      })
                    : await signUp({
                          email: values.email,
                          password: values.password,
                          confirmPassword: values.confirmPassword ?? "",
                      });

            if (!result.success) {
                setFormError(result.error);
                return;
            }

            onSuccess?.();
            navigateAfterAuth(
                router,
                resolveReturnTo(searchParams?.get("returnTo")),
            );
            router.refresh();
        });
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
            <Input status={errors.email || formError === "invalidEmail" ? "error" : "default"}>
                <Input.Label>{t("modal.emailLabel")}</Input.Label>
                <Input.Control>
                    <Input.Field
                        type="email"
                        autoComplete="email"
                        placeholder={t("modal.emailPlaceholder")}
                        {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        })}
                    />
                </Input.Control>
            </Input>

            <Input
                status={
                    errors.password ||
                    formError === "weakPassword" ||
                    formError === "invalidCredentials"
                        ? "error"
                        : "default"
                }
            >
                <Input.Label>{t("modal.passwordLabel")}</Input.Label>
                <Input.Control>
                    <Input.Field
                        type="password"
                        autoComplete={
                            mode === "signIn" ? "current-password" : "new-password"
                        }
                        placeholder={t("modal.passwordPlaceholder")}
                        {...register("password", {
                            required: true,
                            minLength: 8,
                        })}
                    />
                </Input.Control>
            </Input>

            {mode === "signUp" && (
                <Input
                    status={
                        errors.confirmPassword || formError === "passwordMismatch"
                            ? "error"
                            : "default"
                    }
                >
                    <Input.Label>{t("modal.confirmPasswordLabel")}</Input.Label>
                    <Input.Control>
                        <Input.Field
                            type="password"
                            autoComplete="new-password"
                            placeholder={t("modal.confirmPasswordPlaceholder")}
                            {...register("confirmPassword", {
                                required: mode === "signUp",
                                minLength: 8,
                            })}
                        />
                    </Input.Control>
                </Input>
            )}

            {formError && (
                <p className="text-sm font-medium text-red-600" role="alert">
                    {t(`errors.${formError}`)}
                </p>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
                {mode === "signIn" ? t("modal.submitSignIn") : t("modal.submitSignUp")}
            </Button>

            <p className="text-center text-sm text-gray-500">
                {mode === "signIn" ? t("modal.noAccount") : t("modal.hasAccount")}{" "}
                <button
                    type="button"
                    className="font-semibold text-[#FE5F00] hover:underline"
                    onClick={() =>
                        switchMode(mode === "signIn" ? "signUp" : "signIn")
                    }
                >
                    {mode === "signIn"
                        ? t("modal.switchToSignUp")
                        : t("modal.switchToSignIn")}
                </button>
            </p>
        </form>
    );
};
