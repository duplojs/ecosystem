import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export function assertTypeScriptProject(tsconfigPath: DPath.AnyPath) {
	const workDirectory = DSCommon.getCurrentWorkDirectoryOrThrow();
	const resolvedTsconfigPath = DPath.resolveRelative([workDirectory, tsconfigPath]);
	const command = spawnSync(process.execPath, [fileURLToPath(new URL("./bin/tsc", import.meta.resolve("@typescript/native/package.json"))), "--project", resolvedTsconfigPath, "--noEmit"], {
		cwd: workDirectory,
		encoding: "utf8",
		timeout: 30_000,
	});

	if (command.error) {
		throw command.error;
	}

	if (command.status !== 0) {
		throw new Error(`${command.stdout}\n${command.stderr}`);
	}
}
