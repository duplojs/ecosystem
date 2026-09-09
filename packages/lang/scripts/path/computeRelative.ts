import type { Absolute, Path } from "./constraints";

export function computeRelative<
	GenericSourcePath extends string & Absolute,
	GenericDestinationPath extends string & Absolute,
>(
	source: GenericSourcePath,
	destination: GenericDestinationPath,
): string & Path;

export function computeRelative(
	source: string,
	destination: string,
): string {
	const sourceSegments = source === "/"
		? []
		: source.slice(1).split("/");

	const destinationSegments = destination === "/"
		? []
		: destination.slice(1).split("/");

	let commonIndex = 0;

	while (
		commonIndex < sourceSegments.length
		&& commonIndex < destinationSegments.length
		&& sourceSegments[commonIndex] === destinationSegments[commonIndex]
	) {
		commonIndex++;
	}

	let result = "";

	for (let index = commonIndex; index < sourceSegments.length; index++) {
		result += result
			? "/.."
			: "..";
	}

	for (let index = commonIndex; index < destinationSegments.length; index++) {
		result += result
			? `/${destinationSegments[index]}`
			: destinationSegments[index];
	}

	return result || ".";
}
