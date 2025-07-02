import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface NewsReportData {
  title: string
  content: string
  location_name: string
  latitude?: number
  longitude?: number
  category_id: string
  submitter_email: string
  source_url?: string
  image_url?: string
  recaptcha_token?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: NewsReportData = await request.json()

    // Validate required fields
    if (!data.title || !data.location_name || !data.category_id || !data.submitter_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.submitter_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA token in production
    if (process.env.NODE_ENV !== 'development') {
      if (!data.recaptcha_token) {
        return NextResponse.json({ error: 'reCAPTCHA token is required' }, { status: 400 })
      }

      if (!process.env.RECAPTCHA_SECRET_KEY) {
        console.error('RECAPTCHA_SECRET_KEY is not configured')
        return NextResponse.json({ error: 'reCAPTCHA verification unavailable' }, { status: 500 })
      }

      try {
        const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.recaptcha_token}`
        })

        const recaptchaResult = await recaptchaResponse.json()

        if (!recaptchaResult.success) {
          console.error('reCAPTCHA verification failed:', recaptchaResult['error-codes'])
          return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
        }
      } catch (error) {
        console.error('reCAPTCHA verification error:', error)
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 500 })
      }
    }

    // Get category ID from category key
    let categoryId = data.category_id

    // If category_id is a string key, look up the actual UUID
    if (!data.category_id.includes('-')) {
      const { data: category, error: categoryError } = await supabase
        .from('news_categories')
        .select('id')
        .eq('key', data.category_id)
        .single()

      if (categoryError || !category) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        )
      }

      categoryId = category.id
    }

    // Create news entry with pending status
    const newsData = {
      title: data.title,
      content: data.content,
      location_name: data.location_name,
      latitude: data.latitude || 41.0082, // Default to Istanbul if not provided
      longitude: data.longitude || 28.9784,
      category_id: categoryId,
      published_at: new Date().toISOString(),
      status: 'pending', // Using existing status field
      submitted_by_email: data.submitter_email,
      ...(data.source_url && { external_url: data.source_url }),
      ...(data.image_url && { image_url: data.image_url }),
      source_id: null, // User-submitted news doesn't have a source
    }

    const { data: newsResult, error: newsError } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single()

    if (newsError) {
      console.error('Database error:', newsError)
      return NextResponse.json(
        { error: 'Failed to save news report' },
        { status: 500 }
      )
    }

    // TODO: Send notification to admins about new pending news
    // This could be implemented as:
    // 1. Email notification
    // 2. Slack/Discord webhook
    // 3. In-app notification system

    // Set initial status metadata
    // status_changed_at and processed_by_admin_id will be set when admin takes action

    return NextResponse.json({
      success: true,
      message: 'Haber başarıyla gönderildi. Admin onayından sonra yayınlanacaktır.',
      id: newsResult.id
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}