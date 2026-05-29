import { isAxiosError } from "axios";

export type ToastType = "error";

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

type ToastListener = (toasts: ToastItem[]) => void;

const TOAST_DURATION_MS = 7000;
const MAX_TOASTS = 4;
const listeners = new Set<ToastListener>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

let toasts: ToastItem[] = [];

const notify = () => {
  const snapshot = [...toasts];
  listeners.forEach(listener => listener(snapshot));
};

export const subscribeToToasts = (listener: ToastListener) => {
  listeners.add(listener);
  listener([...toasts]);

  return () => {
    listeners.delete(listener);
  };
};

export const dismissToast = (id: number) => {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }

  toasts = toasts.filter(toast => toast.id !== id);
  notify();
};

export const showToast = ({
  title,
  message,
  type = "error"
}: {
  title: string;
  message: string;
  type?: ToastType;
}) => {
  const id = Date.now() + Math.random();

  toasts = [{ id, title, message, type }, ...toasts].slice(0, MAX_TOASTS);
  notify();

  timers.set(id, setTimeout(() => dismissToast(id), TOAST_DURATION_MS));
};

export const showBackendErrorToast = (error: unknown) => {
  showToast({
    title: "Error",
    message: getBackendErrorMessage(error)
  });
};

export const getBackendErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    const responseMessage = extractMessage(error.response?.data);
    if (responseMessage) return responseMessage;

    if (error.response?.status) {
      return `Error ${error.response.status}${error.response.statusText ? `: ${error.response.statusText}` : ""}`;
    }

    if (error.message) return error.message;
  }

  const message = extractMessage(error);
  if (message) return message;

  if (error instanceof Error && error.message) return error.message;

  return "Ocurrio un error inesperado. Intentalo de nuevo.";
};

const preferredMessageKeys = [
  "message",
  "mensaje",
  "error",
  "detail",
  "details",
  "title",
  "description",
  "descripcion"
];

const extractMessage = (value: unknown): string | null => {
  if (value == null) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (Array.isArray(value)) {
    return joinMessages(value.map(item => extractMessage(item)));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of preferredMessageKeys) {
      const message = extractMessage(record[key]);
      if (message) return message;
    }

    return joinMessages(Object.values(record).map(item => extractMessage(item)));
  }

  return null;
};

const joinMessages = (messages: Array<string | null>) => {
  const uniqueMessages = [...new Set(messages.filter(Boolean) as string[])];
  return uniqueMessages.length > 0 ? uniqueMessages.join("\n") : null;
};
