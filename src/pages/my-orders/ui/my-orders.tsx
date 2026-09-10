import { getTranslations } from "next-intl/server";

import { Container } from "@shared/ui/container";
import { Title } from "@shared/ui/title";

export async function MyOrdersPage() {
    const t = await getTranslations("pages.OrdersPage");

    return (
        <Container className="py-6 sm:py-8 lg:py-12">
            <Title as="h1" size="xl" className="mb-5 sm:mb-6 lg:mb-8">
                {t("title")}
            </Title>
        </Container>
    );
}
