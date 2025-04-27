import { PluginType } from "../../types/plugin_type";

export const ping: PluginType = {
  name: "Ping",
  triggers: ["ping"],
  code: async (ctx) => {
  },
};
