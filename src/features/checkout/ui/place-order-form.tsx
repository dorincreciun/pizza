"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { MoveRight } from "lucide-react";

import {
    selectCartItems,
    useStoreCart,
} from "@entities/cart";
import {
    createOrder,
    type CreateOrderErrorCode,
} from "@entities/order";
import { APP_ROUTES } from "@shared/config";
import { Link, useRouter } from "@shared/lib/i18n";
import { Button, Input } from "@shared/ui";

type PlaceOrderFormValues = {
    address: string;
};

interface PlaceOrderFormProps {
    isAuthenticated: boolean;
}

export const PlaceOrderForm = ({ isAuthenticated }: PlaceOrderFormProps) => {
    const t = useTranslations("features.checkout");
    const router = useRouter();
    const items = useStoreCart(selectCartItems);
    const clearItems = useStoreCart((state) => state.clearItems);
    const setOpen = useStoreCart((state) => state.setOpen);
    const [formError, setFormError] = useState<CreateOrderErrorCode | null>(
        null,
    );
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PlaceOrderFormValues>({
        defaultValues: { address: "" },
    });

    if (!isAuthenticated) {
        return (
            <Button asChild className="w-full" size="md">
                <Link href={APP_ROUTES.SIGN_IN}>
                    {t("signInToOrder")}
                    <MoveRight aria-hidden />
                </Link>
            </Button>
        );
    }

    const onSubmit = handleSubmit((values) => {
        setFormError(null);

        startTransition(async () => {
            const result = await createOrder({
                address: values.address,
                items: items.map((item) => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    extraIngredientIds: item.extraIngredientIds,
                })),
            });

            if (!result.success) {
                if (result.error === "unauthenticated") {
                    router.replace(APP_ROUTES.SIGN_IN);
                    return;
                }

                setFormError(result.error);
                return;
            }

            clearItems();
            setOpen(false);
            router.replace(APP_ROUTES.ORDERS);
            router.refresh();
        });
    });

    return (
        <form className="flex w-full flex-col gap-3" onSubmit={onSubmit} noValidate>
            <Input
                status={
                    errors.address || formError === "invalidAddress"
                        ? "error"
                        : "default"
                }
            >
                <Input.Label>{t("addressLabel")}</Input.Label>
                <Input.Control size="sm">
                    <Input.Field
                        type="text"
                        autoComplete="street-address"
                        placeholder={t("addressPlaceholder")}
                        {...register("address", {
                            required: true,
                            minLength: 8,
                        })}
                    />
                </Input.Control>
                {formError ? (
                    <Input.Helper>{t(`errors.${formError}`)}</Input.Helper>
                ) : null}
            </Input>

            <Button
                type="submit"
                className="w-full"
                size="md"
                isLoading={isPending}
            >
                {t("submit")}
                <MoveRight aria-hidden />
            </Button>
        </form>
    );
};
