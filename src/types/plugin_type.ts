import { Utils } from "../lib/utils";

export interface PluginType {
    name: string,
    triggers: string[];
    info?: string;
    code: (ctx: Utils) => Promise<void>;
}