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
type AdminEvent = Extract<Event, { profile: { role: "admin" } }>;
type MemberEvent = Extract<Event, { profile: { role: "member" } }>;

declare const event: Event;

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
