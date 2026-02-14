"use client"

import { useQuery } from "@tanstack/react-query"
import dietService from "@/services/diet-service"
import { usePatient } from "@/contexts/patient-context"

export function usePatientDiet() {
    const { patient } = usePatient()

    return useQuery({
        queryKey: ["patient-diet", patient?.id],
        queryFn: async () => {
            if (!patient?.id) return null
            return dietService.getActiveByPatient(patient.id)
        },
        enabled: !!patient?.id,
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}
