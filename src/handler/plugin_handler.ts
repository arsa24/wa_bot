import { WASocket } from "baileys";
import { Utils } from "../lib/utils";
import { matchingPlugin, readPlugins } from "../rust/index";
import { PluginType } from "../types/plugin_type";
import { Simulate } from "../types/simulate_type";
import { botConfig } from "../config/bot_config";
import { LogType, printLog } from "../lib/print_log";

export class PluginHandler {
  path: string;
  sock: WASocket;

  constructor(path: string, sock: WASocket) {
    this.path = path;
    this.sock = sock;
  }

  async load(): Promise<void> {
    this.sock.ev.on("messages.upsert", async (msg) => {
      try {
        const ctx = new Utils(this.sock, msg);
    
        const plugins = readPlugins(this.path);
        const getMessage = await ctx.getMessages();
        const getCommand = getMessage.split(" ")[0];
    
        for (const pluginPath of plugins) {
          try {
            const pluginModule = require(pluginPath);
            const cmd: PluginType =
              pluginModule.default || pluginModule.plugin || pluginModule;
            if (!cmd?.triggers || !Array.isArray(cmd.triggers)) continue;
    
            const isMatch = matchingPlugin(
              getCommand,
              cmd.triggers,
              botConfig.prefix
            );
            if (!isMatch) continue;
    
            ctx.simulate(
              cmd.isVoiceChat ? Simulate.RECORDING : Simulate.TYPING
            );
            await cmd.code(ctx, getMessage);
            break;
          } catch (error) {
            printLog(`Plugin error in: ${pluginPath}\n${error}`, LogType.ERROR);
          }
        }
    
        const key = {
          remoteJid: ctx.jid,
          id: msg.messages[0].key.id,
          participant: msg.messages[0].key.participant,
        };
    
        await this.sock.readMessages([key]);
      } catch (e) {
        printLog(`Handler error:\n${e}`, LogType.ERROR);
      }
    });    
  }
}
