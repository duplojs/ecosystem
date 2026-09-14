export type HasKeySignature<
	GenericValue extends object,
> = string extends keyof GenericValue
	? true
	: number extends keyof GenericValue
		? true
		: symbol extends keyof GenericValue
			? true
			: false;
