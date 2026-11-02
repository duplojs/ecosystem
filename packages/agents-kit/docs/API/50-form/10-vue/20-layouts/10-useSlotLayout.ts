/**
 * @title useSlotLayout
 *
 * Exposer un slot Vue pour personnaliser le rendu ou fournir un champ manuel.
 */
import { useSlotLayout, type GetFormFieldCheckedValue, type GetFormFieldSlots } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";

// Le slot reçoit value, update et formField.
const note = useSlotLayout(
	"note",
	useTextInput({ label: "Note" }),
);

type _Checked = DCommon.ExpectType<
	GetFormFieldCheckedValue<typeof note>,
	string | undefined,
	"strict"
>;
type _SlotName = DCommon.ExpectType<
	keyof GetFormFieldSlots<typeof note>,
	"note",
	"strict"
>;

// Sans champ enveloppé, le slot fournit directement la valeur initiale et update.
const rating = useSlotLayout(
	"rating",
	{ defaultValue: 0 },
);

type _Rating = DCommon.ExpectType<
	GetFormFieldCheckedValue<typeof rating>,
	0,
	"strict"
>;
