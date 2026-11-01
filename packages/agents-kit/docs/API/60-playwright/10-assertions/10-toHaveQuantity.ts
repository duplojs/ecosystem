/**
 * @title Assertions.toHaveQuantity
 *
 * Vérifier le nombre d’éléments correspondants.
 */
import { Assertions } from "@duplojs/playwright";
import { articleList } from "../fixtures/component";

// Sans opérateur, ou avec "e", le nombre doit être exact.
await Assertions.toHaveQuantity(articleList, "articles", { quantity: 2 });

// Les bornes sont inclusives ; le comptage est réessayé pendant 5 secondes au plus.
await Assertions.toHaveQuantity(articleList, "articles", {
	quantity: 1,
	operator: "gte",
});
await Assertions.toHaveQuantity(articleList, "articles", {
	quantity: 3,
	operator: "lte",
});
