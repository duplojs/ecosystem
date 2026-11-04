/**
 * @title DPattern.matchWithEntity
 *
 * Router une union d’entités DuploJS vers un callback pour chaque nom d’entité.
 */
import * as DPattern from "@duplojs/lang/pattern";
import * as DCommon from "@duplojs/lang/common";
import type * as DModeling from "@duplojs/lang/modeling";

interface User extends DModeling.Entity<"User"> {
	id: string;
	name: string;
}
interface Admin extends DModeling.Entity<"Admin"> {
	id: string;
	permissions: readonly string[];
}
declare const account: User | Admin;

// Appel direct : chaque nom de l’union exige une branche, sans clé étrangère.
const result = DPattern.matchWithEntity(account, {
	User: (entity) => {
		type _CheckValue = DCommon.ExpectType<typeof entity, User, "strict">;
		return entity.name;
	},
	Admin: (entity) => {
		type _CheckValue = DCommon.ExpectType<typeof entity, Admin, "strict">;
		return entity.permissions;
	},
});
// La sortie est le nom utilisateur ou les permissions de l’administrateur.
type _CheckResult = DCommon.ExpectType<typeof result, string | readonly string[], "strict">;

// Appel curifié : configurer les branches directement dans le pipe.
const piped = DCommon.pipe(
	account,
	DPattern.matchWithEntity({
		User: (entity) => {
			type _CheckValue = DCommon.ExpectType<typeof entity, User, "strict">;
			return entity.name;
		},
		Admin: (entity) => {
			type _CheckValue = DCommon.ExpectType<typeof entity, Admin, "strict">;
			return entity.permissions;
		},
	}),
);
// Même sélection : le nom utilisateur ou les permissions de l’administrateur.
type _CheckPiped = DCommon.ExpectType<typeof piped, string | readonly string[], "strict">;
