'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const authSchema = z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(6),
}).refine(data => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email"]
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()

    console.log("LOGIN ATTEMPT:", { email, passwordLength: password?.length })

    if (!email || !password) {
        return { error: "Email/Phone and Password are required" }
    }

    // Clean phone if it's being used as email prefix (auto-generated email case)
    // Actually, we can't easily distinguish logic here, but the signup enforces clean phone.
    // If user types raw phone in login, we should probably clean it if we are constructing the email manually?
    // But here we receive 'email' from the form.
    // Wait, the client side logic in page.tsx constructs the email: `const email = `${cleanPhone}@internal.app``
    // So `formData.get('email')` is already the internal email with cleaned phone.
    // We don't need to change login action for phone cleaning if the client does it.

    // HOWEVER, for robustness, if we ever change client, consistent backend is good.
    // But client `page.tsx` line 128: `const cleanPhone = phone.replace(/\D/g, '')`
    // So email is already correct.

    // ALWAYS use Email Auth (even for customers, using the pseudo-email)
    // This bypasses the need for SMS OTPs.
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error("LOGIN ERROR:", error)
        console.error("LOGIN ERROR MESSAGE:", error.message)

        if (error.message.includes("Email not confirmed")) {
            return { error: "Login failed: Email not confirmed. Please Go to Supabase > Authentication > Providers > Email and DISABLE 'Confirm email'. Then sign up again or manually confirm the user in the dashboard." }
        }

        if (error.message.includes("Invalid login credentials")) {
            return { error: "Invalid credentials or email not confirmed. If you just signed up, you may need to verify your email." }
        }

        return { error: error.message }
    }

    console.log("LOGIN SUCCESS SESSION:", data.session ? "Active" : "None")

    // Check session
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        revalidatePath('/', 'layout')
        redirect('/')
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    let email = formData.get('email')?.toString()
    const phone = formData.get('phone')?.toString()
    const password = formData.get('password')?.toString() || ''
    const role = formData.get('role')?.toString()

    // Server-side fallback: Ensure email exists for phone users
    if (!email && phone) {
        const cleanPhone = phone.replace(/\D/g, '')
        if (cleanPhone.length >= 10) {
            email = `${cleanPhone}@internal.app`
        }
    }

    // Extract metadata
    const rawMetaData = {
        role,
        phone: phone?.replace(/\D/g, ''), // Save strictly digits
        org_name: formData.get('org_name'),
        org_address: formData.get('org_address'),
        full_name: formData.get('full_name'),
    }

    // Clean metadata
    const metaData = Object.fromEntries(
        Object.entries(rawMetaData).filter(([_, v]) => v != null && v !== '')
    )

    // Validation
    const validation = authSchema.safeParse({ email, password })
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    // EXECUTE SIGNUP
    // IMPORTANT: Always use EMAIL signup to avoid SMS verification
    const { data, error } = await supabase.auth.signUp({
        email: email!,
        password,
        options: { data: metaData }
    })

    if (error) {
        return { error: error.message }
    }

    let authUser = data.user;

    // --- MANUAL PROFILE FALLBACK ---
    if (authUser) {
        const { id } = authUser

        const profileData = {
            id: id,
            email: email || null,
            phone: rawMetaData.phone || null, // Use the cleaned phone
            role: role || 'customer',
            org_name: metaData.org_name || null,
            org_address: metaData.org_address || null,
            full_name: metaData.full_name || null,
        }

        // Upsert Profile
        const { error: insertError } = await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id', ignoreDuplicates: true })

        if (insertError) {
            console.error("Manual profile insert failed:", insertError)
            // If table is missing, insertError.code will be 42P01. 
            // We can optionally check this, but logging is fine for now.
        }
    }

    // --- CHECK SESSION & REDIRECT ---
    // If "Confirm Email" is DISABLED in Supabase, data.session will be present immediately.
    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/')
    }

    // If we get here, it means Supabase IS waiting for verification.
    return { success: true, message: 'Account created. NOTE: You strictly asked to remove verification. If you are seeing this, go to Supabase -> Auth -> Providers -> Email and DISABLE "Confirm Email". Then try again.' }
}

export async function signInWithGoogle() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}
