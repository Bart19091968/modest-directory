import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Deleting Modest Fashion category and associated data...')

  // Find the category
  const category = await prisma.category.findUnique({
    where: { slug: 'modest-fashion' },
  })

  if (!category) {
    console.log('❌ Category "modest-fashion" not found')
    return
  }

  // Delete all ShopCategory associations
  const deletedAssociations = await prisma.shopCategory.deleteMany({
    where: { categoryId: category.id },
  })
  console.log(`✅ Deleted ${deletedAssociations.count} shop associations`)

  // Delete the category itself
  await prisma.category.delete({
    where: { id: category.id },
  })
  console.log('✅ Deleted Modest Fashion category')

  console.log('🎉 Cleanup complete!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
