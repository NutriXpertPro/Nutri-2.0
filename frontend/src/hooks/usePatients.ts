import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import patientService, { CreatePatientDTO, Patient } from '@/services/patient-service'
import { useAuth } from '@/contexts/auth-context'

export function usePatients() {
    const queryClient = useQueryClient()
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

    const { data: patients, isLoading, error } = useQuery({
        queryKey: ['patients'],
        queryFn: patientService.getAll,
        enabled: isAuthenticated && !isAuthLoading,
        staleTime: 1000 * 60,         // 1 minuto
        gcTime: 1000 * 60 * 5,       // 5 minutos (garbage collection time substitui cacheTime)
        refetchOnWindowFocus: true,   // Refetch quando a janela ganha foco
        refetchOnMount: true,         // Refetch quando o componente monta
        retry: 2                      // Tentar novamente em caso de falha
    })

    const createPatient = useMutation({
        mutationFn: (newPatient: CreatePatientDTO) => patientService.create(newPatient),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
        },
    })

    const updatePatient = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreatePatientDTO> }) =>
            patientService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
            queryClient.invalidateQueries({ queryKey: ['patient'] })
        },
    })

    const deletePatient = useMutation({
        mutationFn: ({ id, hardDelete }: { id: number; hardDelete?: boolean }) =>
            patientService.delete(id, hardDelete),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] })
        },
    })

    // Função para forçar atualização dos dados
    const refetchPatients = () => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
    };

    return {
        patients,
        isLoading,
        error,
        createPatient,
        updatePatient,
        deletePatient,
        refetchPatients,  // Adiciona a função para forçar atualização
    }
}

// Hook para buscar um único paciente por ID
export function usePatient(patientId: number) {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

    const { data: patient, isLoading, error } = useQuery({
        queryKey: ['patient', patientId],
        queryFn: () => patientService.getById(patientId),
        enabled: isAuthenticated && !isAuthLoading && patientId > 0
    })

    return {
        patient,
        isLoading,
        error,
    }
}

