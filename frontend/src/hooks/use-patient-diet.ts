"use client"

import { useQuery } from "@tanstack/react-query"
import dietService from "@/services/diet-service"
import { usePatient } from "@/contexts/patient-context"
import { mockDietData } from "@/mocks/diet-mock-data"

export function usePatientDiet() {
    const { patient } = usePatient()

    return useQuery({
        queryKey: ["patient-diet", patient?.id],
        queryFn: async () => {
            if (!patient?.id) return mockDietData // Usar dados mockados se não houver paciente
            try {
                const result = await dietService.getActiveByPatient(patient.id)
                return result || mockDietData // Usar dados mockados se não houver dieta ativa
            } catch (error) {
                console.warn("Erro ao buscar dieta real, usando dados mockados:", error)
                return mockDietData
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}
