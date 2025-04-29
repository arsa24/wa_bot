import { LogType, printLog } from "../../lib/print_log";
import { FilterMessage } from "../../types/filter_message_type";
import { PluginType } from "../../types/plugin_type";

export default {
  name: "Tag All Member",
  triggers: ["tagall", "everyone", "semua"],
  code: async (ctx, msg) => {
    try {
      if (!(await ctx.isGroup()) || !ctx.jid) {
        return ctx.reply("Perintah ini hanya bisa digunakan di dalam grup.");
      }

      const groupData = await ctx.sock.groupMetadata(ctx.jid);

      const participants = groupData.participants
        .filter((p) => ctx.sock.user?.id?.includes(p.id.split("@")[0]))
        .map((p) => p.id);

      const mentionText = participants
        .map((id) => `@${id.split("@")[0]}`)
        .join(" ");

      const tagCaption =
        msg.split(" ").length === 1
          ? "Tag All Member Group"
          : await ctx.filterMessage(FilterMessage.ExceptFirst);

      return await ctx.reply({
        text: tagCaption,
        mentions: participants,
      });
    } catch (e) {
      printLog(`TagAll Error: ${e}`, LogType.ERROR);
      return await ctx.reply("Terjadi kesalahan!");
    }
  },
} as PluginType;
