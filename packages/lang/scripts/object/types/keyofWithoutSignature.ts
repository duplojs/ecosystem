export type keyofWithoutSignature<
	GenericValue extends object,
> = keyof {
	[
	Prop in keyof GenericValue as
	string extends Prop
		? never
		: number extends Prop
			? never
			: symbol extends Prop
				? never
				: Prop
	]: GenericValue[Prop];
};
