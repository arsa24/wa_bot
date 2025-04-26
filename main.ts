import {LogType, printLog} from "./src/lib/print_log";
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "baileys";
import Pino from "pino";
import { Boom } from "@hapi/boom";
const QRCode = require("qrcode");

const main = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("state");
  const sock = makeWASocket({
    auth: state,
    syncFullHistory: false,
    logger: Pino({ level: "silent" }),
    printQRInTerminal: true,
  });

  printLog("Connecting...", LogType.INFO);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (
      connection === "close" &&
      (lastDisconnect?.error as Boom)?.output?.statusCode ===
        DisconnectReason.restartRequired
    ) {
      main();
    }

    if (qr) {
      console.log(await QRCode.toString(qr, { type: "terminal" }));
    }

    if (connection == "open"){
        printLog("Bot connected.", LogType.INFO);
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    if (msg.messages[0].message?.conversation == ".ping") {
      msg.messages[0].key.remoteJid
        ? await sock.sendMessage(msg.messages[0].key.remoteJid, { text: "Pong" })
        : null;
    }
  });
};

main();