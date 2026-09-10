import enFeatures from "../../../messages/en/features.json";
import enPages from "../../../messages/en/pages.json";
import enShared from "../../../messages/en/shared.json";
import enWidgets from "../../../messages/en/widgets.json";

type Messages = {
    shared: typeof enShared;
    features: typeof enFeatures;
    widgets: typeof enWidgets;
    pages: typeof enPages;
};

declare module "next-intl" {
    interface AppConfig {
        Messages: Messages;
    }
}
