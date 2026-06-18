import type { AuditLog } from '@/@types';
import { ArrowRight } from 'lucide-react';

interface GlobalAuditLogsProps {
    logs: AuditLog[];
}

const STATUS_BADGE_MAP: Record<string, string> = {
    to_do: 'text-foreground bg-muted-foreground/30',
    pending: 'text-background bg-mauve-500',
    in_progress: 'text-foreground bg-amber-400/80',
    done: 'text-background bg-emerald-700',
};

export function GlobalAuditLogs({ logs }: GlobalAuditLogsProps) {
    const formatStatus = (status: string) => status.toUpperCase().replace('_', ' ');

    return (
        <div className="max-w-6xl mx-auto">
            {logs.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12 italic">No activity logs found.</p>
            ) : (
                <div className="relative border-l-2 border-slate-100 pl-5 space-y-5 ml-2">
                    {logs.map((log) => (
                        <div key={log.id} className="relative group">
                            <div className="absolute -left-[26px] top-1.5 bg-muted-foreground w-2.5 h-2.5 rounded-full ring-4 ring-card" />

                            <div className="bg-muted-foreground/5 p-4 rounded-xl border border-muted-foreground/10 shadow-2xs hover:bg-muted-foreground/10 transition-colors">
                                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-start">
                                    <div className="flex flex-col gap-2">
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                User <span className="font-bold text-foreground">"{log.actor}"</span> changed Task <span className="font-bold text-foreground">"{log.taskTitle}"</span> status
                                            </p>

                                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                                            <span className={`px-2 py-0.5 rounded ${STATUS_BADGE_MAP[log.fromStatus] || 'text-muted-foreground bg-muted'}`}>
                                                {formatStatus(log.fromStatus)}
                                            </span>

                                            <ArrowRight className="h-3 w-3 text-muted-foreground/80 animate-pulse" />

                                            <span className={`px-2 py-0.5 rounded ${STATUS_BADGE_MAP[log.toStatus] || 'text-muted-foreground bg-muted'}`}>
                                                {formatStatus(log.toStatus)}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-mono bg-card px-2 py-0.5 rounded border border-slate-200/60 shrink-0 self-start">
                                        {new Date(log.timestamp).toLocaleString('id-ID')}
                                    </span>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}