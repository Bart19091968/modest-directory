import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand geüpload' }, { status: 400 })
    }

    const text = await file.text()
    const rows = parseCSV(text)

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Geen data gevonden in CSV' }, { status: 400 })
    }

    const results = {
      created: 0,
      skipped: 0,
      errors: 0,
      details: {
        created: [] as string[],
        skipped: [] as string[],
        errors: [] as string[],
      },
    }

    for (const row of rows) {
      const name = row.name?.trim()

      if (!name) {
        results.errors++
        results.details.errors.push('Rij zonder naam overgeslagen')
        continue
      }

      // Check if shop already exists
      let slug = generateSlug(name)
      const existing = await prisma.shop.findUnique({ where: { slug } })

      if (existing) {
        results.skipped++
        results.details.skipped.push(`${name} (bestaat al)`)
        continue
      }

      try {
        const citySlug = row.city ? generateSlug(row.city) : null

        await prisma.shop.create({
          data: {
            name,
            slug,
            shortDescription: row.shortDescription?.substring(0, 200) || '',
            city: row.city || null,
            citySlug,
            country: row.country?.toUpperCase() === 'BE' ? 'BE' : 'NL',
            address: row.address || null,
            websiteUrl: row.websiteUrl || null,
            email: row.email || null,
            phone: row.phone || null,
            isPhysicalStore: row.isPhysicalStore?.toLowerCase() === 'true',
            isWebshop: row.isWebshop?.toLowerCase() !== 'false',
            status: 'APPROVED',
          },
        })

        results.created++
        results.details.created.push(name)
      } catch (error) {
        results.errors++
        results.details.errors.push(`${name}: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import mislukt' }, { status: 500 })
  }
}
