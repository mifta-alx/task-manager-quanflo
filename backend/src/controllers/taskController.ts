import type {NextFunction, Request, Response} from 'express';
import { taskService } from '#services/taskService.js';
import {Success} from "#utils/responseHelper.js";

export const taskController = {
    getTasks: async (req: Request, res: Response, next:NextFunction) => {
        try{
            const tasks = await taskService.getAllTasks();
            return Success(res, tasks);
        }catch(error){
            next(error);
        }
    },

    createTask: async (req: Request, res: Response, next:NextFunction) => {
        try {
            const { title, description } = req.body;
            const task = await taskService.createTask(title, description);
            return Success(res, task, "Task created successfully", 201);
        } catch (error: any) {
            next(error);
        }
    },

    updateStatus: async (req: Request, res: Response, next:NextFunction) => {
        const id = req.params['id'] as string;
        const { status, actor } = req.body;

        try {
            const updatedTask = await taskService.updateTaskStatus(id, status, actor);
            return Success(res, updatedTask, "Task status updated successfully");
        } catch (error: any) {
            next(error);
        }
    },

    deleteTask: async (req: Request, res: Response, next:NextFunction) => {
        const id = req.params['id'] as string;
        try{
            await taskService.deleteTask(id);
            return Success(res, null, "Task deleted successfully");
        }catch (error: any) {
            next(error);
        }
    },

    getLogs: async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params['id'] as string;
        try {
            const logs = await taskService.getAuditLogsByTaskId(id);
            return Success(res, logs);
        } catch (error) {
            next(error);
        }
    },

    getAllLogs: async (req: Request, res: Response, next:NextFunction) => {
        try{
            const allLogs = await taskService.getAllAuditLogs();
            return Success(res, allLogs);
        }catch(error){
            next(error);
        }
    },

};