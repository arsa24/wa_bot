import { PluginType } from "../../types/plugin_type";

export const plugin: PluginType = {
  name: "Bot",
  triggers: ["bot"],
  info: {
    description: "Konfigurasi bot",
    usage: ".bot --flag",
    flags: {
      restart: "Restart bot",
      help: "Tampilkan bantuan perintah",
    },
  },
  code: async (ctx, msg) => {
    const { args, flags } = await ctx.getParseCommand();
    try {
      if (flags.help) {
        await ctx.reply(ctx.generateHelp(plugin));
      }
      if (flags.restart) {
        await ctx.reply("Restarting bot...");
      }
    } catch (e) {
      ctx.reply("Terjadi kesalahan");
    }
  },
};
