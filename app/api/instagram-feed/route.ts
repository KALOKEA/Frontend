// NOTE: Instagram feed is served by the NestJS backend at GET /instagram-feed
// This stub exists only so the app/api directory does not cause TypeScript errors.
// It is never called in production — InstagramGrid.tsx fetches directly from
// the NestJS backend URL (NEXT_PUBLIC_API_URL/instagram-feed).
export const dynamic = 'force-static'

export async function GET() {
  return Response.json({ data: [] })
}
