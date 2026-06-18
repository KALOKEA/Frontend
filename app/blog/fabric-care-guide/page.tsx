import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticleLayout, { type FaqItem } from '@/components/blog/BlogArticleLayout'
import { articleMetadata } from '@/lib/blog/posts'

export const metadata: Metadata = articleMetadata('fabric-care-guide')

const faq: FaqItem[] = [
  {
    q: 'How do I stop dark clothes from fading?',
    a: 'Wash dark colours inside out in cold water, use a mild detergent, and avoid over-washing — air them between wears instead. Heat and sunlight are the main causes of fading, so dry dark clothes in shade rather than direct sun, and skip the tumble dryer when you can.',
  },
  {
    q: 'Can I machine wash silk?',
    a: 'Most silk is happiest hand-washed in cold water with a gentle detergent, or dry-cleaned if the label says so. If your machine has a dedicated silk or delicate cycle and you place the garment in a mesh bag, you can machine wash some silks on cold — but always test and check the care label first. Never wring silk; press the water out gently and dry flat in shade.',
  },
  {
    q: 'How do I get wrinkles out of linen without an iron?',
    a: 'Hang the garment in the bathroom while you shower — the steam relaxes the fibres. A handheld steamer works even better. That said, a few soft creases are part of linen’s natural character, so you do not need to chase a perfectly crisp finish.',
  },
  {
    q: 'What temperature should I wash my clothes at?',
    a: 'Cold water (around 30°C or lower) is best for the vast majority of garments. It protects colours, prevents shrinkage, saves energy and is gentler on fibres. Reserve warm or hot water for whites, towels and heavily soiled items that can take it.',
  },
  {
    q: 'How should I store clothes I am not wearing for a season?',
    a: 'Make sure everything is clean and completely dry, fold knits rather than hanging them (hanging stretches the shoulders), and store in a cool, dry place away from direct sunlight. Use breathable cotton garment bags rather than plastic, and add cedar or neem to deter moths naturally.',
  },
]

export default function Page() {
  return (
    <BlogArticleLayout slug="fabric-care-guide" faq={faq}>
      <p>
        The most sustainable, money-saving thing you can do for your wardrobe is also the simplest: take good care of
        what you already own. Clothes rarely wear out because of the fabric — they fade, stretch, shrink or pill
        because of how they are washed, dried and stored. Learn a few fabric-specific habits and your favourite
        pieces will look new for years. Here is a clear, fabric-by-fabric guide to making that happen.
      </p>

      <h2>First, read the label</h2>
      <p>
        Every care decision starts with the little tag inside the seam. The symbols tell you the maximum safe wash
        temperature, whether the garment can be tumble-dried, ironed or bleached, and whether it needs dry cleaning.
        When a label and this guide disagree, follow the label — the manufacturer knows the specific blend. When in
        doubt, treat a garment as more delicate than you think; you can always wash more aggressively next time, but
        you cannot un-shrink a sweater.
      </p>

      <h2>The universal rules</h2>
      <ul>
        <li><strong>Wash less.</strong> Most clothes are washed far more than they need to be. Air them out between wears; wash when actually dirty, not by default. Less washing means less wear.</li>
        <li><strong>Cold water wins.</strong> Around 30°C protects colour and shape, prevents shrinkage and saves energy. Hot water is rarely necessary outside of whites and towels.</li>
        <li><strong>Turn things inside out.</strong> This protects the outer surface — and the colour — from friction in the machine.</li>
        <li><strong>Skip the dryer when you can.</strong> Heat is the enemy of elastic, colour and fibre. Air-drying in shade is gentler and free.</li>
        <li><strong>Use less detergent.</strong> Excess detergent does not clean better; it leaves residue that dulls fabric and irritates skin.</li>
      </ul>

      <h2>Fabric by fabric</h2>

      <h3>Cotton</h3>
      <p>
        Hard-wearing and easy, cotton is the workhorse of an Indian wardrobe. Wash in cold to warm water; the main
        risk is shrinkage from heat, so air-dry or use a low tumble setting. Iron while slightly damp for the
        crispest finish. Dark cottons fade with sun and over-washing, so dry them in shade.
      </p>

      <h3>Linen</h3>
      <p>
        Linen is the coolest fabric for hot weather and only gets softer with age. Wash gently in cold water and dry
        flat or on a line. Embrace its natural, relaxed creasing rather than fighting it — a steamer handles the
        rest. Avoid high heat, which can make linen brittle over time.
      </p>

      <h3>Silk</h3>
      <p>
        Silk rewards gentle handling. Hand-wash in cold water with a mild detergent, or dry-clean delicate pieces.
        Never wring it — press the water out and dry flat, away from direct sun. Store silk loosely so it can
        breathe, and iron on the lowest setting, ideally through a cloth.
      </p>

      <h3>Rayon and viscose</h3>
      <p>
        These fluid, drapey fabrics are beautiful but can be sensitive to water and heat, sometimes shrinking or
        losing shape if treated roughly. Hand-wash or use a delicate cold cycle in a mesh bag, reshape while damp,
        and dry flat. Iron on low. Check the label, as some viscose blends are dry-clean only.
      </p>

      <h3>Knits and wool</h3>
      <p>
        The enemy of knitwear is stretching and pilling. Always fold knits to store them — hanging drags the
        shoulders out of shape. Wash gently in cold water, dry flat (never on a hanger), and de-pill occasionally
        with a fabric comb or shaver to keep the surface smooth.
      </p>

      <h3>Embellished and embroidered pieces</h3>
      <p>
        Anything with beadwork, sequins or delicate embroidery should be turned inside out and hand-washed, or
        dry-cleaned. Store these flat or padded on a hanger so the embellishments do not snag, and keep them in a
        breathable cover.
      </p>

      <h2>Storing clothes the right way</h2>
      <p>
        How you store clothes between seasons matters as much as how you wash them. Make sure everything is clean and
        bone-dry first — stored moisture causes mildew and yellowing. Fold heavy knits, hang structured pieces on
        proper hangers, and keep everything out of direct light to prevent fading. Choose breathable cotton garment
        bags over plastic, which traps humidity, and reach for natural moth deterrents like cedar or neem rather
        than harsh chemicals.
      </p>

      <div className="blog-callout">
        <p>
          <strong>Treat stains immediately.</strong> Blot — never rub — with cold water as soon as a spill happens.
          Heat and time set stains permanently, so the faster you act, the better the outcome. Avoid the dryer until
          you are sure a stain is fully gone.
        </p>
      </div>

      <h2>The takeaway</h2>
      <p>
        Good fabric care is a handful of small habits — cold water, less washing, shade-drying, careful storage —
        that together add years to your clothes and keep their colour and shape intact. It is the quiet half of
        dressing well, and the kindest thing you can do for both your wardrobe and your wallet. Looking after pieces
        you love also makes it easier to buy thoughtfully — explore our{' '}
        <Link href="/shop/">considered collection</Link> when you are ready to add something new, and read up on{' '}
        <Link href="/blog/womens-fashion-trends-2026/">this year&rsquo;s trends</Link> while you are here.
      </p>
    </BlogArticleLayout>
  )
}
