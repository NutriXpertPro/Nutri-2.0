export interface StandardAnamnesisData {
    id?: number
    patient?: number
    // 1. Identificação
    nome: string
    idade: number | null
    sexo: string
    nascimento: string
    profissao: string
    email: string
    telefone: string

    // 2. Rotina
    hora_acorda: string
    hora_dorme: string
    dificuldade_dormir: boolean
    acorda_noite: boolean
    horario_treino: string
    tempo_disponivel_treino: string
    dias_treino_semana: number | null

    // 3. Nutrição e Hábitos
    peso: number | null
    altura: number | null
    peso_status: string
    altura_status: string
    alimentos_restritos: string
    ja_fez_dieta: boolean
    resultado_dieta: string
    intestino: string
    dias_sem_banheiro: string | null
    vezes_banheiro_dia: number | null
    litros_agua_dia: number | null
    vontade_doce: number
    horarios_maior_apetite: string
    preferencia_lanches: string
    frutas_preferencia: string

    // 4. Histórico de Saúde
    doenca_familiar: string
    problema_saude: boolean
    problemas_saude_detalhes: string
    problema_articular: string
    uso_medicamentos: boolean
    medicamentos_detalhes: string
    alergia_medicamento: string
    uso_cigarros: boolean
    intolerancia: boolean
    intolerancia_detalhes: string
    uso_anticoncepcional: boolean
    termogenico_usado: string
    uso_alcool: boolean
    alcool_frequencia: string
    ja_usou_anabolizante: boolean
    anabolizante_problemas: string
    pretende_usar_anabolizante: boolean
    objetivo: string
    compromisso_relatorios: boolean

    // 6. Medidas
    pescoco: number | null
    cintura: number | null
    quadril: number | null

    // 7. Fotos (URLs)
    foto_frente: string | File | null
    foto_lado: string | File | null
    foto_costas: string | File | null
    progresso?: number
}

export interface AnamnesisTemplate {
    id: number
    title: string
    description: string
    questions: Question[]
    is_active: boolean
    created_at: string
}

export interface Question {
    id: string
    type: 'text' | 'long_text' | 'number' | 'select' | 'multiselect'
    label: string
    options?: string[]
    required: boolean
}

export type AnamnesisAnswer = string | number | boolean | string[] | null;

export interface AnamnesisResponse {
    id: number
    patient: number
    template: number
    template_title: string
    answers: Record<string, AnamnesisAnswer>
    filled_date: string
    status?: 'PENDING' | 'COMPLETED'
    completed_at?: string
}

export interface AnamnesisFormData {
    [key: string]: string | number | boolean | File | null | undefined;
}
