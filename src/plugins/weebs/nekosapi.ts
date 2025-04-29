import { LogType, printLog } from "../../lib/print_log";
import { PluginType } from "../../types/plugin_type";
import NodeCache from "node-cache";

interface NekosApi {
  id: number;
  url: string;
  rating: string;
  color_dominant: number[];
  color_palette: number[];
  artist_name: string;
  tags: string[];
  source_url: string;
}

const nekoCache = new NodeCache({ stdTTL: 300 });

export const plugin: PluginType = {
  name: "NekosAPI",
  triggers: ["neko"],
  code: async (ctx) => {
    const jid = ctx.jid ?? "";

    let cache = nekoCache.get<NekosApi[]>(jid);

    if (!cache || cache.length === 0) {
      try {
        const response = await fetch(
          "https://api.nekosapi.com/v4/images/random"
        );
        const data: NekosApi[] = await response.json();

        nekoCache.set(jid, data);
        cache = data;
      } catch (e) {
        printLog(`Error: ${e}`, LogType.ERROR);
        return ctx.reply("Gagal mengambil data dari API.");
      }
    }

    const getCache = cache.shift();
    if (!getCache) {
      return ctx.reply("Gak ada gambar lagi. Coba panggil ulang perintahnya!");
    }

    nekoCache.set(jid, cache);
    return ctx.reply({
      image: { url: getCache.url ?? "" },
      caption: `*Id*: ${getCache.id}\n*Rating*: ${getCache.rating}\n*Artist*: ${
        getCache.artist_name ?? "Gak tau"
      }\n*Tags*: ${getCache.tags
        .join(", ")
        .replace(/_/g, " ")
        .trim()}\n*Url*: ${getCache.url}\n*Source*: ${
        getCache.source_url ?? "Gak tau"
      }`,
    });
  },
};
