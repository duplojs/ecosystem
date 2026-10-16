/**
 * @title DCommon.createFormData
 *
 * Transformer un objet de valeurs en `FormData` en conservant ses valeurs d’entrée typées.
 */
import * as DCommon from "@duplojs/lang/common";

const values = { name: "Ada" };
const result = DCommon.createFormData(values);

// La FormData conserve l’objet d’entrée dans inputValues.
type _CheckResult = DCommon.ExpectType<
	typeof result,
	DCommon.TheFormData<typeof values>,
	"strict"
>;
