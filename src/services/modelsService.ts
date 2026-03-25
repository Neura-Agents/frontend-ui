import { apiClient } from '../api/client';

export interface Model {
    model_name: string;
    provider: string;
    inputtokens: number;
    outputtokens: number;
    cost_input: number;
    cost_output: number;
}

const BASE_URL = '/backend/api/models';

export const modelsService = {
    async getModels(): Promise<Model[]> {
        const response = await apiClient.get(`${BASE_URL}/list`);
        return response.data.data;
    }
};
