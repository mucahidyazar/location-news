import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// GET - Fetch all news reports for admin review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const searchTerm = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const supabaseAdmin = createAdminClient()
    
    let query = supabaseAdmin
      .from('news')
      .select(`
        id,
        title,
        content,
        location_name,
        latitude,
        longitude,
        category_id,
        category:news_categories(id, name),
        submitted_by_email,
        external_url,
        image_url,
        status,
        created_at,
        status_notes
      `)
      .order('created_at', { ascending: false })

    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    // Apply search filter if provided
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,location_name.ilike.%${searchTerm}%,submitted_by_email.ilike.%${searchTerm}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching news reports:', error)
      return NextResponse.json(
        { error: 'Failed to fetch news reports', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Approve or reject a news report
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, notes } = body

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()
    
    const updateData: Record<string, unknown> = {
      status: action === 'approve' ? 'approved' : 'rejected',
      status_changed_at: new Date().toISOString(),
    }

    if (notes) {
      updateData.status_notes = notes
    }

    const { data, error } = await supabaseAdmin
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating news status:', error)
      return NextResponse.json(
        { error: 'Failed to update news status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `News ${action}d successfully`,
      data 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}