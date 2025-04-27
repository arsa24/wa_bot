import { PluginHandler } from "./src/handler/plugin_handler";
import { connect, sock } from "./src/handler/bot_handler";
import path from "path";

import { readPlugins, matchingPlugin, CommandResult } from "./src/rust/index";

const main = async () => {
  //   const handler = new PluginHandler("", sock);

  //   await handler.load();

  console.log(readPlugins(path.resolve(__dirname + "/src/plugins")));

  const allCommandData: Array<[string, Array<string>, Array<string>]> = [
    ["./commands/ping.js", ["ping", "pong"], ["/", "!", "."]],
    ["./commands/info.js", ["info"], ["/", "!"]],
    ["./commands/help.js", ["help", "menu"], ["#", "/", "!"]],
  ];

  console.log(matchingPlugin("/info", allCommandData));
};

main();
