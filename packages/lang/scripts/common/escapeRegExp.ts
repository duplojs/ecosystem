export function escapeRegExp<
	GenericInput extends string,
>(input: GenericInput): string;

export function escapeRegExp(input: string) {
	return input.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
