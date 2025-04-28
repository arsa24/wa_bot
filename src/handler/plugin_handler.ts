import { WASocket } from "baileys";
import { Utils } from "../lib/utils";
import { matchingPlugin, readPlugins } from "../rust/index";
import { PluginType } from "../types/plugin_type";
import { Simulate } from "../types/simulate_type";
import { botConfig } from "../config/bot_config";

export class PluginHandler {
  path: string;
  sock: WASocket;

  constructor(path: string, sock: WASocket) {
    this.path = path;
    this.sock = sock;
  }

  async load(): Promise<void> {
    this.sock.ev.on("messages.upsert", async (msg) => {
      const ctx: Utils = new Utils(this.sock, msg);

      const plugins: string[] = readPlugins(this.path);
      const getMessage: string = await ctx.getMessages();
      const getCommand: string = getMessage.split(" ")[0];

      plugins.forEach(async (plugin) => {
        const getPluginObj = require(plugin);
        const cmd: PluginType = getPluginObj.plugin;

        if (matchingPlugin(getCommand, cmd.triggers, botConfig.prefix)) {
          if (cmd.isVoiceChat) {
            ctx.simulate(Simulate.RECORDING);
            return await cmd.code(ctx, getMessage);
          } else {
            ctx.simulate(Simulate.TYPING);
            return await cmd.code(ctx, getMessage);
          }
        }
      });

      const key = {
        remoteJid: ctx.jid,
        id: msg.messages[0].key.id,
        participant: msg.messages[0].key.participant,
      };

      await this.sock.readMessages([key]);
    });
  }
}
