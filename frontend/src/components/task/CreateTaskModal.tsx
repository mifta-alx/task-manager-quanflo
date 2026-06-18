import React, { useState } from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import {taskService} from "@/services/taskService";
import {useToast} from "@/hooks/useToast";

interface CreateTaskModalProps {
    onTaskCreated: () => void;
}

export function CreateTaskModal({ onTaskCreated }: CreateTaskModalProps) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await taskService.create({ title, description });

            toast.success('Task Created Successfully');
            setTitle('');
            setDescription('');
            setOpen(false);
            onTaskCreated();
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Failed to create task';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus/> New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title"
                               name="title"
                               placeholder="e.g., Fix Auth Lifecycle Bug"
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               required
                              />
                    </Field>
                    <Field>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                            id="description"
                               name="description"
                               placeholder="Brief summary of the engineering task..."
                               value={description}
                               onChange={(e) => setDescription(e.target.value)} />
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <Button type="submit"
                            className="w-full"
                            size="lg">{loading ? 'Saving...' : 'Save task'}</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}