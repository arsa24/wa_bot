import { PluginType } from "../../types/plugin_type";

export const plugin: PluginType = {
  name: "Ping",
  triggers: ["ping"],
  code: async (ctx) => {
    ctx.reply("pong");
  },
};
