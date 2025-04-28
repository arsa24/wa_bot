import { Utils } from "../lib/utils";

export interface PluginType {
    name: string,
    triggers: string[];
    info?: string;
    isVoiceChat?: boolean; 
    code: (ctx: Utils, msg: string) => Promise<void>;
}