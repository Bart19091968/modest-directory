import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Verwijderen van Modest Fashion categorie uit database...')
  
  // First, delete all ShopCategory associations
  const shopCats = await prisma.shopCategory.deleteMany({
    where: {
      category: { slug: 'modest-fashion' }
    }
  })
  console.log(`✅ Verwijderd: ${shopCats.count} shop-categorie associaties`)
  
  // Then delete the category itself
  const cat = await prisma.category.deleteMany({
    where: { slug: 'modest-fashion' }
  })
  console.log(`✅ Verwijderd: ${cat.count} categorie(ën)`)
  console.log('🎉 Cleanup complete!')
}

main()
  .catch(e => console.error('❌ Error:', e))
  .finally(() => prisma.$disconnect())
