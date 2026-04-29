import fs from "fs-extra";
import { buildCSS } from "./build-css";
import { buildUtilities } from "./build-utilities";

async function run() {
  await buildCSS();

  const data = await fs.readJSON("tokens/normalized.json");

  const utilities = buildUtilities(data.default);

  await fs.outputFile("dist/utilities.css", utilities);

  console.log("✅ Tailwind engine built");
}

run();