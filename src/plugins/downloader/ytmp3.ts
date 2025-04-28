import { PluginType } from "../../types/plugin_type";

export const plugin: PluginType = {
  name: "YT",
  triggers: ["yt"],
  code: async (ctx) => {
    ctx.reply("ytmp3");
  },
};
