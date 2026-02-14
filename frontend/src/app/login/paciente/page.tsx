"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { AppearanceSettings } from "@/components/patient/AppearanceSettings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, User, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getBaseURL, api } from "@/services/api"
import { useRouter } from "next/navigation"

export default function PacienteLoginPage() {
    const { login } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const loginResponse = await api.post("auth/login/paciente/", {
                email: email,
                password: password,
            })

            const data = loginResponse.data
            await login({
                access: data.access,
                refresh: data.refresh
            }, false)
            router.push("/patient-dashboard-v2")
        } catch (err: any) {
            setError(err.response?.data?.detail || "Erro ao conectar com o servidor.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />

            <div className="absolute top-6 right-6 z-50">
                <AppearanceSettings />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 z-10"
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-28 h-28 mb-1">
                        <img
                            src="/logo_final.svg"
                            alt="NutriXpertPro Logo"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                    <div className="flex items-center tracking-tighter">
                        <h1 className="text-3xl font-bold tracking-tighter flex items-center">
                            <span className="mr-1 text-foreground">
                                <span style={{ fontSize: '1.3em' }}>N</span>utri
                            </span>
                            <span className="text-emerald-500">
                                <span className="text-[1.3em] font-black">X</span>pert
                            </span>
                            <span className="ml-1 text-foreground">
                                <span style={{ fontSize: '1.3em' }}>P</span>ro
                            </span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Sistema de Gestão Nutricional Avançada</p>
                </div>

                <Card className="glass-card shadow-2xl border-white/10 dark:border-white/5">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Acesso do Paciente</CardTitle>
                        <CardDescription className="text-center">Entre com suas credenciais para acessar seu dashboard</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 glass-card focus:ring-emerald-500/50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <Button variant="link" className="px-0 text-xs text-muted-foreground h-auto">Esqueceu a senha?</Button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 glass-card focus:ring-emerald-500/50 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="text-xs text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                className="w-full h-12 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] text-white"
                                disabled={isLoading}
                                type="submit"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Entrar <ArrowRight className="h-5 w-5" />
                                    </span>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <div className="text-center text-xs text-muted-foreground/60 p-4">
                    <p>© 2026 NutriXpertPro - Todos os direitos reservados.</p>
                </div>
            </motion.div>
        </div>
    )
}
