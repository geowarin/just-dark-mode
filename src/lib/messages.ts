import { SitePreference } from "@/lib/preferences";

export interface RequestStateResponse {
  type: "dark-mode-state";
  isDark: boolean;
  confidence: number;
  sitePreference: SitePreference;
  hostname: string;
}

export function isRequestStateResponse(message: unknown): message is RequestStateResponse {
  return (message as RequestStateResponse).type === "dark-mode-state";
}
