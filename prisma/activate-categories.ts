import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📋 Activating all categories...')

  const result = await prisma.category.updateMany({
    where: { isActive: false },
    data: { isActive: true }
  })

  console.log(`✅ Activated ${result.count} categories`)

  // Verify all 3 categories exist
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, isActive: true }
  })

  console.log('📦 Categories in database:')
  categories.forEach(cat => {
    console.log(`  - ${cat.name} (active: ${cat.isActive})`)
  })
}

main()
  .catch(e => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
