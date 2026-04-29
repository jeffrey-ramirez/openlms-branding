import fs from "fs-extra";

function toCSSVars(tokens: Record<string, string>) {
  let css = ":root {\n";
  for (const [k, v] of Object.entries(tokens)) {
    css += `  --${k.replace(/\./g, "-")}: ${v};\n`;
  }
  css += "}\n";
  return css;
}

function toDark(tokens: Record<string, string>) {
  let css = `[data-theme="darker"] {\n`;
  for (const [k, v] of Object.entries(tokens)) {
    css += `  --${k.replace(/\./g, "-")}: ${v};\n`;
  }
  css += "}\n";
  return css;
}

function utilities(tokens: Record<string, string>) {
  let css = "";

  for (const key of Object.keys(tokens)) {
    const cssVar = `var(--${key.replace(/\./g, "-")})`;

    // base utilities
    css += `.bg-${key.replace(/\./g, "-")} { background-color: ${cssVar}; }\n`;
    css += `.text-${key.replace(/\./g, "-")} { color: ${cssVar}; }\n`;
    css += `.border-${key.replace(/\./g, "-")} { border-color: ${cssVar}; }\n`;

    // hover
    css += `.hover\\:bg-${key.replace(/\./g, "-")}:hover { background-color: ${cssVar}; }\n`;

    // focus
    css += `.focus\\:bg-${key.replace(/\./g, "-")}:focus { background-color: ${cssVar}; }\n`;

    // dark variant
    css += `.dark .bg-${key.replace(/\./g, "-")} { background-color: ${cssVar}; }\n`;
  }

  return css;
}

// spacing scale (Tailwind-like)
function spacing() {
  const scale = [0, 1, 2, 4, 6, 8, 10, 12, 16];

  let css = "";

  for (const v of scale) {
    css += `.p-${v} { padding: ${v * 0.25}rem; }\n`;
    css += `.m-${v} { margin: ${v * 0.25}rem; }\n`;
  }

  return css;
}

// opacity utilities (/50, /80 etc.)
function opacity(tokens: Record<string, string>) {
  let css = "";

  for (const key of Object.keys(tokens)) {
    const base = key.replace(/\./g, "-");

    css += `.bg-${base}\\/50 { opacity: 0.5; background-color: var(--${base}); }\n`;
    css += `.bg-${base}\\/80 { opacity: 0.8; background-color: var(--${base}); }\n`;
  }

  return css;
}

async function build() {
  const { light, dark } = await fs.readJSON("tokens/normalized.json");

  const css =
`
/* =========================
   CSS VARIABLES
========================= */
${toCSSVars(light)}
${toDark(dark)}

/* =========================
   UTILITIES
========================= */
${utilities(light)}

/* =========================
   SPACING SCALE
========================= */
${spacing()}

/* =========================
   OPACITY VARIANTS
========================= */
${opacity(light)}
`;

  await fs.outputFile("dist/tokens.css", css);

  console.log("🚀 FULL Tailwind engine built for MFE");
}

build();