import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Crear cliente Supabase para Middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refrescar sesión si es necesario
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Proteger rutas de Dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Proteger Admin (Simple email check for now)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // TODO: Move this to RBAC later. Hardcoded for safety now.
        if (user.email !== 'fede@mototaller.com') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    // Redirigir si ya está logueado
    if (request.nextUrl.pathname.startsWith('/login') && user) {
        // If it's Fede, go to Admin, else Client Dashboard
        if (user.email === 'fede@mototaller.com') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/admin/:path*'],
}
