// This is a Server Component
import ProductInsightsClient from './ProductInsightsClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductInsightsPage({ params }: PageProps) {
  return <ProductInsightsClient id={params.id} />;
}
