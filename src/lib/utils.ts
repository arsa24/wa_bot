import {
  AnyMessageContent,
  MessageUpsertType,
  MiscMessageGenerationOptions,
  WAMessage,
  WASocket,
} from "baileys";
import { Simulate } from "../types/simulate";

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
}
