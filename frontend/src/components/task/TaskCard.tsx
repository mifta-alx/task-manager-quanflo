import type { Task, TaskStatus } from '@/@types';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {Check, Trash2} from 'lucide-react';
import { PREDEFINED_ACTORS } from '@/constants/actors';
import { AuditLogsModal } from '@/components/audit-logs/AuditLogsModal';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface TaskCardProps {
    task: Task;
    currentActor: string;
    onActorChange: (actor: string) => void;
    onStatusChange: (id: string, nextStatus: TaskStatus, actor: string) => void;
    onDelete: (id: string) => void;
}

export function TaskCard({ task, currentActor, onActorChange, onStatusChange, onDelete }: TaskCardProps) {
    const getNextStatusOptions = (status: TaskStatus): { value: TaskStatus; label: string; color:string }[] => {
        switch (status) {
            case 'to_do':
                return [{ value: 'pending', label: 'Pending Task', color: 'hover:text-mauve-500 hover:bg-mauve-200' }];
            case 'pending':
                return [{ value: 'in_progress', label: 'Start Progress', color: 'hover:text-amber-500 hover:bg-amber-50' }];
            case 'in_progress':
                return [{ value: 'done', label: 'Complete Task', color: 'hover:text-emerald-500 hover:bg-emerald-50' }];
            case 'done':
                return [];
            default:
                return [];
        }
    };

    const nextOptions = getNextStatusOptions(task.status);

    return (
        <Card className="bg-white duration-200 flex flex-col justify-between rounded-lg p-3 gap-0 border border-muted-foreground/10 shadow-none ring-0">

            <CardContent className="p-0 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-foreground line-clamp-2">
                            {task.title}
                        </p>
                        {task.description && (
                            <p className="text-xs text-muted-foreground/80 line-clamp-3">
                                {task.description }
                            </p>
                        )}
                </div>
                <div className="flex flex-row justify-between items-center w-full min-w-0">
                    <div className="flex flex-row gap-2 items-center flex-1 min-w-0">
                        {nextOptions.length > 0 && (
                                <Select value={currentActor} onValueChange={onActorChange}>
                                    <SelectTrigger className="text-xs bg-white border-border rounded-sm truncate w-28 shrink" size="sm">
                                        <SelectValue placeholder="Select actor"  />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-xs">
                                        <SelectGroup>
                                        <SelectLabel>Actor</SelectLabel>
                                        {PREDEFINED_ACTORS.map((actor) => (
                                            <SelectItem key={actor} value={actor}>
                                                {actor}
                                            </SelectItem>
                                        ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                        )}

                    {nextOptions.map((opt) => (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    key={opt.value}
                                    variant="outline"
                                    size="icon"
                                    className={`size-7.5 shrink-0 rounded-sm duration-200 transition-colors ease-in-out ${opt.color}`}
                                    onClick={() => onStatusChange(task.id, opt.value, currentActor)}
                                >
                                    <Check />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side={"bottom"}>
                                <p>{opt.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                        <AuditLogsModal taskId={task.id} taskTitle={task.title} />
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-7.5 hover:text-red-500 hover:bg-red-50 duration-200 transition-colors ease-in-out shrink-0 rounded-sm"
                                onClick={() => onDelete(task.id)}
                            >
                                <Trash2 />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side={"bottom"}>
                            <p>Delete Task</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardContent>
        </Card>
    );
}