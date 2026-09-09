export function pipeCall<
	GenericInput extends unknown,
	GenericOutput extends unknown,
>(
	callback: (input: NoInfer<GenericInput>) => GenericOutput,
): (input: GenericInput) => NoInfer<GenericOutput>;

export function pipeCall<
	GenericInput extends unknown,
	GenericOutput extends unknown,
>(
	callback: (input: NoInfer<GenericInput>) => GenericOutput,
): (input: GenericInput) => NoInfer<GenericOutput> {
	return (input) => callback(input);
}
