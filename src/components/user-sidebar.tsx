'use client'

import {useState, useEffect} from 'react'
import {LogOut, User, Shield, Edit3, Save, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {useAuth} from '@/contexts/auth-context'
import {UserAvatar} from '@/components/user-avatar'
import {updateUserProfile} from '@/lib/api/user-profile'
import {cn} from '@/lib/utils'
import {SidebarHeader} from '@/components/ui/sidebar-header'

interface UserSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function UserSidebar({isOpen, onClose}: UserSidebarProps) {
  const {user, userProfile, signOut, isAdmin, refreshProfile} = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedFullName, setEditedFullName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Update form when user profile data changes
  useEffect(() => {
    setEditedFullName(userProfile?.full_name || '')
  }, [userProfile?.full_name])

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const handleEdit = () => {
    setEditedFullName(userProfile?.full_name || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedFullName(userProfile?.full_name || '')
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!user?.email) return

    setIsSaving(true)
    try {
      // Update user profile in database
      await updateUserProfile(user.email, {
        full_name: editedFullName,
      })

      // Refresh profile data
      await refreshProfile()

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      // TODO: Show error message to user
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !user) {
    return null
  }

  return (
    <div className="h-full flex flex-col [background-color:var(--color-theme-surface-primary)]">
      <div className="h-full flex flex-col">
        {/* Header */}
        <SidebarHeader
          icon={<User className="h-5 w-5" />}
          title="User Profile"
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          <div className="space-y-6 flex-1">
            {/* User Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <UserAvatar userProfile={userProfile} size="xl" shape="square" />
              {isAdmin && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  <Shield className="h-3 w-3" />
                  Admin User
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <div className="border-t pt-4 [border-color:var(--color-theme-border-primary)]">
                <h3 className="text-sm font-medium mb-3 flex items-center justify-between [color:var(--color-theme-text-primary)]">
                  User Information
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="h-7 px-2"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </h3>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium [color:var(--color-theme-text-secondary)]">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    value={editedFullName}
                    onChange={e => setEditedFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="text-sm"
                  />
                ) : (
                  <p
                    className={cn(
                      "text-sm px-3 py-2 rounded border [background-color:var(--color-theme-surface-secondary)] [border-color:var(--color-theme-border-primary)]",
                      !userProfile?.full_name 
                        ? "italic [color:var(--color-theme-text-tertiary)]"
                        : "[color:var(--color-theme-text-primary)]"
                    )}
                  >
                    {userProfile?.full_name || 'Click Edit to add your name'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium [color:var(--color-theme-text-secondary)]">
                  Email Address
                </label>
                <p className="text-sm px-3 py-2 rounded border [color:var(--color-theme-text-secondary)] [background-color:var(--color-theme-surface-secondary)] [border-color:var(--color-theme-border-primary)]">
                  {userProfile?.email || user?.email}
                </p>
                <p className="text-xs [color:var(--color-theme-text-tertiary)]">
                  Email cannot be changed
                </p>
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                    size="sm"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1"
                    size="sm"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out - Always at bottom */}
          <div className="border-t pt-4 mt-6 [border-color:var(--color-theme-border-primary)]">
            <Button
              variant="outline"
              className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
