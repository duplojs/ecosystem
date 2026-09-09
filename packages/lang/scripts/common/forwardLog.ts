export function forwardLog<
	const GenericInput extends unknown,
>(
	input: GenericInput,
): GenericInput {
	// oxlint-disable-next-line no-console
	console.log(input);

	return input;
}
