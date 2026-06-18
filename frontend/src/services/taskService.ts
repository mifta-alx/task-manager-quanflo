import { api } from '@/lib/api';
import type { Task, TaskStatus } from '@/@types';

export const taskService = {
    getAll: async (): Promise<Task[]> => {
        const res = await api.get('/tasks');
        return res.data.data;
    },

    create: async (payload: { title: string; description: string }): Promise<Task> => {
        const res = await api.post('/tasks', payload);
        console.log(res.data);
        return res.data.data;
    },

    updateStatus: async (id: string, status: TaskStatus, actor: string): Promise<Task> => {
        const res = await api.put(`/tasks/${id}/status`, { status, actor });
        return res.data.data;
    },

    delete: async (id: string): Promise<boolean> => {
        const res = await api.delete(`/tasks/${id}`);
        return res.data.success;
    }
};