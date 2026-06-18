import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticleLayout, { type FaqItem } from '@/components/blog/BlogArticleLayout'
import { articleMetadata } from '@/lib/blog/posts'

export const metadata: Metadata = articleMetadata('womens-clothing-size-guide-india')

const faq: FaqItem[] = [
  {
    q: 'How do I measure my dress size at home?',
    a: 'Use a soft measuring tape and measure three points: bust (around the fullest part), natural waist (the narrowest part of your torso, usually just above the navel) and hips (around the fullest part). Keep the tape level and snug but not tight, and measure over thin clothing or bare skin for accuracy. Compare those numbers to the size chart on the product page rather than guessing from your usual size.',
  },
  {
    q: 'What is the difference between Indian, UK, US and EU sizes?',
    a: 'They use different numbering but map to the same body. As a rough guide, an Indian size 38 is roughly a UK 10, a US 6 and an EU 38; an Indian 40 is roughly a UK 12 / US 8 / EU 40. Always check the brand’s own chart, since cut and fit vary between labels even within the same nominal size.',
  },
  {
    q: 'Should I size up or size down when I am between sizes?',
    a: 'It depends on the garment. For fitted or stretch styles like bodycon dresses, sizing up usually gives a more comfortable fit. For relaxed or oversized styles, you can often take the smaller size. When in doubt, size up for tops and dresses you plan to wear for long periods, and check the fabric — non-stretch woven fabrics are less forgiving than knits.',
  },
  {
    q: 'Why do I fit different sizes in different brands?',
    a: 'There is no universal sizing standard, so each brand sets its own measurements. This is called vanity sizing variation. The only reliable approach is to ignore the label number and compare your body measurements to the specific chart for the item you are buying.',
  },
  {
    q: 'What if my measurements fall across two different sizes?',
    a: 'This is very common — many women are one size on top and another on the bottom. For dresses and one-pieces, choose the size that matches your largest relevant measurement (usually bust or hips) and have the rest tailored if needed. For separates, simply buy each piece in its own correct size.',
  },
]

export default function Page() {
  return (
    <BlogArticleLayout slug="womens-clothing-size-guide-india" faq={faq}>
      <p>
        The number one reason clothes get returned is not style — it is fit. The good news is that ordering the
        right size online is a skill, not luck. With a tape measure, five minutes and this guide, you can buy with
        confidence and dramatically cut the odds of a disappointing parcel. Here is exactly how to measure yourself,
        read a size chart, and convert between the sizing systems you will see while shopping in India.
      </p>

      <h2>What you need</h2>
      <p>
        Just a soft measuring tape (the flexible kind used for sewing) and, ideally, a second person to help keep it
        level. If you only have a rigid tape or a ruler, use a piece of string to wrap around your body, mark it,
        then measure the string flat. Measure over thin clothing or bare skin — never over thick fabric — and stand
        relaxed, in your normal posture.
      </p>

      <h2>The three measurements that matter most</h2>
      <ul>
        <li><strong>Bust:</strong> wrap the tape around the fullest part of your chest, keeping it level across your back. Do not pull it tight.</li>
        <li><strong>Waist:</strong> find the narrowest part of your torso — usually an inch or so above your navel — and measure there. Bend gently to one side; the crease that forms is your natural waist.</li>
        <li><strong>Hips:</strong> measure around the fullest part of your hips and seat, with your feet together.</li>
      </ul>
      <p>
        For trousers and well-fitted dresses, two more help: <strong>inseam</strong> (from the crotch seam to the
        ankle, for trouser length) and <strong>shoulder-to-shoulder</strong> (across your upper back between the
        shoulder seams). Write these numbers down and keep them in your phone — you will use them every time you
        shop.
      </p>

      <div className="blog-callout">
        <p>
          <strong>Tip:</strong> measure at the end of the day if you can. Most bodies are very slightly larger in the
          evening, and clothes that fit then will be comfortable all day.
        </p>
      </div>

      <h2>How to read a size chart</h2>
      <p>
        Every Kalokea product page lists the exact measurements for each size. Compare your body numbers to the
        chart and pick the size where your measurements fall within the range — not the size you usually assume you
        are. If your bust suggests one size and your hips another, choose based on the area that needs to fit best
        for that particular garment (the bust for a fitted top, the hips for a bodycon skirt). For a full breakdown
        of our cuts, the dedicated <Link href="/size-guide/">size guide</Link> page has the complete charts.
      </p>

      <h2>Indian, UK, US and EU size conversion</h2>
      <p>
        Sizing systems differ by region, which is why one label calls you a 38 and another a 10. As a general
        starting point:
      </p>
      <ul>
        <li><strong>Indian 36</strong> ≈ UK 8 ≈ US 4 ≈ EU 36 (XS–S)</li>
        <li><strong>Indian 38</strong> ≈ UK 10 ≈ US 6 ≈ EU 38 (S)</li>
        <li><strong>Indian 40</strong> ≈ UK 12 ≈ US 8 ≈ EU 40 (M)</li>
        <li><strong>Indian 42</strong> ≈ UK 14 ≈ US 10 ≈ EU 42 (L)</li>
        <li><strong>Indian 44</strong> ≈ UK 16 ≈ US 12 ≈ EU 44 (XL)</li>
      </ul>
      <p>
        Treat these as a guide, not gospel. Cut, fabric and brand philosophy all shift the real fit, so the body
        measurements on the product page always win over the conversion table.
      </p>

      <h2>Fabric and cut change everything</h2>
      <p>
        Two dresses in the same &ldquo;size M&rdquo; can fit completely differently. A stretch jersey forgives a
        centimetre or two; a structured cotton or linen does not. A relaxed, oversized cut is meant to sit away from
        the body, while a bodycon is meant to follow it. Always read the fit description — &ldquo;relaxed&rdquo;,
        &ldquo;true to size&rdquo;, &ldquo;runs small&rdquo; — alongside the numbers. Our{' '}
        <Link href="/blog/dress-types-guide/">guide to dress types</Link> explains how each silhouette is supposed to
        sit.
      </p>

      <h2>A quick pre-order checklist</h2>
      <ul>
        <li>Have you measured bust, waist and hips recently (not from memory)?</li>
        <li>Did you compare those numbers to <em>this</em> product&rsquo;s chart, not your usual size?</li>
        <li>Did you read the fit note and fabric — stretch or woven, relaxed or fitted?</li>
        <li>If between sizes, did you size up for fitted styles and consider your priority measurement?</li>
      </ul>

      <p>
        Do those four things and the right size becomes predictable. And if something still is not perfect, our easy
        7-day returns mean you are never stuck — though with a little measuring up front, you will rarely need them.
        Ready to put it to use? Explore <Link href="/shop/dresses/">dresses</Link> and{' '}
        <Link href="/shop/tops/">tops</Link> with your measurements in hand.
      </p>
    </BlogArticleLayout>
  )
}
