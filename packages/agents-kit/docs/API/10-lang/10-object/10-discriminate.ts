/**
 * @title DObject.discriminate
 *
 * Discriminer une union d’objets à partir d’une propriété.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

type Event =
	| {
		type: "created";
		id: string;
	}
	| {
		type: "deleted";
		id: number;
	};
interface CreatedEvent {
	type: "created";
	id: string;
}

interface DeletedEvent {
	type: "deleted";
	id: number;
}

declare const event: Event;

if (DObject.discriminate(event, "type", "created")) {
	type _CheckIfEvent = DCommon.ExpectType<typeof event, CreatedEvent, "strict">;
	const id = event.id;
	type _CheckIfId = DCommon.ExpectType<typeof id, string, "strict">;
}

const result = DObject.discriminate(event, "type", "created");

// Le predicate retourne true pour l’événement created.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée est passée directement comme predicate à DCommon.when.
const id = DCommon.pipe(
	event,
	DCommon.when(
		DObject.discriminate("type", "created"),
		(createdEvent) => {
			type _CheckPredicatedInput = DCommon.ExpectType<typeof createdEvent, CreatedEvent, "strict">;

			return createdEvent.id;
		},
	),
);

// L’identifiant est une chaîne pour created ; sinon l’événement initial est conservé.
type _CheckId = DCommon.ExpectType<typeof id, string | DeletedEvent, "strict">;
