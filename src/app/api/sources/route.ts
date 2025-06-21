import { NextResponse } from 'next/server'
import { getSources } from '@/lib/supabase-helpers'

export async function GET() {
  try {
    const sources = await getSources()
    return NextResponse.json(sources)
  } catch (error) {
    console.error('Error fetching sources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    )
  }
}