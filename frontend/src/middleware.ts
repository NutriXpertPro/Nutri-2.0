import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lista de rotas que requerem autenticação
const protectedRoutes = [
    '/dashboard',
    '/patients',
    '/patient-dashboard-v2',
    '/anamnesis',
    '/diets',
    '/calendar',
    '/messages',
    '/evaluations',
    '/lab-exams',
    '/notifications',
    '/settings',
]

// Lista de rotas públicas (não autenticadas)
const publicRoutes = ['/login', '/register', '/auth', '/']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value
    const { pathname } = request.nextUrl

    // Verifica se é uma rota protegida
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // Rotas protegidas precisam de token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Essa verificação foi removida para evitar loops de redirecionamento.
    // O AuthContext no cliente fará a validação real do token e redirecionará se necessário.
    /*
    if ((pathname === '/login' || pathname === '/register' || pathname === '/auth') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    */

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Rotas protegidas (inclui rotas exatas e com sub-paths)
        '/dashboard',
        '/dashboard/:path*',
        '/patients',
        '/patients/:path*',
        '/patient-dashboard-v2',
        '/patient-dashboard-v2/:path*',
        '/anamnesis',
        '/anamnesis/:path*',
        '/diets',
        '/diets/:path*',
        '/calendar',
        '/calendar/:path*',
        '/messages',
        '/messages/:path*',
        '/evaluations',
        '/evaluations/:path*',
        '/lab-exams',
        '/lab-exams/:path*',
        '/notifications',
        '/notifications/:path*',
        '/settings',
        '/settings/:path*',
        // Rotas públicas
        '/login',
        '/login/:path*',
        '/register',
        '/register/:path*',
        '/auth',
        '/auth/:path*',
    ],
}

