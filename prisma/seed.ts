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

  // Create sample shops
  const shops = [
    {
      name: 'byOumich',
      slug: 'byoumich',
      shortDescription: 'Moderne hijabs en modest fashion voor de hedendaagse vrouw in België.',
      longDescription: 'byOumich biedt een uitgebreide collectie van hoogwaardige hijabs, inclusief chiffon hijabs, satijnen plissé hijabs en accessoires. Met gratis verzending vanaf €30 en snelle levering in België en Nederland.',
      city: 'Brussel',
      country: 'BE',
      websiteUrl: 'https://oumich.com',
      email: 'info@oumich.com',
      isPhysicalStore: false,
      isWebshop: true,
      status: 'APPROVED' as const,
    },
    {
      name: 'Hijab House Amsterdam',
      slug: 'hijab-house-amsterdam',
      shortDescription: 'De grootste hijab winkel in Amsterdam met meer dan 500 modellen.',
      longDescription: 'Hijab House Amsterdam is al 10 jaar de go-to bestemming voor modest fashion in Nederland. Onze winkel in het centrum van Amsterdam biedt een enorme selectie hijabs, abaya\'s en accessoires.',
      address: 'Javastraat 123',
      city: 'Amsterdam',
      country: 'NL',
      websiteUrl: 'https://hijabhouseamsterdam.nl',
      email: 'info@hijabhouseamsterdam.nl',
      phone: '+31 20 123 4567',
      isPhysicalStore: true,
      isWebshop: true,
      status: 'APPROVED' as const,
    },
    {
      name: 'Modest Boutique Antwerpen',
      slug: 'modest-boutique-antwerpen',
      shortDescription: 'Luxe modest fashion en designer abaya\'s in het hart van Antwerpen.',
      city: 'Antwerpen',
      country: 'BE',
      isPhysicalStore: true,
      isWebshop: false,
      status: 'APPROVED' as const,
    },
  ]

  for (const shop of shops) {
    await prisma.shop.upsert({
      where: { slug: shop.slug },
      update: {},
      create: shop,
    })
  }
  console.log(`✅ ${shops.length} sample shops created`)

  // Create sample reviews
  const byoumich = await prisma.shop.findUnique({ where: { slug: 'byoumich' } })
  if (byoumich) {
    await prisma.review.createMany({
      skipDuplicates: true,
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
    console.log('✅ Sample reviews created')
  }

  console.log('\n🎉 Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
