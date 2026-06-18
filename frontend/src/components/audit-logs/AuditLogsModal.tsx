import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {History, ArrowRight} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuditLog } from '@/@types';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {logService} from "@/services/logService";

interface AuditLogsModalProps {
    taskId: string;
    taskTitle: string;
}

const STATUS_BADGE_MAP: Record<string, string> = {
    to_do: 'text-foreground bg-muted-foreground/30',
    pending: 'text-background bg-mauve-500',
    in_progress: 'text-foreground bg-amber-400/80',
    done: 'text-background bg-emerald-700',
};

export function AuditLogsModal({ taskId, taskTitle }: AuditLogsModalProps) {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await logService.getLogs(taskId);
            setLogs(data);
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        fetchLogs();
    };

    const formatStatus = (status: string) => status.toUpperCase().replace('_', ' ');

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-7.5 hover:text-blue-500 hover:bg-blue-50 duration-200 transition-colors ease-in-out shrink-0 rounded-sm"
                        onClick={handleOpen}
                    >
                        <History />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side={"bottom"}>
                    <p>Audit Log</p>
                </TooltipContent>
            </Tooltip>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md bg-card max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-muted-foreground">
                            Audit Logs: <span className="text-foreground font-semibold">"{taskTitle}"</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-3">
                        {loading ? (
                            <p className="text-center text-sm text-muted-foreground py-4 italic">Loading trail logs...</p>
                        ) : logs.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-4 italic">No modifications logged yet.</p>
                        ) : (
                            <div className="relative border-l-2 border-muted-foreground/20 pl-4 space-y-4 ml-2">
                                {logs.map((log) => (
                                    <div key={log.id} className="relative group">
                                        <div className="absolute -left-[21px] top-1.5 bg-muted-foreground w-2 h-2 rounded-full ring-4 ring-card" />

                                        <div className="bg-muted-foreground/5 p-3 rounded-lg border border-muted-foreground/10 shadow-2xs">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-semibold text-slate-800">
                                                    {log.actor}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-mono">
                                                    {new Date(log.timestamp).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                                <span className={`px-1.5 py-0.5 text-[10px] rounded ${STATUS_BADGE_MAP[log.fromStatus] || 'text-muted-foreground bg-muted'}`}>
                                                {formatStatus(log.fromStatus)}
                                            </span>

                                                <ArrowRight className="h-3 w-3 text-muted-foreground/80 animate-pulse" />

                                                <span className={`px-1.5 py-0.5 text-[10px] rounded ${STATUS_BADGE_MAP[log.toStatus] || 'text-muted-foreground bg-muted'}`}>
                                                {formatStatus(log.toStatus)}
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}