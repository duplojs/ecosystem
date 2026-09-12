import { execSync } from "child_process";

process.chdir(import.meta.dirname);

it(
	"deno test",
	{ timeout: 0 },
	() => {
		execSync("pnpm exec deno test -P -c deno/deno.json deno/*.test.ts", { stdio: ["ignore", "ignore", "inherit"] });
	},
);
