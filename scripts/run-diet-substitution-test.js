// run-diet-substitution-test.js
// Executa os 3 cenários do teste unitário sem depender de Jest

const { strict: assert } = require('assert');

// Copiado da lógica de handleReplaceFood
function handleReplaceFood(oldFoodId, newFood, meal) {
  return meal.foods.map(f => {
    if (f.id === oldFoodId) {
      let newQty;
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

// Caso 1: qty número → mantém
const meal1 = {
  foods: [{ id: 1, name: 'Arroz', qty: 100, ptn: 2.7, cho: 28, fat: 0.3, fib: 0.4, unidade_caseira: 'g', peso_unidade_caseira_g: 100, originalId: 1, source: 'ibge', prep: '', measure: 'g', unit: 'g', preferred: true }]
};
const newFood1 = { id: 2, nome: 'Quinoa', proteina_g: 4.4, carboidrato_g: 21.3, lipidios_g: 1.9, unidade_caseira: 'colher', peso_unidade_caseira_g: 30, source: 'nutri40' };
const result1 = handleReplaceFood(1, newFood1, meal1);
assert.strictEqual(result1[0].qty, 100, 'Caso 1: qty deve ser 100');
assert.strictEqual(result1[0].measure, 'colher', 'Caso 1: measure deve ser colher');

// Caso 2: qty string vazia + peso_unidade_caseira_g
const meal2 = {
  foods: [{ id: 1, name: 'Arroz', qty: '', ptn: 2.7, cho: 28, fat: 0.3, fib: 0.4, unidade_caseira: 'g', peso_unidade_caseira_g: 100, originalId: 1, source: 'ibge', prep: '', measure: 'g', unit: 'g', preferred: true }]
};
const result2 = handleReplaceFood(1, newFood1, meal2);
assert.strictEqual(result2[0].qty, 30, 'Caso 2: qty deve ser 30');
assert.strictEqual(result2[0].measure, 'colher', 'Caso 2: measure deve ser colher');

// Caso 3: qty vazio e sem peso_unidade_caseira_g
const newFood3 = { id: 2, nome: 'Água', proteina_g: 0, carboidrato_g: 0, lipidios_g: 0, source: 'nutri40' };
const meal3 = {
  foods: [{ id: 1, name: 'Arroz', qty: '', ptn: 2.7, cho: 28, fat: 0.3, fib: 0.4, originalId: 1, source: 'ibge', prep: '', measure: 'g', unit: 'g', preferred: true }]
};
const result3 = handleReplaceFood(1, newFood3, meal3);
assert.strictEqual(result3[0].qty, 1, 'Caso 3: qty deve ser 1');
assert.strictEqual(result3[0].measure, 'g', 'Caso 3: measure deve ser g');

console.log('✅ Todos os 3 testes passaram!');