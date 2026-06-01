import SlugRedirect from './SlugRedirect'

// Required for dynamic routes with output: 'export'.
// Returns [] so no pages are pre-rendered — redirect handles navigation.
export function generateStaticParams() {
  return []
}

export default function ProductSlugPage({ params }: { params: { slug: string } }) {
  return <SlugRedirect slug={params.slug} />
}
