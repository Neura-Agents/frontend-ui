import { apiClient, getAuthToken } from '../api/client';

const API_URL = '/backend/api/knowledge';
const KONG_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface KnowledgeBase {
    id: string;
    name: string;
    description: string;
    documentCount: number;
    lastUpdated: string;
    status: 'active' | 'inactive' | 'processing';
    visibility: 'public' | 'private';
    user_id?: string;
}

export interface KnowledgeGraph {
    id: string;
    name: string;
    description: string;
    nodeCount: number;
    relationCount: number;
    documentCount?: number;
    lastUpdated: string;
    status: 'active' | 'inactive' | 'processing';
    visibility: 'public' | 'private';
    user_id?: string;
}

export interface KnowledgeDocument {
    id: string;
    knowledge_id: string;
    storage_id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    file_url: string;
    uploaded_at: string;
    status: string;
    processed_chunks?: number;
    total_chunks?: number;
}

export interface SearchParams {
    name?: string;
    id?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}

export const knowledgeService = {
    // Knowledge Bases
    getKnowledgeBases: async (params?: SearchParams): Promise<PaginatedResponse<KnowledgeBase>> => {
        const response = await apiClient.get(`${API_URL}/bases`, { params });
        const { items, total, page, limit } = response.data;
        
        return {
            items: items.map((kb: any) => ({
                id: kb.id,
                name: kb.name,
                description: kb.description,
                documentCount: parseInt(kb.documentCount || '0'),
                lastUpdated: new Date(kb.updated_at).toLocaleDateString(),
                status: kb.status,
                visibility: kb.visibility || 'private',
                user_id: kb.user_id
            })),
            total,
            page,
            limit
        };
    },

    createKnowledgeBase: async (name: string, description: string, visibility: 'public' | 'private' = 'private'): Promise<KnowledgeBase> => {
        const response = await apiClient.post(`${API_URL}/bases`, { name, description, visibility });
        return response.data;
    },

    updateKnowledgeBase: async (id: string, name: string, description: string, visibility: 'public' | 'private'): Promise<KnowledgeBase> => {
        const response = await apiClient.put(`${API_URL}/bases/${id}`, { name, description, visibility });
        return response.data;
    },

    deleteKnowledgeBase: async (id: string): Promise<void> => {
        await apiClient.delete(`${API_URL}/bases/${id}`);
    },

    // Knowledge Graphs
    getKnowledgeGraphs: async (params?: SearchParams): Promise<PaginatedResponse<KnowledgeGraph>> => {
        const response = await apiClient.get(`${API_URL}/graphs`, { params });
        const { items, total, page, limit } = response.data;

        return {
            items: items.map((kg: any) => ({
                id: kg.id,
                name: kg.name,
                description: kg.description,
                nodeCount: parseInt(kg.node_count || '0'),
                relationCount: parseInt(kg.relation_count || '0'),
                documentCount: parseInt(kg.documentCount || '0'),
                lastUpdated: new Date(kg.updated_at).toLocaleDateString(),
                status: kg.status,
                visibility: kg.visibility || 'private',
                user_id: kg.user_id
            })),
            total,
            page,
            limit
        };
    },

    createKnowledgeGraph: async (name: string, description: string, visibility: 'public' | 'private' = 'private'): Promise<KnowledgeGraph> => {
        const response = await apiClient.post(`${API_URL}/graphs`, { name, description, visibility });
        return response.data;
    },

    updateKnowledgeGraph: async (id: string, name: string, description: string, visibility: 'public' | 'private'): Promise<KnowledgeGraph> => {
        const response = await apiClient.put(`${API_URL}/graphs/${id}`, { name, description, visibility });
        return response.data;
    },

    deleteKnowledgeGraph: async (id: string): Promise<void> => {
        await apiClient.delete(`${API_URL}/graphs/${id}`);
    },

    // Documents & Upload
    getDocuments: async (knowledgeId: string): Promise<KnowledgeDocument[]> => {
        const response = await apiClient.get(`${API_URL}/${knowledgeId}/documents`);
        return response.data;
    },

    uploadDocuments: async (knowledgeId: string, type: 'base' | 'graph', files: File[]): Promise<any> => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await apiClient.post(`${API_URL}/${knowledgeId}/upload?type=${type}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteDocument: async (docId: string): Promise<void> => {
        await apiClient.delete(`${API_URL}/documents/${docId}`);
    },

    queryKnowledgeBase: async (kbId: string, query: string, limit: number = 5): Promise<any[]> => {
        const response = await apiClient.post(`${API_URL}/bases/${kbId}/query`, { query, limit });
        return response.data;
    },
    queryKnowledgeGraph: async (kgId: string, query?: string, depth: number = 2): Promise<any> => {
        const response = await apiClient.post(`${API_URL}/graphs/${kgId}/query`, { query, depth });
        return response.data;
    },

    subscribeToIngestion: (workflowId: string, type: 'base' | 'graph', onEvent: (type: string, data: any) => void) => {
        const token = getAuthToken();
        const namespace = type === 'base' ? 'knowledge-base' : 'knowledge-graph';
        const url = `${KONG_URL}${API_URL}/ingestion/subscribe/${workflowId}?namespace=${namespace}${token ? `&jwt=${token}` : ''}`;
        
        const eventSource = new EventSource(url);
        
        const eventTypes = ['status', 'doc_start', 'doc_progress', 'doc_completed', 'doc_failed', 'WorkflowStarted', 'Error'];
        
        eventTypes.forEach(eventType => {
            eventSource.addEventListener(eventType, (e: any) => {
                try {
                    const data = JSON.parse(e.data);
                    onEvent(eventType, data);
                } catch (err) {
                    console.error('Failed to parse SSE event data', err);
                }
            });
        });

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            eventSource.close();
        };

        return () => eventSource.close();
    }
};
