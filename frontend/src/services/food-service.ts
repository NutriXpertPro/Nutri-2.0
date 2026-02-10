import api from "./api"

// Types
export interface Food {
    id: number | string
    nome: string
    grupo: string
    source: 'TACO' | 'TBCA' | 'USDA' | 'IBGE' | 'CUSTOM' | 'Sua Tabela'
    energia_kcal: number
    proteina_g: number
    lipidios_g: number
    carboidrato_g: number
    fibra_g: number | null
    unidade_caseira?: string | null
    peso_unidade_caseira_g?: number | null
    medidas?: Array<{ label: string; weight: number }>
    is_favorite?: boolean
    originalId?: number | string | null
}

export interface FoodSearchResponse {
    count: number
    results: Food[]
}

export interface FoodGruposResponse {
    grupos: string[]
}

export interface Diet {
    id: number
    patient: number
    name: string
    goal?: string
    instructions?: string
    tmb?: number
    gcdt?: number
    target_calories?: number
    diet_type: string
    target_protein?: number
    target_carbs?: number
    target_fats?: number
    meals?: any[] // JSON structure
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CreateDietDTO {
    patient: number
    name: string
    goal?: string
    instructions?: string
    diet_type?: string
    target_calories?: number
    target_protein?: number
    target_carbs?: number
    target_fats?: number
}

// Food Service
export const foodService = {
    /**
     * Search foods across all databases (TACO, TBCA, USDA) + Supplements
     */
    search: async (query: string, options?: { source?: string; grupo?: string; limit?: number; page?: number; page_size?: number }) => {
        const queryLower = query.toLowerCase().trim();
        const params = new URLSearchParams({ search: query });
        
        // Se estivermos filtrando por Suplementos ou Sua Tabela
        const isSuplementos = options?.source === 'Sua Tabela' || options?.grupo === 'SUPLEMENTOS';

        if (isSuplementos) {
            params.append('source', 'Sua Tabela');
            params.append('grupo', 'SUPLEMENTOS');
        } else if (options?.source) {
            params.append('source', options.source);
        }
        
        if (options?.grupo && options.grupo !== 'SUPLEMENTOS') params.append('grupo', options.grupo);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.page_size) params.append('page_size', options.page_size.toString());

        // 1. Iniciar busca na API
        let apiResults: Food[] = [];
        const userFavKeys = new Set<string>();
        
        try {
            const { data: apiData } = await api.get<FoodSearchResponse>(`diets/foods/?${params}`);
            apiResults = apiData.results || [];
            
            // Buscar favoritos
            const favsResponse = await api.get<FoodSearchResponse>('diets/foods/favorites/');
            favsResponse.data.results?.forEach(f => userFavKeys.add(`${f.source}_${f.id}`));
        } catch (_e) {
        }
        
        // 2. Integrar com a base de 500 suplementos ÚNICOS
        const isOfficialOnly = options?.source && ['TACO', 'TBCA', 'USDA'].includes(options.source);
        let finalResults = [...apiResults];

        if (!isOfficialOnly) {
            try {
                const supplementData = require('./supplement-data.json');
                
                // Função para normalizar strings (remover acentos)
                const normalize = (str: string) => 
                    str.toLowerCase()
                       .normalize('NFD')
                       .replace(/[\u0300-\u036f]/g, '');

                const queryTokens = normalize(queryLower).split(/\s+/).filter(t => t.length > 1);

                const localSupps = supplementData.filter((s: any) => {
                    const nomeNorm = normalize(s.nome);
                    const marcaNorm = normalize(s.marca);
                    
                    // Busca por TOKENS (AND)
                    return queryTokens.length === 0 || queryTokens.every(token => 
                        nomeNorm.includes(token) || marcaNorm.includes(token)
                    );
                }).map((s: any) => ({
                    id: s.id,
                    nome: s.nome,
                    grupo: s.grupo,
                    source: 'CUSTOM', 
                    energia_kcal: s.energia_kcal,
                    proteina_g: s.proteina_g,
                    carboidrato_g: s.carboidrato_g,
                    lipidios_g: s.lipidios_g,
                    fibra_g: 0,
                    is_favorite: userFavKeys.has(`CUSTOM_${s.id}`),
                    unidade_caseira: s.porcao,
                    peso_unidade_caseira_g: 100,
                    medidas: [{ label: s.porcao, weight: 100 }]
                }));

                // ORDENAÇÃO: Priorizar quem contém os tokens no início
                localSupps.sort((a: any, b: any) => {
                    const aName = normalize(a.nome);
                    const bName = normalize(b.nome);
                    
                    if (queryTokens.length > 0) {
                        const startsWithA = aName.startsWith(queryTokens[0]);
                        const startsWithB = bName.startsWith(queryTokens[0]);
                        if (startsWithA && !startsWithB) return -1;
                        if (!startsWithA && startsWithB) return 1;
                    }
                    
                    return a.nome.localeCompare(b.nome);
                });

                // Mesclagem inteligente sem duplicação
                const apiNames = new Set((apiResults || []).map(f => f.nome.toLowerCase().trim()));
                const uniqueLocal = localSupps.filter((s: any) => !apiNames.has(s.nome.toLowerCase().trim()));
                
                finalResults = [...(apiResults || []), ...uniqueLocal];
            } catch (e) {
            }
        }

        // 3. Se o filtro for Suplementos, garantir que apenas eles apareçam
        if (isSuplementos) {
            finalResults = finalResults.filter(f => 
                f.source === 'Sua Tabela' || 
                f.source === 'CUSTOM' || 
                f.grupo?.toLowerCase().includes('suplemento') ||
                f.grupo?.toLowerCase().includes('whey') ||
                f.grupo?.toLowerCase().includes('protein') ||
                f.grupo?.toLowerCase().includes('bar') ||
                f.grupo?.toLowerCase().includes('snacks')
            );
        }

        // Paginação Manual para consistência com o UI
        const page = options?.page || 1;
        const pageSize = options?.page_size || 50;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedResults = finalResults.slice(startIndex, endIndex);

        return {
            count: finalResults.length,
            results: paginatedResults,
            next: endIndex < finalResults.length ? page + 1 : null,
            previous: page > 1 ? page - 1 : null
        };
    },

    toggleFavorite: async (source: string, id: string | number, nome: string) => {
        const { data } = await api.post('diets/toggle-favorite/', { source, id, nome })
        return data
    },

    getFavorites: async () => {
        const { data } = await api.get<FoodSearchResponse>('diets/foods/favorites/')
        return data
    },

    /**
     * Get all available food groups/categories
     */
    getGrupos: async () => {
        const { data } = await api.get<FoodGruposResponse>('diets/foods/grupos/')
        return data.grupos
    }
}

// Diet Service
export const dietService = {
    /**
     * List diets for a patient
     */
    listByPatient: async (patientId: number) => {
        const { data } = await api.get<Diet[]>(`diets/?patient=${patientId}`)
        return data
    },

    /**
     * Get diet by ID
     */
    getById: async (id: number) => {
        const { data } = await api.get<Diet>(`diets/${id}/`)
        return data
    },

    /**
     * Create a new diet
     */
    create: async (dietData: CreateDietDTO) => {
        const { data } = await api.post<Diet>('diets/', dietData)
        return data
    },

    /**
     * Update a diet
     */
    update: async (id: number, dietData: Partial<CreateDietDTO>) => {
        const { data } = await api.patch<Diet>(`diets/${id}/`, dietData)
        return data
    },

    /**
     * Delete a diet
     */
    delete: async (id: number) => {
        await api.delete(`diets/${id}/`)
    }
}
