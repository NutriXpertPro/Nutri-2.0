import api from "./api";

export interface CustomSupplement {
    id: number;
    marca: string;
    nome: string;
    porcao: string;
    proteina_g: string;
    carboidrato_g: string;
    lipidios_g: string;
    energia_kcal: string;
    caracteristicas: string;
    source: string;
}

// Helper to clean numeric strings
const cleanNumeric = (val: string | number): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = val.replace(/[^\d.]/g, '');
    return cleaned ? parseFloat(cleaned) : 0;
};

export const customSupplementService = {
    async getAll() {
        const response = await api.get('/diets/custom-foods/');
        return response.data.results.map((item: any) => ({
            id: item.id,
            marca: item.nome.split(' - ')[0] || '',
            nome: item.nome.split(' - ')[1] || item.nome,
            porcao: item.unidade_caseira,
            proteina_g: String(item.proteina_g),
            carboidrato_g: String(item.carboidrato_g),
            lipidios_g: String(item.lipidios_g),
            energia_kcal: String(item.energia_kcal),
            caracteristicas: item.grupo,
            source: 'Meus Suplementos'
        }));
    },

    async getById(id: number) {
        const response = await api.get(`/diets/custom-foods/${id}/`);
        const item = response.data;
        return {
            id: item.id,
            marca: item.nome.split(' - ')[0] || '',
            nome: item.nome.split(' - ')[1] || item.nome,
            porcao: item.unidade_caseira,
            proteina_g: String(item.proteina_g),
            carboidrato_g: String(item.carboidrato_g),
            lipidios_g: String(item.lipidios_g),
            energia_kcal: String(item.energia_kcal),
            caracteristicas: item.grupo,
            source: 'Meus Suplementos'
        };
    },

    async create(supplement: Omit<CustomSupplement, 'id'>) {
        const payload = {
            nome: `${supplement.marca} - ${supplement.nome}`,
            grupo: 'Suplementos',
            energia_kcal: cleanNumeric(supplement.energia_kcal),
            proteina_g: cleanNumeric(supplement.proteina_g),
            lipidios_g: cleanNumeric(supplement.lipidios_g),
            carboidrato_g: cleanNumeric(supplement.carboidrato_g),
            fibra_g: 0,
            unidade_caseira: supplement.porcao,
            peso_unidade_caseira_g: cleanNumeric(supplement.porcao) // Tries to extract number from portion string
        };
        
        const response = await api.post('/diets/custom-foods/', payload);
        return response.data;
    },

    async update(id: number, supplement: Partial<Omit<CustomSupplement, 'id'>>) {
        const payload: any = {};
        
        if (supplement.marca || supplement.nome) {
            payload.nome = `${supplement.marca || ''} - ${supplement.nome || ''}`;
        }
        
        if (supplement.energia_kcal !== undefined) payload.energia_kcal = cleanNumeric(supplement.energia_kcal);
        if (supplement.proteina_g !== undefined) payload.proteina_g = cleanNumeric(supplement.proteina_g);
        if (supplement.lipidios_g !== undefined) payload.lipidios_g = cleanNumeric(supplement.lipidios_g);
        if (supplement.carboidrato_g !== undefined) payload.carboidrato_g = cleanNumeric(supplement.carboidrato_g);
        if (supplement.porcao !== undefined) {
            payload.unidade_caseira = supplement.porcao;
            payload.peso_unidade_caseira_g = cleanNumeric(supplement.porcao);
        }
        
        const response = await api.patch(`/diets/custom-foods/${id}/`, payload);
        return response.data;
    },

    async delete(id: number) {
        await api.delete(`/diets/custom-foods/${id}/`);
    }
};