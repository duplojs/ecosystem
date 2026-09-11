import { Typescript } from "@scripts/typescript";
import type { BuiltContext } from "./buildContext";
import { createImportDeclaration } from "./importContext";

export function printer(params: BuiltContext): string {
	const sourceFile = Typescript.createSourceFile(
		"print.ts",
		"",
		Typescript.ScriptTarget.Latest,
		false,
		Typescript.ScriptKind.TS,
	);
	const typescriptPrinter = Typescript.createPrinter();

	return [
		...createImportDeclaration(params.importContext),
		...params.context.values(),
	]
		.map(
			(node) => typescriptPrinter.printNode(
				Typescript.EmitHint.Unspecified,
				node,
				sourceFile,
			),
		)
		.join("\n\n")
		.trim();
}
