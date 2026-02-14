import api from './api'

export interface PatientMetrics {
    calories: {
        current: number;
        goal: number;
        unit: string;
    };
    water: {
        current: number;
        goal: number;
        unit: string;
    };
    focus: {
        current: number;
        goal: number;
        unit: string;
    };
}

export interface PatientMealItem {
    name: string;
    quantity: number;
    unit: string;
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
    food_id: number | null;
    food_source: string;
    substitutions: any[];
}

export interface PatientMeal {
    id: number;
    name: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    items: PatientMealItem[];
    status: 'pending' | 'current' | 'completed';
}

const patientDataService = {
    // Busca métricas de hoje (calorias, água, foco)
    getTodayMetrics: async () => {
        const response = await api.get<PatientMetrics>('/patients/me/metrics/')
        return response.data
    },

    // Busca refeições de hoje do plano alimentar
    getTodayMeals: async () => {
        const response = await api.get<PatientMeal[]>('/patients/me/meals/')
        return response.data
    },

    // Registra o consumo de uma refeição
    checkInMeal: async (mealId: number) => {
        const response = await api.post<{ status: string }>(`/patients/me/meals/${mealId}/check-in/`)
        return response.data
    }
}

export default patientDataService
