import { PluginType } from "../../types/plugin_type";

export const plugin: PluginType = {
  name: "Neko",
  triggers: ["neko"],
  code: async (ctx) => {
    ctx.reply("neko");
  },
};
