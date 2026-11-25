/**
 * @title DInvocation — Steps
 *
 * Interrompre un traitement pour déléguer une étape avant de le poursuivre.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DCommon from "@duplojs/lang/common";

// Le traitement transmet une donnée et la fonction qui poursuit son exécution.
function prepareUser(name: string) {
	return DInvocation.createStep(
		{ name },
		(id: string) => ({
			id,
			name,
		}),
	);
}

// La couche appelante obtient l'identifiant avant de reprendre le traitement.
declare function generateId(name: string): Promise<string>;
const step = prepareUser("Alice");
const user = step.run(async({ output, nextFunction }) => {
	const id = await generateId(output.name);
	return nextFunction(id);
});
type _CheckUser = DCommon.ExpectType<
	typeof user,
	Promise<{
		id: string;
		name: string;
	}>,
	"strict"
>;

// run ne lance pas nextFunction automatiquement : la callback décide de l'appeler.
