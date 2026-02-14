"use client"

import { useQuery } from "@tanstack/react-query"
import { evaluationService } from "@/services/evaluation-service"
import { usePatient } from "@/contexts/patient-context"

export function usePatientEvaluations() {
    const { patient } = usePatient()

    return useQuery({
        queryKey: ["patient-evaluations", patient?.id],
        queryFn: async () => {
            if (!patient?.id) return []
            return evaluationService.listByPatient(patient.id)
        },
        enabled: !!patient?.id,
        staleTime: 1000 * 60 * 5,
    })
}
