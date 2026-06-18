import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskTitle: string;
    onConfirm: () => Promise<void>;
    loading: boolean;
}

export function ConfirmationDialog({
                                       open,
                                       onOpenChange,
                                       taskTitle,
                                       onConfirm,
                                       loading
                                   }: ConfirmationDialogProps) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onConfirm();
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                 <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle className="text-left text-lg font-bold tracking-tight">
                            Delete Task Permanently?
                        </DialogTitle>
                        <DialogDescription className="text-left text-xs text-muted-foreground pt-1.5 leading-relaxed">
                            This action cannot be undone. Task <span className="font-semibold text-foreground">"{taskTitle}"</span> will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 pt-2">
                        <DialogClose asChild>
                            <Button variant="outline" size="lg" type="button" disabled={loading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            size="lg"
                            variant="destructive"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Yes, Delete"}
                        </Button>
                    </DialogFooter>
            </form>
                </DialogContent>
        </Dialog>
    )
}
