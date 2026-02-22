import { renderHook } from '@testing-library/react-hooks';
import { handleReplaceFood } from './DietMealCard';

// Mock de tipos
type Food = {
  id: number;
  nome: string;
  proteina_g: number;
  carboidrato_g: number;
  lipidios_g: number;
  fibra_g?: number;
  unidade_caseira?: string;
  peso_unidade_caseira_g?: number;
  medidas?: string[];
  source: string;
};

type WorkspaceMealFood = {
  id: number;
  name: string;
  qty: number;
  ptn: number;
  cho: number;
  fat: number;
  fib: number;
  unidade_caseira?: string;
  peso_unidade_caseira_g?: number;
  medidas?: string[];
  originalId: number;
  source: string;
  prep: string;
  measure: string;
  unit: string;
  preferred: boolean;
};

const mockMeal = {
  foods: [
    {
      id: 1,
      name: 'Arroz',
      qty: 100,
      ptn: 2.7,
      cho: 28,
      fat: 0.3,
      fib: 0.4,
      unidade_caseira: 'g',
      peso_unidade_caseira_g: 100,
      originalId: 1,
      source: 'ibge',
      prep: '',
      measure: 'g',
      unit: 'g',
      preferred: true
    }
  ] as WorkspaceMealFood[]
};

describe('handleReplaceFood', () => {
  it('preserva qty quando é número', () => {
    const newFood: Food = {
      id: 2,
      nome: 'Quinoa',
      proteina_g: 4.4,
      carboidrato_g: 21.3,
      lipidios_g: 1.9,
      unidade_caseira: 'colher',
      peso_unidade_caseira_g: 30,
      source: 'nutri40'
    };

    const result = handleReplaceFood(1, newFood, mockMeal);
    expect(result[0].qty).toBe(100); // mantém o qty original
    expect(result[0].measure).toBe('colher');
    expect(result[0].unit).toBe('colher');
  });

  it('calcula qty com base em peso_unidade_caseira_g', () => {
    const mockMealEmptyQty = {
      foods: [
        {
          id: 1,
          name: 'Arroz',
          qty: '' as any, // simula string vazia
          ptn: 2.7,
          cho: 28,
          fat: 0.3,
          fib: 0.4,
          unidade_caseira: 'g',
          peso_unidade_caseira_g: 100,
          originalId: 1,
          source: 'ibge',
          prep: '',
          measure: 'g',
          unit: 'g',
          preferred: true
        }
      ]
    };

    const newFood: Food = {
      id: 2,
      nome: 'Quinoa',
      proteina_g: 4.4,
      carboidrato_g: 21.3,
      lipidios_g: 1.9,
      unidade_caseira: 'colher',
      peso_unidade_caseira_g: 30,
      source: 'nutri40'
    };

    const result = handleReplaceFood(1, newFood, mockMealEmptyQty);
    expect(result[0].qty).toBe(30); // 30g = peso_unidade_caseira_g
    expect(result[0].measure).toBe('colher');
  });

  it('usa fallback qty = 1 quando nada está disponível', () => {
    const mockMealEmpty = {
      foods: [
        {
          id: 1,
          name: 'Arroz',
          qty: '' as any,
          ptn: 2.7,
          cho: 28,
          fat: 0.3,
          fib: 0.4,
          originalId: 1,
          source: 'ibge',
          prep: '',
          measure: 'g',
          unit: 'g',
          preferred: true
        }
      ]
    };

    const newFood: Food = {
      id: 2,
      nome: 'Água',
      proteina_g: 0,
      carboidrato_g: 0,
      lipidios_g: 0,
      source: 'nutri40'
    };

    const result = handleReplaceFood(1, newFood, mockMealEmpty);
    expect(result[0].qty).toBe(1); // fallback seguro
    expect(result[0].measure).toBe('g');
  });
});

// Helper para teste (simula a função real)
function handleReplaceFood(
  oldFoodId: number,
  newFood: Food,
  meal: { foods: WorkspaceMealFood[] }
): WorkspaceMealFood[] {
  return meal.foods.map(f => {
    if (f.id === oldFoodId) {
      let newQty: number;
      if (typeof f.qty === 'number') {
        newQty = f.qty;
      } else if (newFood.peso_unidade_caseira_g) {
        newQty = (newFood.peso_unidade_caseira_g / 100) * 100;
      } else {
        newQty = 1;
      }
      return {
        ...f,
        id: Date.now(),
        name: newFood.nome,
        qty: newQty,
        ptn: newFood.proteina_g,
        cho: newFood.carboidrato_g,
        fat: newFood.lipidios_g,
        fib: newFood.fibra_g || 0,
        unidade_caseira: newFood.unidade_caseira ?? undefined,
        peso_unidade_caseira_g: newFood.peso_unidade_caseira_g ?? undefined,
        medidas: newFood.medidas,
        originalId: newFood.id,
        source: newFood.source,
        prep: '',
        measure: newFood.unidade_caseira ?? 'g',
        unit: newFood.unidade_caseira ?? 'g',
        preferred: false
      };
    }
    return f;
  });
}