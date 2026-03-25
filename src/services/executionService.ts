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

export const executionService = {
    async triggerAgent(slug: string, messages: ExecutionMessage[], onEvent: (event: ExecutionEvent) => void) {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:8000${BASE_URL}/${slug}/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            throw new Error(`Failed to trigger agent: ${response.statusText}`);
        }

        await this.handleSSEResponse(response, onEvent);
    },

    async subscribeToWorkflow(workflowId: string, onEvent: (event: ExecutionEvent) => void) {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:8000${BASE_URL}/agent/workflow/subscribe/${workflowId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
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

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

            let currentEvent: string | null = null;
            for (const line of lines) {
                if (line.startsWith('event:')) {
                    // Note: Backend adds TWO spaces after event:
                    currentEvent = line.replace('event:  ', '').trim();
                } else if (line.startsWith('data:')) {
                    const dataStr = line.replace('data:', '').trim();
                    if (dataStr && currentEvent) {
                        try {
                            const data = JSON.parse(dataStr);
                            onEvent({ type: currentEvent, data });
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e, dataStr);
                        }
                    }
                }
            }
        }
    },

    async cancelWorkflow(workflowId: string) {
        const response = await apiClient.post(`${BASE_URL}/workflow/cancel/${workflowId}`);
        return response.data;
    }
};
