import { CategoryProducts } from "@/features/categories/category-products";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <CategoryProducts slug={slug} />;
}
