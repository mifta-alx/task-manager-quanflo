import { toast } from 'sonner';

export function useToast() {
    const successToast = (message: string, description?: string) => {
        toast.success(message, {
            description: description,
            duration: 3000,
        });
    };

    const errorToast = (message: string, description?: string) => {
        toast.error(message, {
            description: description,
            duration: 4000,
        });
    };

    const infoToast = (message: string, description?: string) => {
        toast.info(message, {
            description: description,
        });
    };

    const loadingToast = (message: string) => {
        return toast.loading(message);
    };

    const dismissToast = (toastId?: string | number) => {
        toast.dismiss(toastId);
    };

    return {
        success: successToast,
        error: errorToast,
        info: infoToast,
        loading: loadingToast,
        dismiss: dismissToast,
        custom: toast,
    };
}