import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

type SSEPayload = { action: string; data: unknown };
type Listener = (payload: SSEPayload) => void;

interface SSEContextValue {
  subscribe: (event: string, cb: Listener) => () => void;
}

const SSEContext = createContext<SSEContextValue>({ subscribe: () => () => {} });

export function SSEProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const listeners = useRef<Map<string, Set<Listener>>>(new Map());

  useEffect(() => {
    if (!token) return;

    const es = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/api/events?token=${encodeURIComponent(token)}`
    );

    const handle = (eventName: string) => (e: Event) => {
      try {
        const payload: SSEPayload = JSON.parse((e as MessageEvent).data);
        listeners.current.get(eventName)?.forEach((cb) => cb(payload));
      } catch {
        // ignore malformed messages
      }
    };

    const onLead = handle("lead");
    const onWorkspace = handle("workspace");

    es.addEventListener("lead", onLead);
    es.addEventListener("workspace", onWorkspace);

    return () => {
      es.removeEventListener("lead", onLead);
      es.removeEventListener("workspace", onWorkspace);
      es.close();
    };
  }, [token]);

  const subscribe = (event: string, cb: Listener): (() => void) => {
    if (!listeners.current.has(event)) {
      listeners.current.set(event, new Set());
    }
    listeners.current.get(event)!.add(cb);
    return () => listeners.current.get(event)?.delete(cb);
  };

  return (
    <SSEContext.Provider value={{ subscribe }}>{children}</SSEContext.Provider>
  );
}

export const useSSEContext = () => useContext(SSEContext);
