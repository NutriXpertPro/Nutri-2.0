export const mockDietData = {
  id: 1,
  name: "Plano Alimentar Personalizado",
  goal: "Hipertrofia",
  diet_type: "Hipercalórica",
  calculation_method: "Mifflin-St Jeor",
  target_calories: 2400,
  target_protein: 140,
  target_carbs: 200,
  target_fats: 80,
  meals_rel: [
    {
      id: 1,
      name: "Café da Manhã",
      time: "08:00",
      day_of_week: 3, // Quarta-feira
      order: 0,
      notes: "Consumir logo após acordar",
      items: [
        {
          id: 1,
          food_name: "Mingau de Aveia com Frutas",
          quantity: 80,
          unit: "g",
          calories: 250,
          protein: 8,
          carbs: 45,
          fats: 4,
          fiber: 6
        },
        {
          id: 2,
          food_name: "Whey Protein Isolado",
          quantity: 1,
          unit: "dose",
          calories: 120,
          protein: 25,
          carbs: 2,
          fats: 1,
          fiber: 0
        },
        {
          id: 3,
          food_name: "Café Preto",
          quantity: 200,
          unit: "ml",
          calories: 5,
          protein: 0,
          carbs: 0,
          fats: 0,
          fiber: 0
        }
      ]
    },
    {
      id: 2,
      name: "Almoço",
      time: "13:00",
      day_of_week: 3, // Quarta-feira
      order: 1,
      notes: "Refeição principal do dia",
      items: [
        {
          id: 4,
          food_name: "Peito de Frango Grelhado",
          quantity: 150,
          unit: "g",
          calories: 230,
          protein: 45,
          carbs: 0,
          fats: 5,
          fiber: 0
        },
        {
          id: 5,
          food_name: "Arroz Integral",
          quantity: 100,
          unit: "g",
          calories: 112,
          protein: 2.5,
          carbs: 23,
          fats: 0.7,
          fiber: 2
        },
        {
          id: 6,
          food_name: "Brócolis no Vapor",
          quantity: 80,
          unit: "g",
          calories: 25,
          protein: 2.5,
          carbs: 4,
          fats: 0.3,
          fiber: 2.5
        }
      ]
    },
    {
      id: 3,
      name: "Lanche da Tarde",
      time: "16:30",
      day_of_week: 3, // Quarta-feira
      order: 2,
      notes: "Lanche pré-treino",
      items: [
        {
          id: 7,
          food_name: "Iogurte Grego (0%)",
          quantity: 1,
          unit: "copo",
          calories: 80,
          protein: 15,
          carbs: 6,
          fats: 0,
          fiber: 0
        },
        {
          id: 8,
          food_name: "Amêndoas Cruas",
          quantity: 15,
          unit: "g",
          calories: 90,
          protein: 3,
          carbs: 6,
          fats: 8,
          fiber: 3
        }
      ]
    },
    {
      id: 4,
      name: "Jantar",
      time: "19:30",
      day_of_week: 3, // Quarta-feira
      order: 3,
      notes: "Refeição leve e fácil digestão",
      items: [
        {
          id: 9,
          food_name: "Filé de Salmão",
          quantity: 180,
          unit: "g",
          calories: 316,
          protein: 36,
          carbs: 0,
          fats: 18,
          fiber: 0
        },
        {
          id: 10,
          food_name: "Aspargos",
          quantity: 120,
          unit: "g",
          calories: 20,
          protein: 2,
          carbs: 3,
          fats: 0.2,
          fiber: 2
        }
      ]
    }
  ],
  pdf_file: "/diet-plan.pdf"
};

// Macro targets para o cabeçalho
export const mockMacroTargets = {
  calories: {
    current: 1450,
    target: 2400,
    percentage: 60
  },
  protein: {
    current: 85,
    target: 140,
    percentage: 60
  },
  carbs: {
    current: 110,
    target: 200,
    percentage: 55
  },
  fats: {
    current: 32,
    target: 80,
    percentage: 40
  }
};