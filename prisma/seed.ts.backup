import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.admin.upsert({
    where: { email: 'admin@modestdirectory.be' },
    update: {},
    create: {
      email: 'admin@modestdirectory.be',
      passwordHash: adminPassword,
    },
  })
  console.log('✅ Admin user created: admin@modestdirectory.be / admin123')

  // ============================================
  // LANDEN
  // ============================================
  const countries = [
    {
      code: 'NL',
      name: 'Nederland',
      nameLocal: 'Nederland',
      slug: 'nederland',
      description: 'Ontdek de beste hijab shops, modest fashion winkels en abaya boutiques in heel Nederland. Van Amsterdam tot Rotterdam, vind jouw perfecte modest fashion bestemming.',
      metaTitle: 'Hijab Shops Nederland - Modest Fashion Winkels',
      metaDesc: 'Vind de beste hijab shops en modest fashion winkels in Nederland. Bekijk onze gids met beoordelingen.',
    },
    {
      code: 'BE',
      name: 'België',
      nameLocal: 'België',
      slug: 'belgie',
      description: 'Verken de mooiste hijab shops, modest fashion boutiques en islamitische kledingwinkels in België. Van Brussel tot Antwerpen, ontdek modest fashion bij jou in de buurt.',
      metaTitle: 'Hijab Shops België - Modest Fashion Winkels',
      metaDesc: 'Vind de beste hijab shops en modest fashion winkels in België. Bekijk onze gids met beoordelingen.',
    },
  ]

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    })
  }
  console.log(`✅ ${countries.length} landen aangemaakt`)

  // ============================================
  // STEDEN
  // ============================================
  const nlCountry = await prisma.country.findUnique({ where: { code: 'NL' } })
  const beCountry = await prisma.country.findUnique({ where: { code: 'BE' } })

  const cities = [
    // Nederland
    { name: 'Amsterdam', slug: 'amsterdam', countryId: nlCountry!.id, population: 872000, metaTitle: 'Hijab Shops Amsterdam', metaDesc: 'Ontdek de beste hijab shops en modest fashion winkels in Amsterdam.' },
    { name: 'Rotterdam', slug: 'rotterdam', countryId: nlCountry!.id, population: 651000, metaTitle: 'Hijab Shops Rotterdam', metaDesc: 'Vind de beste hijab winkels en modest fashion in Rotterdam.' },
    { name: 'Den Haag', slug: 'den-haag', countryId: nlCountry!.id, population: 545000, metaTitle: 'Hijab Shops Den Haag', metaDesc: 'Ontdek hijab shops en modest fashion winkels in Den Haag.' },
    { name: 'Utrecht', slug: 'utrecht', countryId: nlCountry!.id, population: 357000, metaTitle: 'Hijab Shops Utrecht', metaDesc: 'Vind hijab winkels en modest fashion in Utrecht.' },
    { name: 'Eindhoven', slug: 'eindhoven', countryId: nlCountry!.id, population: 234000, metaTitle: 'Hijab Shops Eindhoven', metaDesc: 'Ontdek hijab shops in Eindhoven.' },
    // België
    { name: 'Brussel', slug: 'brussel', countryId: beCountry!.id, population: 1200000, metaTitle: 'Hijab Shops Brussel', metaDesc: 'Ontdek de beste hijab shops en modest fashion winkels in Brussel.' },
    { name: 'Antwerpen', slug: 'antwerpen', countryId: beCountry!.id, population: 520000, metaTitle: 'Hijab Shops Antwerpen', metaDesc: 'Vind de beste hijab winkels en modest fashion in Antwerpen.' },
    { name: 'Gent', slug: 'gent', countryId: beCountry!.id, population: 262000, metaTitle: 'Hijab Shops Gent', metaDesc: 'Ontdek hijab shops en modest fashion winkels in Gent.' },
    { name: 'Luik', slug: 'luik', countryId: beCountry!.id, population: 197000, metaTitle: 'Hijab Shops Luik', metaDesc: 'Vind hijab winkels in Luik.' },
    { name: 'Charleroi', slug: 'charleroi', countryId: beCountry!.id, population: 201000, metaTitle: 'Hijab Shops Charleroi', metaDesc: 'Ontdek hijab shops in Charleroi.' },
  ]

  for (const city of cities) {
    const existing = await prisma.city.findUnique({ where: { slug: city.slug } })
    if (!existing) {
      await prisma.city.create({ data: city })
    }
  }
  console.log(`✅ ${cities.length} steden aangemaakt`)

  // ============================================
  // CATEGORIEËN
  // ============================================
  const categories = [
    { name: 'Hijabs', slug: 'hijab-shops', namePlural: 'Hijab Shops', icon: '🧕', sortOrder: 1, metaTitle: 'Hijab Shops', metaDesc: 'Vind de beste hijab winkels bij jou in de buurt.' },
    { name: 'Abayas', slug: 'abaya-shops', namePlural: 'Abaya Winkels', icon: '👗', sortOrder: 2, metaTitle: 'Abaya Winkels', metaDesc: 'Ontdek de mooiste abaya winkels en collecties.' },
    { name: 'Modest Fashion', slug: 'modest-fashion', namePlural: 'Modest Fashion Winkels', icon: '✨', sortOrder: 3, metaTitle: 'Modest Fashion Winkels', metaDesc: 'Shop modest fashion bij de beste winkels.' },
    { name: 'Islamitische Kleding', slug: 'islamitische-kleding', namePlural: 'Islamitische Kledingwinkels', icon: '🌙', sortOrder: 4, metaTitle: 'Islamitische Kleding', metaDesc: 'Vind islamitische kledingwinkels bij jou in de buurt.' },
  ]

  for (const category of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: category.slug } })
    if (!existing) {
      await prisma.category.create({ data: category })
    }
  }
  console.log(`✅ ${categories.length} categorieën aangemaakt`)

  // ============================================
  // FAQs
  // ============================================
  const faqs = [
    { question: 'Wat is ModestDirectory?', answer: 'ModestDirectory is een online gids voor islamitische kledingwinkels in Nederland en België. We helpen je de beste hijab shops, abaya winkels en modest fashion boutiques te vinden.', category: 'algemeen', sortOrder: 1 },
    { question: 'Hoe kan ik mijn winkel aanmelden?', answer: 'Je kunt je winkel gratis aanmelden via onze aanmeldpagina. Vul je gegevens in en wij beoordelen je aanvraag binnen 48 uur.', category: 'algemeen', sortOrder: 2 },
    { question: 'Zijn de reviews betrouwbaar?', answer: 'Ja, alle reviews worden geverifieerd via email. Alleen echte klanten kunnen een review achterlaten.', category: 'algemeen', sortOrder: 3 },
    { question: 'Wat voor soort hijabs kan ik vinden?', answer: 'In onze gids vind je winkels met alle soorten hijabs: chiffon, jersey, satijn, katoen, en meer. Van dagelijkse basics tot speciale gelegenheden.', category: 'hijabs', sortOrder: 1 },
    { question: 'Wat is een abaya?', answer: 'Een abaya is een lang, los gewaad dat vaak door moslimvrouwen wordt gedragen. Het bedekt het hele lichaam behalve het gezicht, handen en voeten.', category: 'abayas', sortOrder: 1 },
    { question: 'Leveren de winkels ook naar Nederland/België?', answer: 'De meeste webshops in onze gids leveren naar zowel Nederland als België. Check altijd de verzendvoorwaarden op de website van de winkel.', category: 'verzending', sortOrder: 1 },
  ]

  for (const faq of faqs) {
    const existing = await prisma.fAQ.findFirst({ where: { question: faq.question } })
    if (!existing) {
      await prisma.fAQ.create({ data: faq })
    }
  }
  console.log(`✅ ${faqs.length} FAQs aangemaakt`)

  // ============================================
  // AD PLACEMENTS
  // ============================================
  const adPlacements = [
    { slot: 'homepage-header', type: 'ADSENSE' as const },
    { slot: 'sidebar-top', type: 'ADSENSE' as const },
    { slot: 'sidebar-bottom', type: 'ADSENSE' as const },
    { slot: 'listings-inline', type: 'ADSENSE' as const },
    { slot: 'footer-banner', type: 'ADSENSE' as const },
  ]

  for (const placement of adPlacements) {
    const existing = await prisma.adPlacement.findUnique({ where: { slot: placement.slot } })
    if (!existing) {
      await prisma.adPlacement.create({ data: placement })
    }
  }
  console.log(`✅ ${adPlacements.length} ad placements aangemaakt`)

  // ============================================
  // SAMPLE SHOPS
  // ============================================
  const existingShop = await prisma.shop.findUnique({ where: { slug: 'byoumich' } })
  
  if (!existingShop) {
    const hijabCategory = await prisma.category.findUnique({ where: { slug: 'hijab-shops' } })
    
    const byoumich = await prisma.shop.create({
      data: {
        name: 'byOumich',
        slug: 'byoumich',
        shortDescription: 'Premium hijabs en modest fashion. Satijnen plissé hijabs, chiffon en meer.',
        longDescription: 'byOumich biedt een prachtige collectie hijabs van hoge kwaliteit. Van satijnen plissé hijabs tot zachte chiffon sjaals, wij hebben voor elke gelegenheid de perfecte hijab.',
        city: 'Brussel',
        citySlug: 'brussel',
        country: 'BE',
        websiteUrl: 'https://oumich.com',
        email: 'info@oumich.com',
        isWebshop: true,
        isPhysicalStore: false,
        isFeatured: true,
        status: 'APPROVED',
        categories: hijabCategory ? {
          create: { categoryId: hijabCategory.id }
        } : undefined
      },
    })

    // Sample reviews
    await prisma.review.createMany({
      data: [
        {
          shopId: byoumich.id,
          reviewerEmail: 'fatima@example.com',
          reviewerName: 'Fatima',
          score: 5,
          reviewText: 'Prachtige kwaliteit hijabs! De satijnen plissé hijab is mijn favoriet. Snelle levering ook.',
          isVerified: true,
        },
        {
          shopId: byoumich.id,
          reviewerEmail: 'sara@example.com',
          reviewerName: 'Sara',
          score: 4,
          reviewText: 'Mooie collectie en goede prijzen. Zou wel meer kleuren willen zien in de chiffon lijn.',
          isVerified: true,
        },
      ],
    })
    console.log('✅ Voorbeeld winkels en reviews aangemaakt')
  }

  // ============================================
  // BLOG POSTS
  // ============================================
  const blogPosts = [
    {
      title: 'Welke hijab past bij jouw gezichtsvorm?',
      slug: 'hijab-gezichtsvorm-gids',
      excerpt: 'Ontdek welke hijab stijlen het beste bij jouw gezichtsvorm passen. Van rond tot ovaal, vind de perfecte look.',
      content: `<p>Het kiezen van de juiste hijab stijl voor je gezichtsvorm kan je hele look transformeren. In deze gids bespreken we verschillende gezichtsvormen en de hijab stijlen die het beste bij hen passen.</p>

<h2>Rond gezicht</h2>
<p>Als je een rond gezicht hebt, wil je lengte en hoeken creëren. Probeer stijlen die hoogte toevoegen bovenop, zoals een turban stijl of een losjes gedrapeerde hijab die volume boven het voorhoofd creëert.</p>

<h2>Ovaal gezicht</h2>
<p>Gefeliciteerd! Ovale gezichten kunnen bijna elke hijab stijl dragen. Voel je vrij om te experimenteren met verschillende drapeertechnieken.</p>

<h2>Vierkant gezicht</h2>
<p>Verzacht hoekige gelaatstrekken met afgeronde drapeerstijlen. Een losjes gewikkelde hijab die het gezicht zacht omlijst werkt prachtig.</p>

<h2>Tips voor alle gezichtsvormen</h2>
<ul>
<li>Zorg ervoor dat je comfortabel bent met de stijl die je kiest</li>
<li>Experimenteer met verschillende stoffen - sommige draperen beter dan andere</li>
<li>Houd rekening met de gelegenheid bij het kiezen van je stijl</li>
<li>Oefening baart kunst - wees niet bang om nieuwe technieken te proberen</li>
</ul>`,
      metaTitle: 'Hijab Stijlen voor Verschillende Gezichtsvormen | Gids',
      metaDesc: 'Leer welke hijab stijlen het beste bij jouw gezichtsvorm passen. Tips voor rond, ovaal en vierkant.',
      tags: ['hijab', 'styling', 'tutorial', 'gezichtsvorm'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'De beste hijab shops in Amsterdam',
      slug: 'beste-hijab-shops-amsterdam',
      excerpt: 'Verken de top hijab winkels in Amsterdam. Van traditionele winkels tot moderne boutiques, vind de beste plekken.',
      content: `<p>Amsterdam heeft een levendige modest fashion scene, met talloze hijab shops die diverse stijlen en budgetten bedienen. Hier is onze gids voor de beste plekken om te shoppen.</p>

<h2>Waar te shoppen</h2>
<p>De beste gebieden voor hijab shopping in Amsterdam zijn onder andere De Baarsjes, Nieuw-West en delen van Oost. Deze wijken hebben een concentratie van islamitische modewinkels.</p>

<h2>Waar op letten</h2>
<p>Bij het shoppen voor hijabs in Amsterdam, let op:</p>
<ul>
<li>Stofkwaliteit - zoek naar ademende materialen voor dagelijks gebruik</li>
<li>Kleurselectie - een goede winkel heeft een breed assortiment</li>
<li>Prijsklasse - vergelijk tussen winkels voor de beste waarde</li>
<li>Klantenservice - deskundig personeel kan je helpen de perfecte stijl te vinden</li>
</ul>

<h2>Online opties</h2>
<p>Veel Amsterdam-gebaseerde winkels bieden ook online shopping met lokale bezorging aan.</p>

<p>Bekijk onze <a href="/hijab-shops/amsterdam">complete gids van hijab shops in Amsterdam</a> om jouw perfecte winkel te vinden.</p>`,
      metaTitle: 'Beste Hijab Shops Amsterdam 2024 | Lokale Gids',
      metaDesc: 'Vind de beste hijab winkels in Amsterdam. Complete gids voor modest fashion winkels.',
      tags: ['amsterdam', 'hijab shops', 'shopping gids', 'nederland'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Modest Fashion Trends 2024',
      slug: 'modest-fashion-trends-2024',
      excerpt: 'Blijf op de hoogte van de nieuwste modest fashion trends. Van kleurpaletten tot silhouetten, ontdek wat trending is.',
      content: `<p>Modest fashion blijft evolueren en innoveren. Hier zijn de top trends die de industrie vormgeven in 2024.</p>

<h2>Kleurtrends</h2>
<p>Dit jaar zien we een verschuiving naar aardse tinten - denk aan terracotta, saliegroen en warme bruintinten. Neutralen blijven populair, maar verwacht meer gedurfde accentkleuren.</p>

<h2>Stofinnovaties</h2>
<p>Duurzame stoffen staan voorop, waarbij veel modest fashion merken milieuvriendelijke materialen omarmen. Zoek naar gerecycled polyester, biologisch katoen en bamboe mengsels.</p>

<h2>Silhouetten</h2>
<p>Oversized silhouetten blijven domineren, maar met meer gestructureerde opties. Wijde broeken, vloeiende maxi jurken en architectonische abayas zijn belangrijke items.</p>

<h2>Layering</h2>
<p>Creatief layeren is essentieel voor modest fashion. Verwacht meer veelzijdige items ontworpen voor stijlvolle laagcombinaties.</p>

<h2>Accessoires</h2>
<p>Statement hijabs, opvallende sieraden en gestructureerde tassen maken de moderne modest look compleet.</p>`,
      metaTitle: 'Modest Fashion Trends 2024 | Wat is In Stijl',
      metaDesc: 'Ontdek de laatste modest fashion trends voor 2024. Van kleuren tot silhouetten, blijf op de hoogte.',
      tags: ['modest fashion', 'trends', '2024', 'stijlgids'],
      isPublished: true,
      publishedAt: new Date(),
    },
  ]

  for (const post of blogPosts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } })
    if (!existing) {
      await prisma.blogPost.create({ data: post })
    }
  }
  console.log(`✅ ${blogPosts.length} blog posts aangemaakt`)

  console.log('\n🎉 Database succesvol gevuld!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
