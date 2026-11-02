/**
 * @title DObject.hasKeys
 *
 * Vérifier la présence de propriétés définies et affiner leur caractère obligatoire.
 */
import * as DObject from "@duplojs/lang/object";
import * as DCommon from "@duplojs/lang/common";

declare const source: {
	name?: string;
	version?: number;
};
interface CompleteSource {
	name: string;
	version: number;
}

const result = DObject.hasKeys(source, ["name", "version"]);

// Le test retourne true lorsque les deux propriétés sont définies.
type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

// La forme curifiée est passée directement comme predicate à DCommon.when.
const name = DCommon.pipe(
	source,
	DCommon.when(
		DObject.hasKeys(["name", "version"]),
		(completeSource) => {
			type _CheckPredicatedInput = DCommon.ExpectType<typeof completeSource, CompleteSource, "strict">;

			return DObject.getProperty(completeSource, "name");
		},
	),
);

// La propriété name est une chaîne lorsque les deux clés sont présentes ; sinon source est conservé.
type _CheckName = DCommon.ExpectType<typeof name, string | typeof source, "strict">;
