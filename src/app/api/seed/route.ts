import { NextResponse } from 'next/server';
import { seedSupabaseDatabase } from '@/lib/supabase-seed';

export async function POST() {
  try {
    const result = await seedSupabaseDatabase();
    return NextResponse.json({ 
      message: 'Supabase database seeded successfully',
      stats: result.stats
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}