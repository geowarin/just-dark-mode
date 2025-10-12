import { ProtocolWithReturn } from "webext-bridge";

export interface RequestStateResponse {
  isDark: boolean;
  confidence: number;
  sitePreference: SitePreference;
  hostname: string;
}

declare module "webext-bridge" {
  export interface ProtocolMap {
    "toggle-dark-mode": { hostname: string; enabled: boolean };
    "request-state": ProtocolWithReturn<void, RequestStateResponse>;
  }
}
