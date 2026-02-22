"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useColor } from "@/components/color-provider"
import { Moon, Sun, Eye, EyeOff, Loader2, Palette, Check } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { getBaseURL } from "@/services/api"

export default function AuthPage() {
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const { color, setColor } = useColor()
    const [mounted, setMounted] = useState(false)
    const [animateTrigger, setAnimateTrigger] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            setAnimateTrigger(prev => prev + 1)
        }
    }, [color, mounted])

    // Login states
    const { login } = useAuth()
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [loginRememberMe, setLoginRememberMe] = useState(false)
    const [loginShowPassword, setLoginShowPassword] = useState(false)
    const [loginIsLoading, setLoginIsLoading] = useState(false)
    const [loginError, setLoginError] = useState("")

    // Register states
    const [registerFormData, setRegisterFormData] = useState({
        name: "",
        email: "",
        professional_title: "",
        gender: "",
        password: "",
        confirm_password: "",
        cpf: "",
        crn: "",
    })
    const [registerShowPassword, setRegisterShowPassword] = useState(false)
    const [registerIsLoading, setRegisterIsLoading] = useState(false)
    const [registerError, setRegisterError] = useState("")

    // Handle login
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setLoginError("")
        setLoginIsLoading(true)

        try {
            console.log('[Login] Starting login process...')
            const url = `${getBaseURL()}auth/login/`
            console.log('[Login] URL:', url)

            const response = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            })

            console.log('[Login] Response status:', response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                console.error('[Login] Error response:', errorData)
                throw new Error(errorData.error || errorData.detail || "Credenciais inválidas")
            }

            const data = await response.json()
            console.log('[Login] Success!')
            login(data)
        } catch (_err: unknown) {
            console.error('[Login] Exception:', _err)
            setLoginError((_err as Error)?.message || "Email ou senha incorretos. Tente novamente.")
            setLoginIsLoading(false)
        }
    }

    // Handle register
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setRegisterError("")
        setRegisterIsLoading(true)

        if (registerFormData.password !== registerFormData.confirm_password) {
            setRegisterError("As senhas não coincidem.")
            setRegisterIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${getBaseURL()}auth/register/nutricionista/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: registerFormData.name,
                    email: registerFormData.email,
                    password: registerFormData.password,
                    confirm_password: registerFormData.confirm_password,
                    professional_title: registerFormData.professional_title,
                    gender: registerFormData.gender,
                    cpf: registerFormData.cpf,
                    crn: registerFormData.crn,
                }),
            })

            const data = await response.json()
            if (!response.ok) {
                let errorMessage = "Erro ao criar conta."
                if (data.detail) errorMessage = data.detail
                else if (data.email) errorMessage = `Email: ${data.email[0]}`
                else if (data.password) errorMessage = `Senha: ${data.password[0]}`
                else if (data.professional_title) errorMessage = `Título: ${data.professional_title[0]}`
                else if (data.gender) errorMessage = `Gênero: ${data.gender[0]}`
                else errorMessage = JSON.stringify(data)

                throw new Error(errorMessage)
            }

            // Success - redirect to login
            router.push("/auth?tab=login&registered=true")
        } catch (err: unknown) {
            setRegisterError((err as Error)?.message || "Ocorreu um erro ao registrar.")
        } finally {
            setRegisterIsLoading(false)
        }
    }

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setRegisterFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handleRegisterSelectChange = (value: string) => {
        setRegisterFormData((prev) => ({ ...prev, gender: value }))
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Theme Controls (canto superior direito) */}
            <div className="fixed top-4 right-4 flex items-center gap-4">
                {/* Theme Toggle */}
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <motion.div
                            key={`theme-icon-${animateTrigger}`}
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.4 }}
                        >
                            {theme === "dark" ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </motion.div>
                    </Button>
                )}

                {/* Premium Color Selector */}
                {mounted && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                title="Personalizar Cores"
                            >
                                <motion.div
                                    key={`palette-icon-${animateTrigger}`}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Palette className="h-4 w-4" />
                                </motion.div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-64 p-2 bg-background/80 backdrop-blur-xl border-border/40 shadow-2xl rounded-2xl overflow-hidden"
                        >
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-70">
                                Temas Profissionais
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border/10" />
                            <div className="grid grid-cols-1 gap-1 pt-1">
                                {([
                                    { id: "monochrome", label: "Studio Minimal", color: "bg-zinc-500", desc: "Foco total no conteúdo" },
                                    { id: "teal", label: "Oceanic Zen", color: "bg-[#0D9488]", desc: "Calma e equilíbrio" },
                                    { id: "blue", label: "Executive Blue", color: "bg-blue-400", desc: "Confiança e autoridade" },
                                    { id: "violet", label: "Royal Focus", color: "bg-violet-400", desc: "Criatividade e prestígio" },
                                    { id: "pink", label: "Vital Energy", color: "bg-pink-400", desc: "Vigor e proximidade" },
                                    { id: "amber", label: "Sunset Gold", color: "bg-amber-400", desc: "Calor e otimismo" },
                                    { id: "emerald", label: "Forest Zen", color: "bg-emerald-400", desc: "Saúde e vitalidade" }
                                ] as const).map((c) => (
                                    <DropdownMenuItem
                                        key={c.id}
                                        onClick={() => setColor(c.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-2.5 cursor-pointer rounded-xl transition-all duration-200",
                                            color === c.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                                        )}
                                    >
                                        <div className={cn("w-6 h-6 rounded-full border-2 border-white/20 shadow-sm flex items-center justify-center transition-transform", c.color, color === c.id && "scale-110")}>
                                            {color === c.id && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-semibold truncate">{c.label}</span>
                                            <span className="text-[10px] text-muted-foreground truncate opacity-70">{c.desc}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Auth Card */}
            <Card className="w-full max-w-md shadow-xl border border-border">
                <CardHeader className="text-center space-y-4">
                    <div>
                        <CardTitle className="text-2xl tracking-tighter flex items-center justify-center gap-3">
                            <img
                                src="/imagem/logo_final.svg"
                                alt="Logo"
                                style={{ height: "65px", width: "auto", transform: "scale(1.2)" }}
                            />
                            <style>
                                {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&display=swap');`}
                            </style>
                            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "28px", color: "#1A2E2C", letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
                                Nutri <span style={{ color: "#0D9488" }}>Xpert</span> Pro
                            </span>
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Sistema Avançado de Nutrição
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="mx-auto">
                        Acesso Nutricionista
                    </Badge>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Fazer Login</TabsTrigger>
                            <TabsTrigger value="register">Fazer Cadastro</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={handleLoginSubmit}>
                                <CardContent className="space-y-4 p-0 pt-4">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="loginEmail" className="text-sm font-medium">
                                            Email
                                        </label>
                                        <Input
                                            id="loginEmail"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            className="h-11"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label htmlFor="loginPassword" className="text-sm font-medium">
                                            Senha
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="loginPassword"
                                                type={loginShowPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                required
                                                autoComplete="current-password"
                                                className="h-11 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setLoginShowPassword(!loginShowPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {loginShowPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me & Forgot Password - Row */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="loginRemember"
                                                checked={loginRememberMe}
                                                onCheckedChange={(checked) => setLoginRememberMe(checked as boolean)}
                                            />
                                            <label
                                                htmlFor="loginRemember"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Lembrar-me
                                            </label>
                                        </div>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Esqueceu sua senha?
                                        </Link>
                                    </div>

                                    {/* Error Message */}
                                    {loginError && (
                                        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                                            {loginError}
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4 p-0 pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-11 text-base font-medium"
                                        disabled={loginIsLoading}
                                    >
                                        {loginIsLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Entrando...
                                            </>
                                        ) : (
                                            "Entrar"
                                        )}
                                    </Button>

                                    <div className="relative w-full">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">
                                                Ou continue com
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-11 text-base font-medium"
                                        disabled={loginIsLoading}
                                    >
                                        <FcGoogle className="mr-2 h-5 w-5" />
                                        Entrar com Google
                                    </Button>

                                    <div className="text-sm text-center text-muted-foreground">
                                        É paciente?{" "}
                                        <Link href="/login/paciente" className="text-primary hover:underline font-medium">
                                            Acesse aqui
                                        </Link>
                                    </div>
                                </CardFooter>
                            </form>
                        </TabsContent>
                        <TabsContent value="register">
                            <form onSubmit={handleRegisterSubmit}>
                                <CardContent className="space-y-4 p-0 pt-4">
                                    {/* Nome */}
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
                                        <Input
                                            id="name"
                                            placeholder="Ex: Ana Silva"
                                            value={registerFormData.name}
                                            onChange={handleRegisterChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={registerFormData.email}
                                            onChange={handleRegisterChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Titulo Profissional */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Título Profissional</label>
                                            <select
                                                value={registerFormData.professional_title}
                                                onChange={(e) => setRegisterFormData(prev => ({ ...prev, professional_title: e.target.value }))}
                                                required
                                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="NUT">Nutricionista</option>
                                                <option value="DR">Dr.</option>
                                                <option value="DRA">Dra.</option>
                                                <option value="ESP">Especialista</option>
                                                <option value="MTR">Mestre</option>
                                                <option value="PHD">PhD</option>
                                            </select>
                                        </div>

                                        {/* Genero */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Gênero</label>
                                            <select
                                                value={registerFormData.gender}
                                                onChange={(e) => setRegisterFormData(prev => ({ ...prev, gender: e.target.value }))}
                                                required
                                                className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Feminino</option>
                                                <option value="O">Outro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* CPF */}
                                        <div className="space-y-2">
                                            <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                                            <Input
                                                id="cpf"
                                                placeholder="000.000.000-00"
                                                value={registerFormData.cpf}
                                                onChange={handleRegisterChange}
                                                required
                                                className="h-11"
                                            />
                                        </div>

                                        {/* CRN */}
                                        <div className="space-y-2">
                                            <label htmlFor="crn" className="text-sm font-medium">CRN</label>
                                            <Input
                                                id="crn"
                                                placeholder="12345"
                                                value={registerFormData.crn}
                                                onChange={handleRegisterChange}
                                                required
                                                className="h-11"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-medium">Senha</label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={registerShowPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={registerFormData.password}
                                                onChange={handleRegisterChange}
                                                required
                                                className="h-11 pr-10"
                                            />
                                            <button type="button" onClick={() => setRegisterShowPassword(!registerShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                                {registerShowPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <label htmlFor="confirm_password" className="text-sm font-medium">Confirmar Senha</label>
                                        <Input
                                            id="confirm_password"
                                            type={registerShowPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={registerFormData.confirm_password}
                                            onChange={handleRegisterChange}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    {registerError && (
                                        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                                            {registerError}
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4 p-0 pt-4">
                                    <Button type="submit" className="w-full h-11 text-base font-medium" disabled={registerIsLoading}>
                                        {registerIsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando...</> : "Criar Conta"}
                                    </Button>

                                    <div className="text-sm text-center text-muted-foreground">
                                        Já tem uma conta?{" "}
                                        <Link href="/auth?tab=login" className="text-primary hover:underline font-medium">
                                            Fazer Login
                                        </Link>
                                    </div>
                                </CardFooter>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="fixed bottom-4 text-center text-xs text-muted-foreground">
                © 2024 NutriXpertPro. Todos os direitos reservados.
            </div>
        </div>
    )
}