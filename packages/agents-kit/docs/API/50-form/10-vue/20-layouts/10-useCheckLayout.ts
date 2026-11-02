/**
 * @title useCheckLayout
 *
 * Ajouter une validation à un champ ou à une composition de champs.
 */
import { useCheckLayout, type GetFormFieldCheckedValue, type GetFormFieldValue } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";
import * as DEither from "@duplojs/lang/either";

const email = useCheckLayout(
	useTextInput({ label: "Email" }),
	{
		dataStructure: DDataStructure.string([DDataStructure.email()]),
	},
);

type _Raw = DCommon.ExpectType<
	GetFormFieldValue<typeof email>,
	string,
	"strict"
>;
type _Checked = DCommon.ExpectType<
	GetFormFieldCheckedValue<typeof email>,
	string & DString.Email,
	"strict"
>;

// refine reçoit la valeur déjà vérifiée par le champ et produit un message en cas de refus.
const username = useCheckLayout(
	useTextInput({ label: "Username" }),
	{
		refine: (value) => value === "admin"
			? DEither.error("Reserved name")
			: DEither.ok(),
	},
);
void username;
