"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const light = fs_extra_1.default.readJsonSync("./src/default.tokens.json");
const dark = fs_extra_1.default.readJsonSync("./src/darker.tokens.json");
function normalize(data) {
    const result = {};
    for (const group of Object.keys(data)) {
        if (group.startsWith("$"))
            continue;
        const name = group
            .replace(/\s*\(.*\)/, "")
            .toLowerCase()
            .replace(/\s/g, "");
        result[name] = {};
        for (const key of Object.keys(data[group])) {
            const value = data[group][key];
            const hex = value?.$value?.hex;
            const match = key.match(/-(\d+)/);
            if (!match)
                continue;
            result[name][match[1]] = hex;
        }
    }
    return result;
}
const lightTokens = normalize(light);
const darkTokens = normalize(dark);
/* -----------------------------
   1. JS OUTPUT (MFEs)
------------------------------*/
fs_extra_1.default.outputFileSync("./src/tokens.ts", `export const light = ${JSON.stringify(lightTokens, null, 2)} as const;
export const dark = ${JSON.stringify(darkTokens, null, 2)} as const;
`);
/* -----------------------------
   2. SCSS OUTPUT (Tutor LMS)
------------------------------*/
let scss = "";
scss += "/* LIGHT THEME */\n";
for (const g of Object.keys(lightTokens)) {
    for (const k of Object.keys(lightTokens[g])) {
        scss += `$${g}-${k}: ${lightTokens[g][k]};\n`;
    }
}
scss += "\n/* DARK THEME */\n";
for (const g of Object.keys(darkTokens)) {
    for (const k of Object.keys(darkTokens[g])) {
        scss += `$dark-${g}-${k}: ${darkTokens[g][k]};\n`;
    }
}
fs_extra_1.default.outputFileSync("./dist/_tokens.scss", scss);
/* -----------------------------
   3. CSS VARIABLES (MFEs runtime)
------------------------------*/
let css = ":root {\n";
for (const g of Object.keys(lightTokens)) {
    for (const k of Object.keys(lightTokens[g])) {
        css += `  --${g}-${k}: ${lightTokens[g][k]};\n`;
    }
}
css += "}\n\n[data-theme='dark'] {\n";
for (const g of Object.keys(darkTokens)) {
    for (const k of Object.keys(darkTokens[g])) {
        css += `  --${g}-${k}: ${darkTokens[g][k]};\n`;
    }
}
css += "}\n";
fs_extra_1.default.outputFileSync("./dist/tokens.css", css);
console.log("✅ Design tokens generated successfully");
