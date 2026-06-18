import { useEffect, useState } from 'react';
import type { Task, TaskStatus, AuditLog } from '@/@types';
import { CreateTaskModal } from '@/components/task/CreateTaskModal';
import { TaskCard } from '@/components/task/TaskCard';
import { GlobalAuditLogs } from "@/components/audit-logs/GlobalAuditLogs";
import {ClipboardList, History} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {taskService} from "@/services/taskService";
import {useToast} from "@/hooks/useToast";
import {logService} from "@/services/logService";
import {ConfirmationDialog} from "@/components/task/ConfirmationDialog";

const COLUMNS: { id: TaskStatus; title: string; badgeColor: string; bg: string, color: string }[] = [
    { id: 'to_do', title: 'TO DO', badgeColor: 'text-foreground bg-muted-foreground/30', bg: 'bg-muted/40', color:'text-muted-foreground/50' },
    { id: 'pending', title: 'PENDING', badgeColor: 'text-background bg-mauve-500', bg: 'bg-mauve-100/60', color:'text-mauve-500' },
    { id: 'in_progress', title: 'IN PROGRESS', badgeColor: 'text-foreground bg-amber-400/80', bg: 'bg-amber-100/40', color:'text-amber-400' },
    { id: 'done', title: 'DONE', badgeColor: 'text-background bg-emerald-700', bg: 'bg-emerald-100/40', color:'text-emerald-700' },
];

export default function App() {
    const toast = useToast();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [globalLogs, setGlobalLogs] = useState<AuditLog[]>([]);
    const [globalActor, setGlobalActor] = useState<string>('john.doe');
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) {
            toast.error('Failed to load tasks');
        }
    };

    const fetchGlobalLogs = async () => {
        try {
            const data = await logService.getAllLogs();
            setGlobalLogs(data);
        } catch (error) {
            toast.error('Failed to load audit logs');
        }
    };

    const initData = async () => {
        setLoading(true);
        await Promise.all([fetchTasks(), fetchGlobalLogs()]);
        setLoading(false);
    };

    const handleStatusChange = async (id: string, nextStatus: TaskStatus, actor: string) => {
        try {
            await taskService.updateStatus(id, nextStatus, actor);
            await Promise.all([fetchTasks(), fetchGlobalLogs()]);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to change task status');
        }
    };

    const handleDeleteTask = (task: Task) => {
        setIsDeleteDialogOpen(true);
        setTaskToDelete(task)
    }

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        setDeleteLoading(true);
        try {
            await taskService.delete(taskToDelete.id);

            toast.success("Task Deleted Successfully");

            setTaskToDelete(null);
            setDeleteLoading(false);

            await Promise.all([fetchTasks(), fetchGlobalLogs()]);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Delete failed';
            toast.error("Error", errorMsg);
        }finally {
            setIsDeleteDialogOpen(false);
        }
    };

    useEffect(() => {
        initData();
    }, []);

    return (
        <Tabs defaultValue="board" className="min-h-screen bg-background text-foreground font-sans antialiased pb-12">
            <header className="sticky top-0 z-10 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 lg:pt-20 lg:pb-4 gap-4 flex flex-col">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl lg:text-5xl font-bold tracking-tighter text-foreground">Task Manager</h1>
                        <CreateTaskModal onTaskCreated={fetchTasks}/>
                    </div>
                    <TabsList>
                        <TabsTrigger value="board">
                            <ClipboardList/>
                            Board
                        </TabsTrigger>
                        <TabsTrigger value="logs">
                            <History/>
                            Logs
                        </TabsTrigger>
                    </TabsList>
                </div>
            </header>

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <TabsContent value="board">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-sm font-medium text-slate-400">Syncing database states...</p>
                            </div>
                        ) :(
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                                {COLUMNS.map((col) => {
                                    const columnTasks = tasks.filter((t) => t.status === col.id);

                                    return (
                                        <div key={col.id} className={`rounded-xl p-4 ${col.bg} flex flex-col max-h-[70vh]`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                                                        {col.title}
                                                    </span>
                                                </div>
                                                <span className={`text-xs font-medium ${col.color}`}>
                                                    {columnTasks.length}
                                                </span>
                                            </div>

                                            <div className="space-y-4 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                                                {columnTasks.length === 0 ? (
                                                    <div className="rounded-lg p-6 text-center bg-white border border-muted-foreground/10">
                                                        <p className={`text-xs font-medium ${col.color}`}>No tasks</p>
                                                    </div>
                                                ) : (
                                                    columnTasks.map((task) => (
                                                        <TaskCard
                                                            key={task.id}
                                                            task={task}
                                                            currentActor={globalActor}
                                                            onActorChange={setGlobalActor}
                                                            onStatusChange={handleStatusChange}
                                                            onDelete={() => handleDeleteTask(task)}
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="logs">
                        <GlobalAuditLogs logs={globalLogs} />
                    </TabsContent>
            </main>
            <ConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                taskTitle={taskToDelete?.title || ""}
                loading={deleteLoading}
                onConfirm={handleConfirmDelete}
            />
        </Tabs>
    );
}