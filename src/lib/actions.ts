'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createUser() {
    const { userId } = await auth()

    if (!userId) {
        return { success: false, error: 'Unauthorized' }
    }

    const user = await currentUser()
    if (!user) {
        return { success: false, error: 'User not found' }
    }

    const primaryEmail = user.emailAddresses[0]?.emailAddress
    if (!primaryEmail) {
        return { success: false, error: 'Email not found' }
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: primaryEmail
        }
    })

    if (existingUser) {
        // If user exists, just update last_seen
        const updatedUser = await prisma.user.update({
            where: {
                email: primaryEmail
            },
            data: {
                last_seen: new Date()
            }
        })

        revalidatePath('/')
        return { success: true, user: updatedUser }
    }

    // If user doesn't exist, create new user
    const newUser = await prisma.user.create({
        data: {
            email: primaryEmail,
            clerkId: userId,
            username: user.username || `${user.lastName?.charAt(0)}${user.firstName}`,
            full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            avatar: user.imageUrl || '',
            bio: "Hey there! I'm using this app",
            status: 'ONLINE',
            last_seen: new Date()
        }
    })

    revalidatePath('/')
    return { success: true, user: newUser }
}