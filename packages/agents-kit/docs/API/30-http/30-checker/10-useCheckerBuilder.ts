/**
 * @title useCheckerBuilder
 *
 * Définir une vérification réutilisable et ses résultats nommés.
 */
import { useCheckerBuilder, type CheckerFunctionOutput, type GetCheckerResult } from "@duplojs/http";
import type * as DCommon from "@duplojs/lang/common";

interface User {
	id: string;
	active: boolean;
}

declare function findUser(id: string): Promise<User | undefined>;

// Les options constituent la configuration par défaut et définissent leur type.
// Sans options, le handler reçoit undefined. Son entrée est typée séparément.
export const userChecker = useCheckerBuilder({ options: { allowInactive: false } })
	.handler(
		async(id: string, { options, output }) => {
			const user = await findUser(id);

			if (!user) {
				return output("user.missing", { id });
			}

			if (!user.active && !options.allowInactive) {
				return output("user.inactive", user);
			}

			return output("user.found", user);
		},
	);

// Chaque information littérale reste associée au type de sa valeur, même
// pour un handler asynchrone. output construit un résultat, pas une réponse HTTP.
type _Result = DCommon.ExpectType<
	Awaited<GetCheckerResult<typeof userChecker>>,
	| CheckerFunctionOutput<"user.missing", { id: string }>
	| CheckerFunctionOutput<"user.inactive", User>
	| CheckerFunctionOutput<"user.found", User>,
	"strict"
>;

// Le flux choisit ensuite quelles informations autorisent la suite et comment
// répondre aux autres avec check ou un preset.
// Les mêmes checkers peuvent aussi être utilisés dans un process.
