export interface PluginType {
    name: string,
    triggers: string[];
    info?: string;
    code: () => Promise<void>;
}