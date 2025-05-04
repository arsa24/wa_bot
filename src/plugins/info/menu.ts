import { PluginType } from "../../types/plugin_type";

export default {
  name: "",
  triggers: [],
  code: async (ctx, msg) => {
    ctx.reply("Menu");
  },
} as PluginType;
