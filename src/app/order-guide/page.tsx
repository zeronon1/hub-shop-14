import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OrderGuideView from "@/components/order-guide/OrderGuideView";
import { getOrderGuideContent } from "@/lib/order-guide";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getOrderGuideContent();
  return {
    title: `${content.title} | One Box Shop`,
    description: content.subtitle || content.title,
  };
}

export default async function OrderGuidePage() {
  const content = await getOrderGuideContent();

  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <div className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">
              Order guide
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{content.title}</h1>
            {content.subtitle ? (
              <p className="mt-2 max-w-2xl text-sm text-foreground/70 sm:text-base">
                {content.subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <OrderGuideView content={content} />
      </main>
      <Footer />
    </>
  );
}
