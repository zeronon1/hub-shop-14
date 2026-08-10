import ProductFormClient from "@/components/admin/ProductFormClient";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <ProductFormClient productId={id} />;
}
