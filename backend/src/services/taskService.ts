import { storage } from '#database/storage.js';
import { taskValidator } from '#validators/taskValidator.js';
import type { Task, AuditLog } from '#types/index.js';
import {AppError} from "#config/errors.js";

export const taskService = {
    getAllTasks: async (): Promise<Task[]> => {
        const db = await storage.read();
        return db.tasks;
    },

    createTask: async (rawTitle: unknown, rawDescription: unknown): Promise<Task> => {
        const { title, description } = taskValidator.validateCreate(rawTitle, rawDescription);

        const db = await storage.read();

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            status: 'to_do',
            createdAt: new Date().toISOString()
        };

        db.tasks.push(newTask);
        await storage.write(db);

        return newTask;
    },

    updateTaskStatus: async (taskId: string, rawStatus: unknown, rawActor: unknown): Promise<Task> => {
        const db = await storage.read();

        const task = db.tasks.find(t => t.id === taskId);
        if (!task) throw new AppError('TASK_NOT_FOUND');

        const currentStatus = task.status;

        const { status: newStatus, actor } = taskValidator.validateStatusTransition(task, rawStatus, rawActor);

        if (currentStatus === newStatus) {
            return task;
        }

        task.status = newStatus;

        const newLog: AuditLog = {
            id: crypto.randomUUID(),
            taskId: task.id,
            taskTitle: task.title,
            actor,
            fromStatus: currentStatus,
            toStatus: newStatus,
            timestamp: new Date().toISOString()
        };

        db.auditLogs.push(newLog);
        await storage.write(db);

        return task;
    },

    deleteTask: async (taskId: string): Promise<void> => {
        const db = await storage.read();
        const taskIndex = db.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            throw new AppError('TASK_NOT_FOUND');
        }
        db.tasks.splice(taskIndex, 1);
        await storage.write(db);
    },

    getAuditLogsByTaskId: async (taskId: string): Promise<AuditLog[]> => {
        const db = await storage.read();

        return db.auditLogs
            .filter(log => log.taskId === taskId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    getAllAuditLogs: async (): Promise<AuditLog[]> => {
        const db = await storage.read();
        return db.auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
};