// Wraps `shadcn add`: the CLI rewrites `cn` imports to the third-party "cn" package,
// so we point them back to our own helper after every add.
// Usage: npm run ui:add -- button dialog
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const components = process.argv.slice(2);
if (components.length) {
  execSync(`npx shadcn@latest add ${components.join(" ")} -y`, { stdio: "inherit" });
}

const targets = ["src/shared/ui", "src/shared/hooks"];
const pattern = /from\s+["']cn["']/g;
let fixed = 0;

for (const dir of targets) {
  for (const file of readdirSync(dir).filter((name) => /\.tsx?$/.test(name))) {
    const path = join(dir, file);
    const source = readFileSync(path, "utf8");
    const updated = source.replace(pattern, 'from "@/shared/lib/utils"');
    if (updated === source) continue;
    writeFileSync(path, updated);
    fixed++;
  }
}

console.log(`ui:add — fixed cn imports in ${fixed} file(s)`);
