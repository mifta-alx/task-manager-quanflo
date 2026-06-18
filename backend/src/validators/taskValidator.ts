import type {Task, TaskStatus} from "#types/index.js";
import {ALLOWED_TRANSITIONS} from "#config/constant.js";
import {AppError} from "#config/errors.js";

export const taskValidator = {
    validateCreate: (title:unknown, description:unknown): {title: string, description:string} => {
        if(!title || typeof title !== "string" || title.trim() === ""){
            throw new AppError("VALIDATION_TITLE_REQUIRED")
        }

        return {
            title:title.trim(),
            description: typeof description === "string" ? description.trim() : ""
        }
    },

    validateStatusTransition: (task: Task, newStatus: unknown, actor: unknown): { status: TaskStatus; actor: string } => {
        if (!actor || typeof actor !== 'string' || actor.trim() === '') {
            throw new AppError('VALIDATION_ACTOR_REQUIRED');
        }

        const validStatuses: TaskStatus[] = ['to_do', 'pending', 'in_progress', 'done'];
        if (!validStatuses.includes(newStatus as TaskStatus)) {
            throw new AppError('VALIDATION_INVALID_STATUS_VALUE');
        }

        const targetStatus = newStatus as TaskStatus;
        const currentStatus = task.status;

        if (currentStatus === targetStatus) {
            return { status: targetStatus, actor: actor.trim() };
        }

        const allowedNextStates = ALLOWED_TRANSITIONS[currentStatus];
        if (!allowedNextStates.includes(targetStatus)) {
            throw new AppError('VALIDATION_INVALID_TRANSITION_FLOW');
        }

        return {
            status: targetStatus,
            actor: actor.trim()
        };
    }
}