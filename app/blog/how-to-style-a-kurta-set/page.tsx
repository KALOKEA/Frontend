import type { Metadata } from 'next'
import { getDbPosts, getDbPost } from '@/lib/server/blogServer'
import DbArticleLayout from '@/components/blog/DbArticleLayout'

const SLUG = 'how-to-style-a-kurta-set'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.com'

export async function generateMetadata(): Promise<Metadata> {
  const post = await getDbPost(SLUG)
  if (!post) return { title: 'Article not found | Kalokea Journal', robots: { index: false } }
  const url = `${SITE_URL}/blog/${post.slug}/`
  return {
    title: `${post.title} | Kalokea Journal`,
    description: post.description || post.excerpt || undefined,
    keywords: Array.isArray(post.keywords) ? post.keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt || undefined,
      url,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      images: [{ url: post.cover_image || `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: post.heading || post.title }],
    },
  }
}

export default async function Page() {
  const post = await getDbPost(SLUG)
  if (!post) {
    return (
      <div className="text-center py-24 bg-[#FDFAF6]">
        <h1 className="font-serif text-3xl text-[#0A0908] mb-2">Article not found</h1>
        <p className="text-sm font-sans text-[#6B5E55]">This article may no longer be available.</p>
      </div>
    )
  }
  const all = await getDbPosts()
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3)
  return <DbArticleLayout post={post} related={related} />
}
