import { useState, useEffect } from 'react';

export interface ConsumedMeal {
    mealId: string;
    timestamp: Date;
    patientId?: number;
}

export function useConsumedMeals(patientId?: number) {
    const [consumedMeals, setConsumedMeals] = useState<Set<string>>(new Set());

    // Carregar dados do localStorage quando o componente montar
    useEffect(() => {
        try {
            const stored = localStorage.getItem('consumed-meals');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Filtrar para o paciente atual se necessário
                if (patientId) {
                    const filtered = parsed.filter((meal: ConsumedMeal) => meal.patientId === patientId);
                    setConsumedMeals(new Set(filtered.map((meal: ConsumedMeal) => meal.mealId)));
                } else {
                    setConsumedMeals(new Set(parsed.map((meal: ConsumedMeal) => meal.mealId)));
                }
            }
        } catch (error) {
            console.error('Erro ao carregar refeições consumidas:', error);
        }
    }, [patientId]);

    // Salvar no localStorage sempre que o estado mudar
    useEffect(() => {
        try {
            const mealsArray: ConsumedMeal[] = Array.from(consumedMeals).map(mealId => ({
                mealId,
                timestamp: new Date(),
                patientId
            }));
            localStorage.setItem('consumed-meals', JSON.stringify(mealsArray));
        } catch (error) {
            console.error('Erro ao salvar refeições consumidas:', error);
        }
    }, [consumedMeals, patientId]);

    const markAsConsumed = (mealId: string) => {
        setConsumedMeals(prev => new Set(prev).add(mealId));
    };

    const removeAsConsumed = (mealId: string) => {
        setConsumedMeals(prev => {
            const newSet = new Set(prev);
            newSet.delete(mealId);
            return newSet;
        });
    };

    const isConsumed = (mealId: string): boolean => {
        return consumedMeals.has(mealId);
    };

    const clearAllConsumed = () => {
        setConsumedMeals(new Set());
    };

    return {
        consumedMeals,
        markAsConsumed,
        removeAsConsumed,
        isConsumed,
        clearAllConsumed
    };
}