import { api } from '@/lib/api';
import type { AuditLog } from '@/@types';

export const logService = {
    getAllLogs: async (): Promise<AuditLog[]> => {
        const res = await api.get('/tasks/audit-logs');
        return res.data.data;
    },

    getLogs: async (id: string, ): Promise<AuditLog[]> => {
        const res = await api.get(`/tasks/${id}/audit-logs`);
        return res.data.data;
    }
};