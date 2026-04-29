import fs from "fs-extra";

function group(g: string) {
  return g.toLowerCase().replace(/\(.*?\)/g, "").trim().replace(/\s+/g, "-");
}

function key(g: string, t: string) {
  const base = group(g);
  const scale = t.match(/(\d+)/)?.[1];
  return scale ? `${base}.${scale}` : base;
}

function flatten(json: any) {
  const out: Record<string, string> = {};

  for (const g of Object.keys(json)) {
    if (g === "$extensions") continue;

    for (const t of Object.keys(json[g])) {
      out[key(g, t)] = json[g][t].$value.hex;
    }
  }

  return out;
}

async function run() {
  const light = await fs.readJSON("tokens/default.tokens.json");
  const dark = await fs.readJSON("tokens/darker.tokens.json");

  await fs.outputJSON("tokens/normalized.json", {
    light: flatten(light),
    dark: flatten(dark),
  });

  console.log("✅ normalized tokens ready");
}

run();