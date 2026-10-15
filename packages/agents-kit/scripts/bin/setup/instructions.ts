import * as DString from "@duplojs/lang/string";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";

const startMarker = "<!-- duplojs-agents-kit:coding-conventions:start -->";
const stopMarker = "<!-- duplojs-agents-kit:coding-conventions:stop -->";

export class InvalidInstructionsMarkersError extends DCommon.DuploJSError.parentClass("agents-kit-invalid-instructions-markers") {}

export function synchronizeInstructions(
	content: string,
	instructions: string,
	packagePath: string & DPath.Path,
) {
	const resolvedInstructions = DString.replaceAll(instructions, "{{packagePath}}", () => packagePath);
	const block = `${startMarker}\n${resolvedInstructions}\n${stopMarker}`;
	const start = DString.indexOf(content, startMarker);
	const stop = DString.indexOf(content, stopMarker);

	if (start === undefined && stop === undefined) {
		const separator = DCommon.justExec(() => {
			if (content === "" || DString.endsWith(content, "\n\n")) {
				return "";
			} else if (DString.endsWith(content, "\n")) {
				return "\n";
			}

			return "\n\n";
		});

		return DEither.success(`${content}${separator}${block}\n`);
	}

	if (
		start === undefined
		|| stop === undefined
		|| stop < start
		|| DString.indexOf(content, startMarker, start + DString.length(startMarker)) !== undefined
		|| DString.indexOf(content, stopMarker, stop + DString.length(stopMarker)) !== undefined
	) {
		return DEither.left(
			"agents-kit-invalid-instructions-markers",
			new InvalidInstructionsMarkersError("The AgentKit coding conventions block has invalid markers."),
		);
	}

	const before = DString.slice(content, 0, start);
	const after = DString.slice(content, stop + DString.length(stopMarker), DString.length(content));

	return DEither.success(`${before}${block}${after}`);
}
