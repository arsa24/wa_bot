import {LogType, printLog} from "../lib/print_log";
import { makeWASocket, useMultiFileAuthState, DisconnectReason, WASocket } from "baileys";
import Pino from "pino";
import { Boom } from "@hapi/boom";
const QRCode = require("qrcode");

let sock: WASocket;

const connect = async (): Promise<void> => {
  const { state, saveCreds } = await useMultiFileAuthState("state");
  sock = makeWASocket({
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
      connect();
    }

    if (qr) {
      console.log(await QRCode.toString(qr, { type: "terminal" }));
    }

    if (connection == "open"){
        printLog("Bot connected.", LogType.INFO);
    }
  });
};

export {connect, sock}