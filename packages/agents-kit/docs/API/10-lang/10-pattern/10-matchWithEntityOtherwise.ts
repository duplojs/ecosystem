/**
 * @title DPattern.matchWithEntityOtherwise
 *
 * Router les entités sélectionnées et conserver dans le type du fallback les entités restantes.
 */
import * as DPattern from "@duplojs/lang/pattern";
import type * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface User extends DModeling.Entity<"User"> {
	id: string;
	name: string;
}
interface Admin extends DModeling.Entity<"Admin"> {
	id: string;
	permissions: readonly string[];
}
interface Guest extends DModeling.Entity<"Guest"> { id: string }
declare const account: User | Admin | Guest;

const result = DPattern.matchWithEntityOtherwise(
	account,
	{
		User: (entity) => entity.name,
	},
	(entity) => {
		const remaining: Admin | Guest = entity;
		return remaining.id;
	},
);
// User retourne son nom ; Admin et Guest retournent leur id dans le fallback.
type _CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
