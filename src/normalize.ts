import fs from "fs-extra";

function normalizeGroup(group: string) {
  return group
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function normalizeToken(group: string, token: string) {
  const g = normalizeGroup(group);

  // Blue-900 → blue-900
  return token.toLowerCase().replace(/\s+/g, "-");
}

function flatten(json: any) {
  const output: Record<string, string> = {};

  for (const group of Object.keys(json)) {
    if (group.startsWith("$")) continue;

    for (const token of Object.keys(json[group])) {
      const key = normalizeToken(group, token);
      output[key] = json[group][token].$value.hex;
    }
  }

  return output;
}

export async function runNormalize() {
  const defaultTokens = await fs.readJSON("tokens/default.tokens.json");
  const darkTokens = await fs.readJSON("tokens/darker.tokens.json");

  const normalized = {
    default: flatten(defaultTokens),
    dark: flatten(darkTokens),
  };

  await fs.outputJSON("tokens/normalized.json", normalized, { spaces: 2 });

  console.log("✅ normalized.json created");
}