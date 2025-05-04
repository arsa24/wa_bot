import { Utils } from "../lib/utils";

export interface PluginType {
  name: string;
  triggers: string[];
  info?: {
    usage: string;
    description: string;
    flags: any;
  };
  isVoiceChat?: boolean;
  code: (ctx: Utils, msg: string) => Promise<void>;
}
