/**
 * @title Remplacer les implémentations serveur
 *
 * Contrôle de l'environnement et des fonctions serveur pour isoler les tests.
 */
import * as DEither from "@duplojs/lang/either";
// Ces deux outils sont des exports directs du package, sans sous-export dédié.
// oxlint-disable-next-line duplojs-plugin/no-restricted-import
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommand from "@duplojs/server/command";
import { afterEach, describe, expect, it, vi } from "vitest";

// Pour les fonctions serveur exposées via `implementFunction`, privilégier
// ce mécanisme aux mocks de modules ou d'imports et aux spies sur les exports.
// `setEnvironment("TEST")` sélectionne les implémentations enregistrées avec
// `TESTImplementation.set` ; leur signature est vérifiée par TypeScript.
// Chaque fonction serveur effectivement appelée, même indirectement, doit être
// enregistrée : une implémentation absente lève une erreur, sans repli natif.
describe("command with controlled server dependencies", () => {
	afterEach(() => {
		// Le registre et l'environnement sont partagés. Nettoyer même si le test
		// échoue ; ne pas exécuter ces tests concurremment.
		TESTImplementation.clear();
		// Cette suite Vitest tourne sous Node. Adapter l'environnement rétabli
		// à celui attendu par la suite lorsqu'elle utilise Bun ou Deno.
		setEnvironment("NODE");
	});

	it("reads the injected process arguments", async() => {
		setEnvironment("TEST");

		// `vi.fn` reste utile pour observer les appels de l'implémentation injectée.
		const getProcessArgumentsSpy = vi.fn(() => ["--verbose"]);
		TESTImplementation.set("getProcessArguments", getProcessArgumentsSpy);
		const executeSpy = vi.fn(() => undefined);

		const result = await DSCommand.exec(
			{
				displayName: "tool",
				options: [DSCommand.createBooleanOption("verbose")],
			},
			executeSpy,
		);

		DEither.unwrapByInformationOrThrow(result, "ok");
		expect(getProcessArgumentsSpy).toHaveBeenCalledTimes(1);
		expect(executeSpy).toHaveBeenCalledWith({
			options: { verbose: true },
		});
	});
});

// Les autres dépendances sans ce mécanisme peuvent toujours être observées
// ou remplacées avec les outils de mock habituels du runner de tests.
