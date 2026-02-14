import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import patientDataService from "@/services/patient-data-service"

export function useTodayMetrics() {
    return useQuery({
        queryKey: ["today-metrics"],
        queryFn: patientDataService.getTodayMetrics,
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}

export function useTodayMeals() {
    return useQuery({
        queryKey: ["today-meals"],
        queryFn: patientDataService.getTodayMeals,
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}

export function useCheckInMeal() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (mealId: number) => patientDataService.checkInMeal(mealId),
        onSuccess: () => {
            // Invalida as queries para forçar o recarregamento dos dados atualizados
            queryClient.invalidateQueries({ queryKey: ["today-metrics"] })
            queryClient.invalidateQueries({ queryKey: ["today-meals"] })
        }
    })
}
