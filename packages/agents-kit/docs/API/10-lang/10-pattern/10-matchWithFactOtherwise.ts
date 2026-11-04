/**
 * @title DPattern.matchWithFactOtherwise
 *
 * Router les facts choisis et traiter les autres noms avec un callback recevant le fact restant.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface Created extends DModeling.Fact<"Created", { title: string }> {}
interface Deleted extends DModeling.Fact<"Deleted", { reason: string }> {}
interface Renamed extends DModeling.Fact<"Renamed", { title: string }> {}
declare const event: Created | Deleted | Renamed;

const description = DPattern.matchWithFactOtherwise(
	event,
	{
		Created: (_value, payload) => payload.title,
	},
	(value) => {
		const remaining: Deleted | Renamed = value;
		return remaining;
	},
);
// Created retourne son titre ; les autres facts restent des valeurs complètes dans le résultat.
type _CheckDescription = DCommon.ExpectType<typeof description, string | Deleted | Renamed, "strict">;
