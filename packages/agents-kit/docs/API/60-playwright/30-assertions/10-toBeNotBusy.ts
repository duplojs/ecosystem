/**
 * @title Assertions.toBeNotBusy
 *
 * Vérifier aria-busy="false" sur un élément visible.
 */
import { Assertions } from "@duplojs/playwright";
import { articleList } from "../fixtures/component";

// Exige aria-busy="false", et non simplement l’absence de l’attribut.
await Assertions.toBeNotBusy(articleList, "loading");
