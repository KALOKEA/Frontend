import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticleLayout from '@/components/blog/BlogArticleLayout'
import { articleMetadata } from '@/lib/blog/posts'

export const metadata: Metadata = articleMetadata('dress-types-guide')

export default function Page() {
  return (
    <BlogArticleLayout slug="dress-types-guide">
      <p>
        &ldquo;Dress&rdquo; is one word for dozens of very different garments. Knowing the names — and, more
        usefully, what each shape actually does for your body — makes shopping faster and far more successful,
        especially online. This guide walks through the dress types you will meet most often, who each one tends to
        flatter, and where it fits in your week. Use it as a reference the next time you are browsing our{' '}
        <Link href="/shop/dresses/">dresses collection</Link> and a label leaves you guessing.
      </p>

      <h2>By length</h2>

      <h3>Maxi dress</h3>
      <p>
        A maxi falls to the ankle or floor. It is the most forgiving length — it skims rather than clings — and
        reads elegant with almost no effort, which is why it is a holiday and evening staple. Flowing maxis suit
        most body types; if you are petite, look for a higher or empire waist to avoid the fabric overwhelming your
        frame, and consider a small heel to keep the hem off the floor.
      </p>

      <h3>Midi dress</h3>
      <p>
        The midi hits between the knee and the ankle, usually mid-calf. It is the most versatile length in modern
        womenswear: appropriate for the office, dinner, brunch and most celebrations. The one thing to watch is
        where the hem lands — the narrowest part of your calf is the most flattering cut-off point.
      </p>

      <h3>Mini dress</h3>
      <p>
        A mini sits above the knee. It is youthful and easy in the heat, and it balances beautifully under a longer
        jacket or shrug. If you love the length but want more coverage, pair it with opaque leggings or tights for a
        layered, season-spanning look.
      </p>

      <h2>By silhouette</h2>

      <h3>A-line dress</h3>
      <p>
        Fitted through the shoulders and bust, then gradually widening towards the hem like the letter A. The A-line
        is endlessly flattering because it defines the narrowest part of your torso and then skims over the hips. If
        you are not sure what suits you, an A-line is the safest place to start.
      </p>

      <h3>Bodycon dress</h3>
      <p>
        Body-conscious and fitted throughout, usually in a fabric with a little stretch. A bodycon celebrates your
        shape rather than hiding it. The secret to wearing one comfortably is the fabric: a thicker, structured knit
        smooths and supports, while a thin jersey reveals everything. Size for comfort, not for the smallest number.
      </p>

      <h3>Wrap dress</h3>
      <p>
        Crossed over at the front and tied at the waist, the wrap is famous for a reason — it suits an enormous
        range of bodies because you control the fit at the waist and neckline yourself. It naturally creates a
        defined waist and a flattering V-neck. A genuine wrap (rather than a faux one) is also wonderfully easy to
        get in and out of.
      </p>

      <h3>Shift dress</h3>
      <p>
        A shift hangs straight from the shoulders with no defined waist. Clean, simple and slightly retro, it is
        brilliant for warm weather because nothing clings, and it makes a perfect canvas for accessories. If you
        prefer some shape, add a belt at the waist.
      </p>

      <h3>Shirt dress</h3>
      <p>
        Cut like a long shirt, buttoned down the front, often with a collar. The shirt dress is the definition of
        easy polish — it works open over trousers, belted as a dress, or left relaxed for the weekend. A crisp
        cotton shirt dress is one of the most practical things you can own.
      </p>

      <h3>Slip dress</h3>
      <p>
        Bias-cut, fluid and minimal, with thin straps. A slip looks effortless on its own in summer and transforms
        completely when layered over a t-shirt or under a jacket — making it one of the best value pieces for the
        number of outfits it produces.
      </p>

      <h2>By occasion</h2>
      <p>
        Once you know the shapes, matching them to your week becomes intuitive:
      </p>
      <ul>
        <li><strong>Everyday and work:</strong> shirt dresses, midi A-lines and shift dresses in cotton or fluid fabrics.</li>
        <li><strong>Brunch and casual outings:</strong> mini and midi dresses, slip dresses layered over a tee.</li>
        <li><strong>Evening and celebrations:</strong> bodycon, wrap and maxi dresses in richer fabrics, dressed up with heels and <Link href="/shop/accessories/">jewellery</Link>.</li>
        <li><strong>Travel and holidays:</strong> maxi and shift dresses that pack small and resist creasing.</li>
      </ul>

      <h2>Finding the right shape for your body</h2>
      <p>
        There are no rules here, only tendencies — the most important thing is that you feel good. That said, a few
        gentle guidelines help when you cannot try before you buy:
      </p>
      <ul>
        <li><strong>To define a waist:</strong> wrap, A-line and belted styles all create shape where there may be little.</li>
        <li><strong>To balance broader hips:</strong> A-line and fit-and-flare shapes skim rather than cling below the waist.</li>
        <li><strong>To add curves:</strong> ruching, wrap details and bias cuts create the illusion of shape.</li>
        <li><strong>To elongate a petite frame:</strong> higher waistlines, vertical details and monochrome dressing all add height.</li>
      </ul>

      <div className="blog-callout">
        <p>
          <strong>Before you order:</strong> the single biggest cause of dress returns is sizing, not style. Spend
          two minutes with our <Link href="/blog/womens-clothing-size-guide-india/">women&rsquo;s size guide</Link>{' '}
          to measure yourself properly and order the right fit the first time.
        </p>
      </div>

      <h2>The takeaway</h2>
      <p>
        You do not need every silhouette — you need to know which two or three genuinely suit your body and your
        life, and then build from there. Once the vocabulary clicks, online shopping stops being a gamble and starts
        being fun. Browse the full <Link href="/shop/dresses/">dresses edit</Link> with this guide open, and you will
        know exactly what you are looking at.
      </p>
    </BlogArticleLayout>
  )
}
