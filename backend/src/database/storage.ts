import fs from "fs/promises"
import type {Task, AuditLog} from "#types/index.js";

const FILE_PATH = "./src/database/data.json"

interface DatabaseSchema {
    tasks : Task[]
    auditLogs : AuditLog[]
}

async function initDb() {
    try {
        await fs.access(FILE_PATH);
    } catch {
        const initialData: DatabaseSchema = { tasks: [], auditLogs: [] };
        await fs.writeFile(FILE_PATH, JSON.stringify(initialData, null, 2));
    }
}

await initDb();

export const storage = {
    read: async (): Promise<DatabaseSchema> => {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    },
    write: async (data: DatabaseSchema): Promise<void> => {
        await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
    }
};