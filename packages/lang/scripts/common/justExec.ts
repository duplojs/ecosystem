export function justExec<
	GenericOutput extends unknown,
>(
	theFunction: () => GenericOutput,
): GenericOutput {
	return theFunction();
}
