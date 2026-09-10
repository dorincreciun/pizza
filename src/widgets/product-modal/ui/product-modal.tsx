import Image from "next/image";

import type { ProductDetailModel } from "@entities/product";
import { AddToCartPanel } from "@features/add-to-cart";
import { Modal } from "@shared/ui";
import { cn } from "@shared/utils";
import { ModalCloseBack, ModalShell } from "@widgets/modal";

interface ProductModalProps {
    product: ProductDetailModel;
}

export const ProductModal = ({ product }: ProductModalProps) => {
    return (
        <ModalShell>
            <Modal className="w-full max-w-5xl">
                <ModalCloseBack />

                <Modal.Body className="min-w-0 p-0">
                    <div className="grid w-full min-w-0 grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
                        <div
                            className={cn(
                                "relative flex min-w-0 items-center justify-center",
                                "bg-linear-to-b from-[#FFFCF7] to-[#FFF6EA]",
                                "p-6 sm:p-10 lg:p-12",
                            )}
                        >
                            <div
                                className={cn(
                                    "relative aspect-square w-full max-w-[420px]",
                                    "flex items-center justify-center",
                                    "overflow-hidden rounded-full border border-dashed border-[#E8DDC9]",
                                )}
                            >
                                <div
                                    className={cn(
                                        "aspect-square w-[82%]",
                                        "flex items-center justify-center",
                                        "overflow-hidden rounded-full border border-dashed border-[#E8DDC9]",
                                    )}
                                >
                                    <Image
                                        className="aspect-square w-[90%] object-contain drop-shadow-xl"
                                        width={420}
                                        height={420}
                                        src={product.imageUrl}
                                        alt={product.name}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col bg-white p-5 sm:p-6 lg:p-8">
                            <AddToCartPanel
                                product={product}
                                compact
                                className="min-h-0"
                                buttonClassName="w-full"
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </ModalShell>
    );
};
