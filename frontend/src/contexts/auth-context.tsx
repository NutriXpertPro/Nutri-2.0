"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { getBaseURL, api } from "@/services/api"

interface User {
    id: number
    email: string
    name?: string
    user_type?: string
    professional_title?: string
    gender?: string
    avatar?: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (tokens: { access: string; refresh: string }, redirect?: boolean) => void
    logout: () => void
    refreshUser: () => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: () => { },
    logout: () => { },
    refreshUser: () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const fetchUserProfile = async (token?: string): Promise<User | boolean> => {
        try {
            // Se um token for passado explicitamente (ex: no login), 
            // garantimos que o axios o use
            const config = token ? {
                headers: { Authorization: `Bearer ${token}` }
            } : {}

            const response = await api.get('users/me/', config)
            const userData = response.data
            setUser(userData)
            return userData
        } catch (error: any) {
            // Silencioso se for erro de autenticação esperado durante init
            if (error.response?.status === 401 || error.response?.status === 403) {
                return false
            }
            // Para outros erros de rede/servidor, retornamos true para não deslogar o usuário em falhas temporárias
            return true
        }
    }

    const refreshUser = async () => {
        await fetchUserProfile()
    }

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get("accessToken")
            if (token) {
                // Keep token sync in case it's valid, but verify first
                localStorage.setItem('access_token', token)

                const isValid = await fetchUserProfile()

                if (isValid) {
                    setIsAuthenticated(true)
                } else {
                    // Token explicitamente inválido (401/403) - cleanup
                    Cookies.remove("accessToken")
                    Cookies.remove("refreshToken")
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    setIsAuthenticated(false)
                    setUser(null)
                }
            } else {
                setIsAuthenticated(false)
                setUser(null)
            }
            setIsLoading(false)
        }
        initAuth()
    }, [])


    const login = async (tokens: { access: string; refresh: string }, redirect = true) => {
        Cookies.set("accessToken", tokens.access, { expires: 1, path: '/' }) // 1 day
        Cookies.set("refreshToken", tokens.refresh, { expires: 7, path: '/' }) // 7 days

        // Sync with localStorage for api.ts interceptor
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)

        setIsAuthenticated(true)
        const userData = await fetchUserProfile(tokens.access)

        if (redirect) {
            // Se for paciente, redireciona para o dashboard v2
            if (userData && (userData as any).user_type === 'paciente') {
                router.push("/patient-dashboard-v2")
            } else {
                router.push("/dashboard")
            }
        }
    }

    const logout = () => {
        Cookies.remove("accessToken", { path: '/' })
        Cookies.remove("refreshToken", { path: '/' })

        // Clear localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        setUser(null)
        setIsAuthenticated(false)
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
