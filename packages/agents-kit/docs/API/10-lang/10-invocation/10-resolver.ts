/**
 * @title DInvocation — Resolvers
 *
 * Exiger l'exécution d'actions avant de récupérer une valeur.
 */
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";

interface Order {
	id: string;
}
type Actions = Record<"notify", DInvocation.SignedFunction<"notify", (order: Order) => void>>;

declare const order: Order;
const resolver = DInvocation.createResolver(order)<Actions>();
const notify: Actions["notify"] = DInvocation.signedFunction<"notify", (value: Order) => void>("notify", (value) => {
	// L'implémentation de l'action utilise la commande.
	useOrderId(value.id);
});
declare function useOrderId(id: string): void;

// resolve exécute les actions requises puis retourne la valeur dans un Right.
const resolved = resolver.resolve({ notify });
type _CheckResolved = DCommon.ExpectType<
	typeof resolved,
	Promise<DEither.Right<"resolve-success", Order>>,
	"strict"
>;

// runAndResolve exécute une action initiale avant les actions requises.
// Au premier Left, l'exécution s'arrête et le gestionnaire produit resolve-error.
declare function validate(order: Order): DEither.Right<"valid"> | DEither.Left<"invalid">;
const validated = resolver.runAndResolve(
	validate,
	{ notify },
	(error) => error,
);
type _CheckValidated = DCommon.ExpectType<
	typeof validated,
	Promise<
		| DEither.Right<"resolve-success", Order>
		| DEither.Left<"resolve-error", DEither.Left<"invalid">>
	>,
	"strict"
>;

// Un tuple de noms suffit si les actions n'ont pas besoin d'un contrat plus précis.
const namedResolver = DInvocation.createResolver(order)<["notify"]>();
const namedResult = namedResolver.resolve({ notify });
type _CheckNamedResult = DCommon.ExpectType<
	typeof namedResult,
	Promise<DEither.Right<"resolve-success", Order>>,
	"strict"
>;
