/**
 * @title useRepeatLayout
 *
 * Répéter un champ avec une cardinalité minimale et maximale.
 */
import { useRepeatLayout, type GetFormFieldValue } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";

const contacts = useRepeatLayout(
	useTextInput({ label: "Contact" }),
	{
		min: 1,
		max: 3,
	},
);

// Le minimum littéral garantit un premier élément ; max borne les actions au runtime.
type _Contacts = DCommon.ExpectType<
	GetFormFieldValue<typeof contacts>,
	[string, ...string[]],
	"strict"
>;

const optionalContacts = useRepeatLayout(
	useTextInput(),
	{ max: 3 },
);

type _Optional = DCommon.ExpectType<
	GetFormFieldValue<typeof optionalContacts>,
	string[],
	"strict"
>;
