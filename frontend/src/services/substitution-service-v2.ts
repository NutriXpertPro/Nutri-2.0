import api from "./api"
import { Substitution } from "@/components/patient-v2/substitution-drawer"

export interface ApplySubstitutionRequest {
  meal_id: string
  food_item_id: string
  substitute_food_id: string
  substitute_quantity_g: number
}

export interface ApplySubstitutionResponse {
  success: boolean
  message: string
  data?: {
    updated_food_item: {
      id: string
      name: string
      quantity: number
      unit: string
      kcal: number
      protein: number
      carbs: number
      fat: number
    }
  }
}

/**
 * Aplica uma substituição de alimento na dieta
 */
export const applySubstitution = async (
  data: ApplySubstitutionRequest
): Promise<ApplySubstitutionResponse> => {
  const response = await api.post<ApplySubstitutionResponse>(
    `/meals/${data.meal_id}/foods/${data.food_item_id}/apply-substitution/`,
    {
      substitute_food_id: data.substitute_food_id,
      substitute_quantity_g: data.substitute_quantity_g,
    }
  )
  return response.data
}

/**
 * Busca substituições disponíveis para um alimento (v2 - com regras fixas)
 */
export const getSubstitutionsV2 = async (
  foodId: string,
  options?: {
    is_vegan?: boolean
    is_vegetarian?: boolean
    is_gluten_free?: boolean
    limit?: number
  }
): Promise<Substitution[]> => {
  const params = new URLSearchParams()
  
  if (options?.is_vegan) params.append("is_vegan", "true")
  if (options?.is_vegetarian) params.append("is_vegetarian", "true")
  if (options?.is_gluten_free) params.append("is_gluten_free", "true")
  if (options?.limit) params.append("limit", options.limit.toString())
  
  const response = await api.get<{ substitutions: Substitution[] }>(
    `/foods/${foodId}/substitutions-v2/?${params.toString()}`
  )
  
  return response.data.substitutions
}

/**
 * Hook helper para aplicar substituição no componente
 */
export const createApplySubstitutionHandler = (
  mealId: string,
  foodItemId: string,
  onSuccess?: () => void
) => {
  return async (substitute: Substitution): Promise<void> => {
    if (!substitute.id) {
      throw new Error("ID do alimento substituto não fornecido")
    }
    
    await applySubstitution({
      meal_id: mealId,
      food_item_id: foodItemId,
      substitute_food_id: substitute.id,
      substitute_quantity_g: substitute.quantity,
    })
    
    onSuccess?.()
  }
}
