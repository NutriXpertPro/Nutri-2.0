"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import CombinedSettingsForm from "@/components/settings/CombinedSettingsForm";
import AutomationSettings from "@/components/automation/AutomationSettings";
import GoogleCalendarIntegration from "@/components/integrations/GoogleCalendarIntegration";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 capitalize font-normal">
          Minhas <span className="text-primary">configurações</span>
        </h1>
        <p className="text-subtitle mt-1 flex items-center gap-2">
          <Settings className="h-4 w-4 text-amber-500" />
          Gerencie suas informações de perfil e preferências.
        </p>
      </div>
      {/* Formulário combinado de configurações de perfil e branding */}
      <CombinedSettingsForm />
      {/* Configurações de automação de mensagens */}
      <AutomationSettings />
      {/* Configurações de integração com Google Calendar */}
      <GoogleCalendarIntegration />
    </div>
  );
}
