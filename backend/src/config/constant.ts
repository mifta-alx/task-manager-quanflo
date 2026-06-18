import type {TaskStatus} from "#types/index.js";

export const ALLOWED_TRANSITIONS : Record<TaskStatus, TaskStatus[]> = {
    "to_do" : ["pending"],
    "pending" : ["in_progress"],
    "in_progress" : ["done"],
    "done" : [],
}