'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')

    if (email === 'fede@mototaller.com') {
        redirect('/admin')
    } else {
        redirect('/dashboard')
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    // 1. Sign up/Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (authError) {
        return { error: authError.message }
    }

    if (authData.user) {
        // 2. Create Profile in 'clientes' table
        const { error: profileError } = await supabase
            .from('clientes')
            .insert({
                user_id: authData.user.id,
                nombre: name,
                telefono: phone,
                // Default values will be handled by DB defaults if not provided
            })

        if (profileError) {
            // If profile creation fails, we might want to log it or handle it. 
            // For now, returning the error.
            console.error("Error creating client profile:", profileError)
            return { error: "Error creating user profile. Please contact support." }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
