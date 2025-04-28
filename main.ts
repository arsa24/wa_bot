import { PluginHandler } from "./src/handler/plugin_handler";
import { connect, sock } from "./src/handler/bot_handler";
import path from "path";

const main = async () => {
  await connect();
  const handler = new PluginHandler(
    path.resolve(__dirname + "/src/plugins"),
    sock
  );

  await handler.load();
};

main();
