
import api from "./api";
import supplementData from "./supplement-data.json";

export interface Supplement {
    id: number | string;
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

export const SUPPLEMENT_DATA = supplementData.map(s => ({
    ...s,
    proteina_g: s.proteina_g + "g",
    carboidrato_g: s.carboidrato_g + "g",
    lipidios_g: s.lipidios_g + "g",
    energia_kcal: String(s.energia_kcal),
    caracteristicas: "Referência Profissional"
}));

export const supplementService = {
    async search(query: string = "", params: any = {}) {
        const api = (await import("./api")).default;
        const queryLower = query.toLowerCase().trim();
        const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const queryTokens = normalize(queryLower).split(/\s+/).filter(t => t.length > 1);
        const sourceFilter = params.source;

        let apiResults: any[] = [];
        if (sourceFilter === "ALL" || sourceFilter === "PERSONAL" || !sourceFilter) {
            try {
                const apiParams: any = { search: query, grupo: "SUPLEMENTOS", page_size: 100 };
                if (sourceFilter === "PERSONAL") apiParams.mine = "true";
                const response = await api.get("/diets/foods/", { params: apiParams });
                apiResults = (response.data.results || []).map((f: any) => ({
                    id: f.id, marca: f.source === "Sua Tabela" ? "Minha Tabela" : (f.marca || f.source),
                    nome: f.nome, porcao: f.unidade_caseira || "100g",
                    proteina_g: (f.proteina_g || 0) + "g", carboidrato_g: (f.carboidrato_g || 0) + "g",
                    lipidios_g: (f.lipidios_g || 0) + "g", energia_kcal: String(Math.round(f.energia_kcal || 0)),
                    caracteristicas: f.grupo || "", source: f.source
                }));
            } catch (_error) {}
        }

        const localResults = SUPPLEMENT_DATA.filter(s => {
            const n = normalize(s.nome);
            const m = normalize(s.marca);
            return queryTokens.length === 0 || queryTokens.every(token => n.includes(token) || m.includes(token));
        }).map(s => ({ ...s, id: "local-" + s.id }));

        const finalResults = [...apiResults, ...localResults];
        const page = params.page || 1;
        const limit = params.limit || 50;
        const total = finalResults.length;
        
        return { 
            results: finalResults.slice((page - 1) * limit, page * limit), 
            total, count: total,
            next: (page * limit < total) ? page + 1 : null,
            previous: page > 1 ? page - 1 : null 
        };
    }
};
