import "./override";
import type { DummyRuleMap } from "oxlint";

type RemoveIndexSignature<
	GenericObject extends object,
> = {
	[GenericKey in keyof GenericObject as (
		string extends GenericKey
			? never
			: number extends GenericKey
				? never
				: symbol extends GenericKey
					? never
					: GenericKey
	)]: GenericObject[GenericKey];
};

type StrictRuleMap = RemoveIndexSignature<DummyRuleMap>;

export function defineRules<
	const GenericRules extends StrictRuleMap,
>(
	rules: GenericRules & Record<
		Exclude<keyof GenericRules, keyof StrictRuleMap>,
		never
	>,
): GenericRules {
	return rules;
}
