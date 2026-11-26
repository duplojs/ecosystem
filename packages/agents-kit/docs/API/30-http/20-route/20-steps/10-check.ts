/**
 * @title RouteBuilder.check et RouteBuilder.presetCheck
 *
 * Intégrer une vérification réutilisable au flux d'une route.
 */
import { createPresetChecker, useCheckerBuilder, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Le checker est partagé ; la route choisit son entrée et interprète son résultat.
const checker = useCheckerBuilder()
	.handler(
		(token: string, { output }) => token === "valid"
			? output("accepted", { role: "member" })
			: output("rejected", null),
	);

useRouteBuilder("GET", "/profile")
	.extract({
		headers: {
			authorization: DDataStructure.string(),
		},
	})
	.check(
		checker,
		{
			input: ({ authorization }) => authorization,
			result: "accepted",
			indexing: "identity",
			otherwise: ({ response }) => response.unauthorized("token.invalid"),
		},
	)
	.handler(
		({ identity }, { response }) => response.ok("profile.allowed", identity),
	);

// Un preset réutilise une interprétation ; sa valeur acceptée est ici ajoutée
// sous identity. Une réponse de refus interrompt la route.
const preset = createPresetChecker(checker, {
	result: "accepted",
	otherwise: ({ response }) => response.unauthorized("token.invalid"),
});

useRouteBuilder("GET", "/account")
	.extract({
		headers: {
			authorization: DDataStructure.string(),
		},
	})
	.presetCheck(
		preset.indexing("identity"),
		({ authorization }) => authorization,
	)
	.handler(
		({ identity }, { response }) => response.ok("account.allowed", identity),
	);
