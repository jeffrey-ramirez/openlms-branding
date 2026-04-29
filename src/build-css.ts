import fs from "fs-extra";

function toCssVars(tokens: Record<string, string>) {
  return Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join("\n");
}

export async function buildCSS() {
  const data = await fs.readJSON("tokens/normalized.json");

  const css = `
:root[data-theme="default"] {
${toCssVars(data.default)}
}

:root[data-theme="dark"] {
${toCssVars(data.dark)}
}
`;

  await fs.outputFile("dist/tokens.css", css);
}