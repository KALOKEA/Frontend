import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticleLayout from '@/components/blog/BlogArticleLayout'
import { articleMetadata } from '@/lib/blog/posts'

export const metadata: Metadata = articleMetadata('how-to-style-a-kurta-set')

export default function Page() {
  return (
    <BlogArticleLayout slug="how-to-style-a-kurta-set">
      <p>
        A good kurta set is the most versatile thing in an Indian wardrobe. It is comfortable in the heat, modest
        when you need it to be, and — styled well — capable of carrying you from a Monday at the office to a wedding
        on Saturday. The trouble is that most of us wear ours exactly one way. This guide breaks down{' '}
        <strong>ten distinct looks from the same starting point</strong>, with practical notes on footwear,
        jewellery, layering and draping so you can actually recreate them.
      </p>

      <h2>Start with the right base</h2>
      <p>
        Before the styling, a quick word on the kurta itself. The most flexible kurta sets are in solid or subtly
        printed breathable fabrics — cotton, mul, rayon or a soft viscose — in a length that hits between mid-thigh
        and the knee. A straight or slightly A-line cut layers more easily than a heavily flared one. If you are
        building a wardrobe from scratch, one neutral set and one in a colour you love will take you remarkably far.
      </p>

      <h2>The ten looks</h2>

      <h3>1. The polished office look</h3>
      <p>
        Keep the kurta and matching trousers, skip the dupatta, and add a structured tote and closed flats or block
        heels. A watch and small studs are all the jewellery you need. The absence of the dupatta instantly makes
        the set read more professional. Finish with a <Link href="/shop/bags/">structured bag</Link> in a neutral
        tone.
      </p>

      <h3>2. Kurta with jeans</h3>
      <p>
        Take just the kurta top and wear it over straight or wide-leg jeans for an everyday fusion look. Roll the
        sleeves, add white sneakers or mules, and a crossbody bag. This is the single most useful way to double the
        wear you get from any kurta.
      </p>

      <h3>3. Festive, with the dupatta front and centre</h3>
      <p>
        For festivals, let the dupatta do the talking. Drape it in a soft, diagonal cascade across one shoulder,
        add statement <Link href="/shop/accessories/">jhumkas</Link> and a few bangles, and switch to embellished
        juttis or kolhapuris. A bindi and a bolder lip complete it.
      </p>

      <h3>4. The minimalist evening look</h3>
      <p>
        Go tonal: kurta, trousers and dupatta all in shades of the same colour. Minimal gold jewellery, sleek hair,
        and a single metallic heel. Tone-on-tone dressing always looks more expensive than it is, and it photographs
        beautifully.
      </p>

      <h3>5. Layered with a jacket or shrug</h3>
      <p>
        Add a long sleeveless jacket, a denim jacket or a structured blazer over the kurta. Layering creates an
        instant outfit and works brilliantly in air-conditioned offices and cooler evenings. A blazer over a kurta
        and trousers is one of the smartest fusion looks you can wear to work.
      </p>

      <h3>6. Belted for shape</h3>
      <p>
        If your kurta is straight or oversized, cinch it with a thin tan or black belt at the natural waist. This
        single move transforms a relaxed kurta into a defined, deliberate silhouette — especially flattering on
        longer kurtas worn as dresses.
      </p>

      <h3>7. Kurta as a dress</h3>
      <p>
        A longer kurta can be worn on its own as a dress with leggings or even bare-legged with flats. Add a
        crossbody bag and you have a five-minute summer outfit. Look for kurtas that hit at or below the knee for
        this to work comfortably.
      </p>

      <h3>8. The travel look</h3>
      <p>
        For long journeys, choose the softest fabric you own, skip anything that creases badly, and add slip-on
        shoes and a roomy tote. A kurta set is far more comfortable than jeans on a flight or train, and you will
        still look pulled together when you arrive.
      </p>

      <h3>9. Monochrome with a contrast dupatta</h3>
      <p>
        Wear a solid kurta and trousers in one colour, then add a dupatta in a contrasting or printed fabric as the
        single focal point. This is the easiest way to make a plain set feel intentional and styled.
      </p>

      <h3>10. Dressed up for a wedding</h3>
      <p>
        For someone else&rsquo;s big day, choose your most embellished set, add statement earrings and a clutch,
        and embrace heels. A neat low bun or a sleek braid with fresh flowers keeps the focus on the outfit. Keep
        the rest of the jewellery restrained so the look stays elegant rather than busy.
      </p>

      <h2>The details that pull it all together</h2>
      <ul>
        <li><strong>Footwear changes everything.</strong> Sneakers read casual, juttis read festive, block heels read formal. Decide the mood, then choose the shoe.</li>
        <li><strong>One statement, not five.</strong> Either bold earrings or a bold bag or a bold lip — rarely all three. Restraint is what separates styled from costume.</li>
        <li><strong>Mind the proportions.</strong> A fitted kurta pairs with volume below (wide trousers); a flowing kurta pairs with something slim (cigarette pants, leggings).</li>
        <li><strong>Iron the dupatta.</strong> Nothing undoes a good outfit faster than a crumpled drape. Our <Link href="/blog/fabric-care-guide/">fabric care guide</Link> has tips for keeping delicate fabrics crisp.</li>
      </ul>

      <h2>Build your own kurta capsule</h2>
      <p>
        You do not need a dozen kurta sets — you need a few good ones and the confidence to restyle them. Start with
        one neutral and one coloured set, a dupatta you love, a pair of juttis, a pair of block heels and a couple of{' '}
        <Link href="/shop/accessories/">jewellery</Link> options. With those pieces, every one of the ten looks above
        is within reach. Explore <Link href="/shop/new-arrivals/">new arrivals</Link> when you are ready to add to
        the rotation.
      </p>
    </BlogArticleLayout>
  )
}
