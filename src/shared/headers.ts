import { useConfigStore } from "~/store/configStore";

export function getHeaders() {
  const configStore = useConfigStore.getState();

  const headers: Record<string, string> = {};

  const makeBearer = (s: string) => `Bearer ${s.trim()}`;
  const validString = (x: string) => x && x.length > 0;

  if (validString(configStore.config.password)) {
    headers.Authorization = makeBearer("np-" + configStore.config.password);
  }

  return headers;
}
