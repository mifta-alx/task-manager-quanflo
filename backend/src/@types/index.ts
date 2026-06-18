export type TaskStatus = "to_do" | "pending" | "in_progress" | "done";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    taskId: string;
    taskTitle: string;
    actor: string;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
    timestamp: string;
}