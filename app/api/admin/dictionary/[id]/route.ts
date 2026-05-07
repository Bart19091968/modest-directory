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

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const term = await prisma.dictionaryTerm.findUnique({ where: { id: params.id } })
  if (!term) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
  return NextResponse.json(term)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const existing = await prisma.dictionaryTerm.findFirst({
      where: { slug, NOT: { id: params.id } },
    })
    if (existing) return NextResponse.json({ error: 'Slug bestaat al' }, { status: 400 })

    const current = await prisma.dictionaryTerm.findUnique({ where: { id: params.id } })
    if (!current) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

    const updated = await prisma.dictionaryTerm.update({
      where: { id: params.id },
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
        publishedAt: isPublished && !current.publishedAt ? new Date() : current.publishedAt,
      },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating dictionary term:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!await checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const term = await prisma.dictionaryTerm.findUnique({ where: { id: params.id } })
  if (!term) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  await prisma.dictionaryTerm.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
