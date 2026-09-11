import { execSync } from "child_process";

process.chdir(import.meta.dirname);

it("node test", () => {
	execSync("node --test node/*.ts", { stdio: ["ignore", "ignore", "inherit"] });
});
