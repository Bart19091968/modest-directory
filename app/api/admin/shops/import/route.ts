import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { slugify } from '@/lib/seo'

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

export async function POST(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { csv } = await request.json()
  const rows = parseCSV(csv)

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Geen data gevonden in CSV' }, { status: 400 })
  }

  let success = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // +2 voor header rij en 0-index

    try {
      // Validatie
      if (!row.name || row.name.length === 0) {
        errors.push(`Rij ${rowNum}: Naam is verplicht`)
        continue
      }

      if (!row.shortDescription || row.shortDescription.length === 0) {
        errors.push(`Rij ${rowNum}: Korte beschrijving is verplicht`)
        continue
      }

      if (row.shortDescription.length > 200) {
        errors.push(`Rij ${rowNum}: Korte beschrijving mag max 200 tekens zijn`)
        continue
      }

      // Genereer slug
      let slug = slugify(row.name)
      
      // Check of slug al bestaat
      const existing = await prisma.shop.findUnique({ where: { slug } })
      if (existing) {
        slug = `${slug}-${Date.now()}`
      }

      // Maak winkel aan
      await prisma.shop.create({
        data: {
          name: row.name,
          slug,
          shortDescription: row.shortDescription,
          city: row.city || null,
          country: row.country === 'NL' ? 'NL' : 'BE',
          websiteUrl: row.websiteUrl || null,
          email: row.email || null,
          isPhysicalStore: row.isPhysicalStore?.toLowerCase() === 'true',
          isWebshop: row.isWebshop?.toLowerCase() !== 'false',
          status: 'APPROVED', // Direct goedkeuren bij import
        },
      })

      success++
    } catch (err) {
      errors.push(`Rij ${rowNum}: ${err instanceof Error ? err.message : 'Onbekende fout'}`)
    }
  }

  return NextResponse.json({ success, errors })
}