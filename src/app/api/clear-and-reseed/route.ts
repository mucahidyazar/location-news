import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { seedSupabaseDatabase } from '@/lib/supabase-seed';

export async function POST() {
  try {
    console.log('🧹 Clearing old data...');
    
    // Clear news first (due to foreign key constraints)
    const { error: newsError } = await supabaseAdmin
      .from('news')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (newsError) {
      console.error('Error clearing news:', newsError);
      throw newsError;
    }
    
    // Clear locations (news should cascade delete if properly configured)
    const { error: locationsError } = await supabaseAdmin
      .from('locations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (locationsError) {
      console.error('Error clearing locations:', locationsError);
      throw locationsError;
    }
    
    // Clear sources
    const { error: sourcesError } = await supabaseAdmin
      .from('news_sources')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (sourcesError) {
      console.error('Error clearing sources:', sourcesError);
      throw sourcesError;
    }

    // Clear categories
    const { error: categoriesError } = await supabaseAdmin
      .from('news_categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (categoriesError) {
      console.error('Error clearing categories:', categoriesError);
      throw categoriesError;
    }
    
    // Add key column to categories table if it doesn't exist
    // Note: exec_sql function is not available in current Supabase setup
    // try {
    //   await supabaseAdmin.rpc('exec_sql', { 
    //     sql: 'ALTER TABLE news_categories ADD COLUMN IF NOT EXISTS key VARCHAR(50);' 
    //   });
    //   console.log('✅ Added key column to categories table');
    // } catch (error) {
    //   console.log('⚠️ Key column might already exist or could not be added:', error);
    // }
    
    console.log('✅ Old data cleared successfully');
    
    // Now reseed with new data
    console.log('🌱 Reseeding database...');
    const result = await seedSupabaseDatabase();
    
    return NextResponse.json({ 
      message: 'Database cleared and reseeded successfully',
      stats: result.stats
    });
  } catch (error) {
    console.error('Error clearing and reseeding database:', error);
    return NextResponse.json(
      { error: 'Failed to clear and reseed database' },
      { status: 500 }
    );
  }
}