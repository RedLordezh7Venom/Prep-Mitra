// src/app/page.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { createUser, getUserByClerkId } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/sign-in')
  }

  try {
    // Check if user exists in MongoDB
    const existingUser = await getUserByClerkId(userId)

    if (!existingUser) {
      // If user doesn't exist in MongoDB, create new user
      const userData = {
        clerkId: userId,
        email: 'user@example.com', // You'll need to get this from Clerk
        name: 'User Name', // You'll need to get this from Clerk
      }
      await createUser(userData)
    }

    return (
      <>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </>
    )
  } catch (error) {
    console.error('Database error:', error)
    return <div>Error connecting to database</div>
  }
}