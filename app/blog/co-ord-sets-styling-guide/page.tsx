import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticleLayout from '@/components/blog/BlogArticleLayout'
import { articleMetadata } from '@/lib/blog/posts'

export const metadata: Metadata = articleMetadata('co-ord-sets-styling-guide')

export default function Page() {
  return (
    <BlogArticleLayout slug="co-ord-sets-styling-guide">
      <p>
        If you have ever stood in front of your wardrobe with no idea what goes together, the co-ord set is the
        answer. A co-ord — short for &ldquo;coordinated&rdquo; — is a top and bottom designed to be worn together,
        cut from the same fabric or print so the matching is already done for you. It is the closest thing fashion
        has to a cheat code: you look deliberately styled, but you made one decision instead of five. Here is how to
        get the most out of them.
      </p>

      <h2>Why co-ords earn their place in your wardrobe</h2>
      <p>
        The appeal is not just convenience, though that alone is worth a lot on a busy morning. A good co-ord is
        genuinely <strong>two wardrobes in one</strong>: worn together it is a complete outfit, and split apart it
        gives you two separates that mix with everything else you own. Buy one set and, with a little imagination,
        you have added four or five outfits to your rotation. For value-per-rupee, few things compete.
      </p>

      <h2>Dressing a co-ord up</h2>
      <p>
        To take a relaxed set somewhere smarter, change three things: structure, footwear and jewellery. Choose a
        co-ord with a defined waist or add a thin belt, swap flats for a heeled sandal or mule, and add a pair of
        statement <Link href="/shop/accessories/">earrings</Link>. A sleek clutch or a structured mini bag finishes
        it. The matching fabric already reads expensive, so a few refined touches are all it takes to make a set
        appropriate for dinner, a celebration or the office.
      </p>

      <h2>Dressing a co-ord down</h2>
      <p>
        For everyday wear, lean into ease. White sneakers or slides, a crossbody bag, sunglasses and minimal
        jewellery turn the same set into a weekend look. Roll the sleeves, untuck the top, and let the fabric do its
        thing. A relaxed co-ord in cotton or linen is one of the most comfortable hot-weather outfits you can wear —
        cooler than jeans and far more put-together than a t-shirt.
      </p>

      <h2>The real magic: break it apart</h2>
      <p>
        The most underused styling move is to stop wearing your co-ord as a co-ord. Each half is a separate waiting
        to happen:
      </p>
      <ul>
        <li><strong>The top</strong> works over jeans, trousers or a contrasting skirt. A printed co-ord top instantly elevates a plain pair of <Link href="/shop/bottoms/">trousers</Link>.</li>
        <li><strong>The bottom</strong> pairs with a simple tee, a tucked-in shirt or a fitted bodysuit. Co-ord trousers in a good fabric are often more versatile than the set itself.</li>
        <li><strong>Mix two sets.</strong> If you own two co-ords in complementary colours, swap the halves for two brand-new looks that still feel coordinated.</li>
      </ul>
      <p>
        Once you start thinking of a co-ord as two pieces that happen to match, its value multiplies.
      </p>

      <h2>Choosing the right fabric for Indian weather</h2>
      <p>
        Fabric is what makes or breaks a co-ord in our climate. For most of the year, prioritise breathability:
      </p>
      <ul>
        <li><strong>Cotton</strong> — breathable, durable and easy to wash; ideal for daily wear and the hottest months.</li>
        <li><strong>Linen</strong> — exceptionally cool and elegant, though it creases (which is part of its relaxed charm).</li>
        <li><strong>Viscose and rayon</strong> — fluid and drapey with a soft fall; lovely for dressier sets and evenings.</li>
        <li><strong>Knit</strong> — comfortable and forgiving, best for cooler weather and travel.</li>
      </ul>
      <p>
        Whatever you choose, a quick look at our <Link href="/blog/fabric-care-guide/">fabric care guide</Link> will
        keep the colour and shape intact wear after wear.
      </p>

      <h2>Fit notes</h2>
      <p>
        Because a co-ord is two garments, fit matters twice. The most flattering sets have a little shape — a defined
        or elasticated waist on the bottom and a top that skims rather than tents. If you are between sizes, fit the
        bottom to your hips and the top to your bust, and remember that a relaxed cut is meant to sit away from the
        body. When buying online, compare both pieces to the size chart, or use our{' '}
        <Link href="/blog/womens-clothing-size-guide-india/">size guide</Link> to measure up first.
      </p>

      <div className="blog-callout">
        <p>
          <strong>One-set capsule:</strong> a single neutral co-ord, a pair of white sneakers, a heeled sandal, a
          crossbody bag and one pair of statement earrings will get you a week of outfits — dressed up, dressed down
          and broken apart.
        </p>
      </div>

      <h2>The takeaway</h2>
      <p>
        A co-ord set is the rare piece that is both the easiest thing to wear and one of the most versatile. Wear it
        whole when you want a decision made for you, split it apart when you want range, and choose the fabric to
        match the season. Start with one you genuinely love — browse the latest in{' '}
        <Link href="/shop/new-arrivals/">new arrivals</Link> — and let it do the heavy lifting in your wardrobe.
      </p>
    </BlogArticleLayout>
  )
}
