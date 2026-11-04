/**
 * @title DObject.deepDiscriminate
 *
 * Discriminer une union d’objets à partir d’une propriété imbriquée.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

type Event =
	| {
		profile: {
			role: "admin";
			name: string;
		};
	}
	| {
		profile: {
			role: "member";
			name: string;
		};
	};
interface AdminEvent {
	profile: {
		role: "admin";
		name: string;
	};
}

interface MemberEvent {
	profile: {
		role: "member";
		name: string;
	};
}

declare const event: Event;

if (DObject.deepDiscriminate(event, "profile.role", "admin")) {
	type _CheckIfEvent = DCommon.ExpectType<typeof event, AdminEvent, "strict">;
	const name = DObject.getDeepProperty(event, "profile.name");
	type _CheckIfName = DCommon.ExpectType<typeof name, string, "strict">;
}

const result = DObject.deepDiscriminate(event, "profile.role", "admin");

// Le predicate retourne true uniquement pour l’événement administrateur.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée est passée directement comme predicate à DCommon.when.
const name = DCommon.pipe(
	event,
	DCommon.when(
		DObject.deepDiscriminate("profile.role", "admin"),
		(adminEvent) => {
			type _CheckPredicatedInput = DCommon.ExpectType<typeof adminEvent, AdminEvent, "strict">;

			return DObject.getDeepProperty(adminEvent, "profile.name");
		},
	),
);

// Le nom est lu pour l’administrateur ; sinon l’événement initial est conservé.
type _CheckName = DCommon.ExpectType<typeof name, string | MemberEvent, "strict">;
