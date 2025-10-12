import { ProtocolWithReturn } from "webext-bridge";
import { DarkMode } from "@/lib/preferences";

export interface RequestStateResponse {
  darkModeDetected: boolean;
  confidence: number;
  sitePreference: SitePreference;
  hostname: string;
}

declare module "webext-bridge" {
  export interface ProtocolMap {
    "toggle-dark-mode": { hostname: string; mode: DarkMode };
    "request-state": ProtocolWithReturn<void, RequestStateResponse>;
  }
}
