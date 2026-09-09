import type * as DString from "@scripts/string";
import { create, type Definition, type Handler, type ForbiddenKindNameCharacter } from "./base";

export function createNamespace<
	GenericNamespace extends string,
>(
	namespace: (
		& GenericNamespace
		& DString.ForbiddenContain<
			GenericNamespace,
			ForbiddenKindNameCharacter
		>
	),
) {
	return <
		GenericName extends string,
		GenericKindValue extends unknown = unknown,
	>(
		name: (
			& GenericName
			& DString.ForbiddenContain<
				GenericName,
				ForbiddenKindNameCharacter
			>
		),
	) => {
		const kindHandler = create(`@${namespace}/${name}`);

		return kindHandler as Handler<
			Definition<
				`@${GenericNamespace}/${GenericName}`,
				GenericKindValue
			>
		>;
	};
}
