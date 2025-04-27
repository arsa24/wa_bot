import { WASocket } from "baileys";
import { Utils } from "../lib/utils";
import {readPlugins} from "../rust/index";

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

      const key = {
        remoteJid: ctx.jid,
        id: msg.messages[0].key.id,
        participant: msg.messages[0].key.participant,
      };

      await this.sock.readMessages([key]);
    });
  }
}
