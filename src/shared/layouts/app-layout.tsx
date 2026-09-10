import { ReactNode } from "react";

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="mx-auto block w-full max-w-480 flex-1">{children}</div>
    );
};
