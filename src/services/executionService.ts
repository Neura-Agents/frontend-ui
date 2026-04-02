import { apiClient, getAuthToken } from '../api/client';

const BASE_URL = '/backend/api/agent-execution';

export interface ExecutionMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ExecutionEvent {
    type: string;
    data: any;
}
const KONG_URL = import.meta.env.VITE_API_URL;
export const executionService = {
    async triggerAgent(slug: string, messages: ExecutionMessage[], onEvent: (event: ExecutionEvent) => void) {
        const token = getAuthToken();
        const response = await fetch(`${KONG_URL}${BASE_URL}/${slug}/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            if (response.status === 402) {
                const errorData = await response.json();
                throw {
                    status: 402,
                    message: errorData.message || 'Insufficient balance',
                    balance: errorData.balance
                };
            }
            throw new Error(`Failed to trigger agent: ${response.statusText}`);
        }

        await this.handleSSEResponse(response, onEvent);
    },

    async subscribeToWorkflow(slug: string, workflowId: string, onEvent: (event: ExecutionEvent) => void) {
        const token = getAuthToken();
        const response = await fetch(`${KONG_URL}${BASE_URL}/${slug}/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "tasks/resubscribe",
                params: { task_id: workflowId },
                id: Date.now()
            }),
        });

        if (!response.ok) {
            if (response.status === 402) {
                const errorData = await response.json();
                throw {
                    status: 402,
                    message: errorData.message || 'Insufficient balance',
                    balance: errorData.balance
                };
            }
            throw new Error(`Failed to subscribe to workflow: ${response.statusText}`);
        }

        await this.handleSSEResponse(response, onEvent);
    },

    async getActiveWorkflows(slug: string) {
        const response = await apiClient.get(`${BASE_URL}/${slug}/active`);
        return response.data;
    },

    async handleSSEResponse(response: Response, onEvent: (event: ExecutionEvent) => void) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const decoder = new TextDecoder();
        let buffer = '';

        let currentEvent: string | null = null;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

            for (const line of lines) {
                if (line.startsWith('event:')) {
                    currentEvent = line.substring(6).trim();
                } else if (line.startsWith('data:')) {
                    const dataStr = line.substring(5).trim();
                    if (dataStr && currentEvent) {
                        try {
                            const jsonResponse = JSON.parse(dataStr);
                            const data = jsonResponse.result !== undefined ? jsonResponse.result : jsonResponse.error;
                            onEvent({ type: currentEvent, data });
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e, dataStr);
                        }
                    }
                }
            }
        }
    },

    async cancelWorkflow(slug: string, workflowId: string) {
        const response = await apiClient.post(`${BASE_URL}/${slug}/stream`, {
            jsonrpc: "2.0",
            method: "tasks/cancel",
            params: { task_id: workflowId, id: workflowId },
            id: Date.now()
        });
        return response.data;
    }
};
