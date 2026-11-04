/**
 * @title DPattern.matchWithEntity
 *
 * Router une union d’entités DuploJS vers un callback pour chaque nom d’entité.
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
declare const account: User | Admin;

const label = DPattern.matchWithEntity(account, {
	User: (entity) => {
		const user: User = entity;
		return user.name;
	},
	Admin: (entity) => {
		const admin: Admin = entity;
		return admin.permissions.length;
	},
});
// Le résultat est la valeur retournée par le handler choisi : un nom ou un nombre de permissions.
type _CheckLabel = DCommon.ExpectType<typeof label, string | number, "strict">;
