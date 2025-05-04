import {
  AnyMessageContent,
  MessageUpsertType,
  MiscMessageGenerationOptions,
  WAMessage,
  WASocket,
} from "baileys";
import { Simulate } from "../types/simulate_type";
import { FilterMessage } from "../types/filter_message_type";
import { PluginType } from "../types/plugin_type";

interface ParsedCommand {
  trigger: string;
  flags: Record<string, string | boolean>;
  args: string[];
}

export class Utils {
  sock: WASocket;
  msg: {
    messages: WAMessage[];
    type: MessageUpsertType;
    requestId?: string;
  };
  jid: string | undefined;

  constructor(
    sock: WASocket,
    msg: {
      messages: WAMessage[];
      type: MessageUpsertType;
      requestId?: string;
    }
  ) {
    this.sock = sock;
    this.msg = msg;
    this.jid = this.msg.messages[0].key.remoteJid ?? undefined;
  }

  async isGroup(): Promise<boolean> {
    return this.msg.messages[0].key.remoteJid?.endsWith("@g.us") || false;
  }

  async reply(
    content: string | AnyMessageContent,
    options: MiscMessageGenerationOptions = {}
  ) {
    if (typeof content == "string") content = { text: content };

    if (this.jid != undefined)
      this.sock.sendMessage(this.jid, content, {
        quoted: this.msg.messages[0],
        ...options,
      });
  }

  async filterMessage(filter: FilterMessage): Promise<string> {
    const message: string = (await this.getMessages()).trim();
    return filter === FilterMessage.ExceptFirst
      ? message.replace(message.split(" ")[0].trim(), "").trim()
      : filter === FilterMessage.LastWord
      ? message.split(" ").slice(-1)[0].trim()
      : message;
  }

  simulate(type: Simulate) {
    this.sock.sendPresenceUpdate(
      type == Simulate.TYPING ? "composing" : "recording",
      this.jid
    );
  }

  async getMessages(): Promise<string> {
    const message = this.msg?.messages[0]?.message;
    if (!message) return "";

    const messageType = Object.keys(message)[0];
    return messageType === "conversation"
      ? message?.conversation ?? ""
      : messageType === "extendedTextMessage"
      ? message.extendedTextMessage?.text ?? ""
      : messageType === "imageMessage"
      ? message.imageMessage?.caption ?? ""
      : messageType === "videoMessage"
      ? message.videoMessage?.caption ?? ""
      : "";
  }

  generateHelp(plugin: PluginType): string {
    const name = plugin.name || "Tanpa Nama";
    const desc = plugin.info?.description || "Tidak ada deskripsi.";
    const usage = plugin.info?.usage || `.${plugin.triggers?.[0]} [opsi]`;
    const flags = plugin.info?.flags || {};

    const flagsText = Object.entries(flags)
      .map(([flag, desc]) => `--${flag} → ${desc}`)
      .join("\n");

    return `
*${name}*
${desc}

📌 *Penggunaan*:
\`\`\`${usage}\`\`\`

🔧 *Flags yang didukung*:
${flagsText || "Tidak ada."}
`.trim();
  }

  async getParseCommand(): Promise<ParsedCommand> {
    const msg = await this.getMessages();

    const [cmd, ...params] = msg.trim().split(/\s+/);
    const flags: Record<string, string | boolean> = {};

    if (!cmd) return { trigger: "", flags: {}, args: [] };

    const args: string[] = [];

    for (let i = 0; i < params.length; i++) {
      const part = params[i];
      if (part.startsWith("--") || part.startsWith("-")) {
        const flag = part.startsWith("--") ? part.slice(2) : part.slice(1);
        const next = params[i + 1];
        if (next && !(next.startsWith("--") || next.startsWith("-"))) {
          flags[flag] = next;
          i++;
        } else {
          flags[flag] = true;
        }
      } else {
        args.push(part);
      }
    }

    return {
      trigger: cmd.slice(1),
      flags,
      args,
    };
  }
}
