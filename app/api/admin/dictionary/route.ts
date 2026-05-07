import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  return token && verifyAuth(token)
}

export async function GET() {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const terms = await prisma.dictionaryTerm.findMany({
    orderBy: { term: 'asc' },
  })
  return NextResponse.json(terms)
}

export async function POST(request: Request) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const {
      term, slug, arabic, pronunciation, shortDefinition, longDefinition, category,
      aliases, transliterationVariants, relatedTermSlugs,
      relatedCategoryLinks, relatedBlogLinks,
      seoTitle, seoDescription, isPublished, isFeatured, sortOrder,
    } = body

    if (!term || !slug || !shortDefinition || !longDefinition || !category) {
      return NextResponse.json({ error: 'Term, slug, definitie en categorie zijn verplicht' }, { status: 400 })
    }

    const existing = await prisma.dictionaryTerm.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ error: 'Slug bestaat al' }, { status: 400 })

    const created = await prisma.dictionaryTerm.create({
      data: {
        term, slug,
        arabic: arabic || null,
        pronunciation: pronunciation || null,
        shortDefinition, longDefinition, category,
        aliases: aliases || [],
        transliterationVariants: transliterationVariants || [],
        relatedTermSlugs: relatedTermSlugs || [],
        relatedCategoryLinks: relatedCategoryLinks || [],
        relatedBlogLinks: relatedBlogLinks || [],
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        sortOrder: sortOrder || null,
        publishedAt: isPublished ? new Date() : null,
      },
    })
    return NextResponse.json(created)
  } catch (error) {
    console.error('Error creating dictionary term:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
