import { LogType, printLog } from "../../lib/print_log";
import { PluginType } from "../../types/plugin_type";

export const plugin: PluginType = {
  name: "Tag All Member",
  triggers: ["tagall", "everyone", "semua"],
  info: {
    description: "Tag member group",
    usage: ".tagall --text <teks>",
    flags: {
      text: "Tag dengan teks",
      help: "Bantuan perintah",
    },
  },
  code: async (ctx, msg) => {
    const { flags } = await ctx.getParseCommand();
    try {
      if (!(await ctx.isGroup()) || !ctx.jid) {
        return ctx.reply("Perintah ini hanya bisa digunakan di dalam grup.");
      }

      if (flags.help) {
        return await ctx.reply(ctx.generateHelp(plugin));
      }

      const groupData = await ctx.sock.groupMetadata(ctx.jid);

      const participants = groupData.participants
        .filter((p: any) => ctx.sock.user?.id?.includes(p.id.split("@")[0]))
        .map((p: any) => p.id);

      let mentionText;
      if (flags.text) {
        mentionText = flags.text as string;
      } else {
        mentionText = participants
          .map((id: string) => `@${id.split("@")[0]}`)
          .join(" ");
      }

      return await ctx.reply({
        text: mentionText,
        mentions: participants,
      });
    } catch (e) {
      printLog(`TagAll Error: ${e}`, LogType.ERROR);
      return await ctx.reply("Terjadi kesalahan!");
    }
  },
};
