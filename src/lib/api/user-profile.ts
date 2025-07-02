import { supabase } from '@/lib/supabase'
import { UserProfile, UpdateUserProfileRequest } from '@/lib/types/user'

export async function getUserProfile(userEmail: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found, return null
        return null
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

export async function updateUserProfile(
  userEmail: string,
  updates: UpdateUserProfileRequest
): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('email', userEmail)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export async function createUserProfile(
  email: string,
  profileData: Partial<UpdateUserProfileRequest>
): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        email,
        ...profileData
      })
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export async function upsertUserProfile(
  email: string,
  profileData: UpdateUserProfileRequest
): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          email,
          ...profileData
        },
        {
          onConflict: 'email'
        }
      )
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error upserting user profile:', error)
    throw error
  }
}