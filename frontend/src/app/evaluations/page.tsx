"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { DashboardLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  TrendingUp,
  Droplets,
  Flame,
  Users,
  Ruler,
  Target,
  FileText,
  Upload,
  Share2,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Phone,
  ClipboardList,
  Weight,
  PieChart,
  Dumbbell
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { evaluationService, Evaluation } from "@/services/evaluation-service";
import { useQuery } from "@tanstack/react-query";
import { FaTape, FaDraftingCompass, FaClipboardList, FaWeight, FaChartPie } from "react-icons/fa";
import { GiBiceps } from "react-icons/gi";
import { EvaluationFormDialog } from "@/components/evaluations/EvaluationFormDialog";
import { ExternalExamUpload } from "@/components/evaluations/ExternalExamUpload";
import { ExternalExamList } from "@/components/evaluations/ExternalExamList";
import { ShareEvolution } from "@/components/evaluations/ShareEvolution";
import { NewEvaluationDialog } from "@/components/evaluations/NewEvaluationDialog";
import { PatientSearch } from "@/components/patients/PatientSearch";
import { EvaluationTypeSelector } from "@/components/evaluations/EvaluationTypeSelector";
import patientService, { Patient as PatientType } from "@/services/patient-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EvaluationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [evaluationFormDialogOpen, setEvaluationFormDialogOpen] = useState(false);
  const [selectedPatientForForm, setSelectedPatientForForm] = useState<number | null>(null);
  const [patientSelectionDialogOpen, setPatientSelectionDialogOpen] = useState(false);
  const [externalExamDialogOpen, setExternalExamDialogOpen] = useState(false);
  const [shareEvolutionDialogOpen, setShareEvolutionDialogOpen] = useState(false);
  const [newEvaluationDialogOpen, setNewEvaluationDialogOpen] = useState(false);
  const [evaluationTypeSelectorOpen, setEvaluationTypeSelectorOpen] = useState(false);
  const [selectedPatientForEvaluation, setSelectedPatientForEvaluation] = useState<PatientType | null>(null);
  const [examListKey, setExamListKey] = useState(0); // Para forçar refresh da lista

  // Carregar todas as avaliações
  const { data: evaluations = [], isLoading: evaluationsLoading } = useQuery({
    queryKey: ['evaluations'],
    queryFn: () => evaluationService.listAll(),
    refetchOnWindowFocus: false,
  });

  // Carregar todos os pacientes
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getAll(),
    refetchOnWindowFocus: false,
  });

  // DEBUG: Verificar se os pacientes estão chegando
  // Filtrar avaliações com base na busca
  const filteredEvaluations = React.useMemo(() => {
    if (!searchQuery) return evaluations;

    return evaluations.filter(evaluation =>
      evaluation.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, evaluations]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h1 capitalize font-normal">Avaliações <span className="text-primary">Físicas</span></h1>
            <div className="text-subtitle mt-1 flex items-center gap-2">
              <Ruler className="h-4 w-4 text-emerald-500" />
              Gerencie as avaliações físicas dos seus pacientes
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar avaliações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button onClick={() => setPatientSelectionDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Avaliação
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Avaliações"
            value={evaluations.length}
            icon={ClipboardList}
            variant="violet"
            subtitle="+5 Este mês"
          />

          <StatCard
            title="Média Peso"
            value={`${evaluations.length ? (evaluations.reduce((sum, e) => sum + (e.weight || 0), 0) / evaluations.length).toFixed(1) : '0'} kg`}
            icon={Weight}
            variant="green"
            subtitle="±0.5 Kg"
          />

          <StatCard
            title="Média Gordura"
            value={`${evaluations.length ? (evaluations.reduce((sum, e) => sum + (e.body_fat || 0), 0) / evaluations.length).toFixed(1) : '0'} %`}
            icon={PieChart}
            variant="amber"
            subtitle="-1.2% Médio"
          />

          <StatCard
            title="Média Músculo"
            value={`${evaluations.length ? (evaluations.reduce((sum, e) => sum + (e.muscle_mass || 0), 0) / evaluations.length).toFixed(1) : '0'} kg`}
            icon={Dumbbell}
            variant="blue"
            subtitle="+0.8 Kg Médio"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolution Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Gráficos Evolutivos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50 text-emerald-500" />
                <p>Visualização de gráficos de evolução</p>
                <p className="text-sm mt-1">Peso • Água • Gordura • Músculo</p>
              </div>
            </CardContent>
          </Card>

          {/* Anthropometry Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-violet-500" />
                Antropometria
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <Ruler className="h-12 w-12 mx-auto mb-2 opacity-50 text-violet-500" />
                <p>Gráfico de medidas corporais</p>
                <p className="text-sm mt-1">Braço • Abdômen • Quadril • Cintura • etc</p>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Evaluations List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-500" />
              Histórico de Avaliações
            </CardTitle>
            {selectedPatient && (
              <Badge variant="secondary">
                Paciente: {selectedPatient}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {evaluationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Carregando avaliações...</p>
              </div>
            ) : filteredEvaluations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-violet-300 mb-4" />
                <h3 className="text-lg font-normal">Nenhuma avaliação encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Nenhuma avaliação corresponde à sua busca" : "Comece adicionando avaliações para seus pacientes"}
                </p>
                <Button onClick={() => setPatientSelectionDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Avaliação
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{evaluation.patient.name}</h4>
                          <p className="text-sm text-muted-foreground">{evaluation.patient.email}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">Peso: {evaluation.weight} kg</Badge>
                            <Badge variant="secondary">Gordura: {evaluation.body_fat}%</Badge>
                            <Badge variant="secondary">Músculo: {evaluation.muscle_mass} kg</Badge>
                            <Badge variant="secondary">Data: {new Date(evaluation.date).toLocaleDateString('pt-BR')}</Badge>
                          </div>
                          {evaluation.notes && (
                            <p className="text-sm text-muted-foreground mt-2">"{evaluation.notes}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Controls */}
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 min-w-[250px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-500" />
                Ficha Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => setPatientSelectionDialogOpen(true)}
              >
                <FileText className="h-4 w-4 mr-2 text-violet-500" />
                Criar Ficha Antropométrica
              </Button>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-[250px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-500" />
                Upload Externo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setExternalExamDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2 text-blue-500" />
                Upload de Exame Externo
              </Button>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-[250px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-sky-500" />
                Compartilhar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShareEvolutionDialogOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2 text-sky-500" />
                Compartilhar Evolução
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* External Exams List - Mostrar se houver paciente selecionado */}
        {selectedPatientForEvaluation && (
          <ExternalExamList
            key={examListKey}
            patientId={selectedPatientForEvaluation.id}
          />
        )}
      </div>
      <EvaluationFormDialog
        open={evaluationFormDialogOpen}
        onOpenChange={setEvaluationFormDialogOpen}
        patientId={selectedPatientForForm || undefined}
      />
      <Dialog open={patientSelectionDialogOpen} onOpenChange={setPatientSelectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Paciente</DialogTitle>
            <DialogDescription>
              Busque e selecione um paciente para criar a avaliação.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <PatientSearch
              patients={patients}
              onPatientSelect={(patient) => {
                setSelectedPatientForEvaluation(patient);
                setPatientSelectionDialogOpen(false);
                setEvaluationTypeSelectorOpen(true);
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPatientSelectionDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={externalExamDialogOpen} onOpenChange={setExternalExamDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload de Exame Externo</DialogTitle>
            <DialogDescription>
              Envie exames de terceiros ou laboratórios externos para anexar ao prontuário do paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ExternalExamUpload
              patientId={selectedPatientForEvaluation?.id || evaluations[0]?.patient.id || 0}
              onUpload={(file, notes) => {
              }}
              onSuccess={() => {
                setExamListKey(prev => prev + 1); // Atualiza a lista
                setExternalExamDialogOpen(false);
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setExternalExamDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareEvolutionDialogOpen} onOpenChange={setShareEvolutionDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compartilhar Evolução</DialogTitle>
            <DialogDescription>
              Compartilhe o relatório de evolução do paciente via link ou email.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ShareEvolution
              patientId={selectedPatientForEvaluation?.id || evaluations[0]?.patient.id || 0}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShareEvolutionDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={evaluationTypeSelectorOpen} onOpenChange={setEvaluationTypeSelectorOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selecionar Tipo de Avaliação</DialogTitle>
            <DialogDescription>
              Escolha o tipo de avaliação que deseja criar para o paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedPatientForEvaluation && (
              <EvaluationTypeSelector
                patient={selectedPatientForEvaluation}
                onTypeSelect={(type) => {
                  setEvaluationTypeSelectorOpen(false);
                  if (type === 'skinfold') {
                    // Navegar para a página de dobras cutâneas
                    window.location.href = `/patients/${selectedPatientForEvaluation.id}/evaluations/skinfold`;
                  } else if (type === 'external') {
                    // Abrir diálogo de upload externo
                    setExternalExamDialogOpen(true);
                  } else if (type === 'template') {
                    // Abrir diálogo de seleção de modelo
                    setEvaluationTypeSelectorOpen(true);
                  } else {
                    // Abrir diálogo de nova avaliação
                    setNewEvaluationDialogOpen(true);
                  }
                }}
                onBack={() => {
                  setEvaluationTypeSelectorOpen(false);
                  setPatientSelectionDialogOpen(true);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <NewEvaluationDialog
        open={newEvaluationDialogOpen}
        onOpenChange={setNewEvaluationDialogOpen}
        patientId={selectedPatientForEvaluation?.id || 0}
      />
    </DashboardLayout>
  );
}