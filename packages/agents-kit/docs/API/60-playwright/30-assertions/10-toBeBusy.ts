/**
 * @title Assertions.toBeBusy
 *
 * Vérifier aria-busy="true" sur un élément visible.
 */
import { Assertions } from "@duplojs/playwright";
import { articleList } from "../fixtures/component";

// Exige aria-busy="true" sur cet élément visible.
await Assertions.toBeBusy(articleList, "loading");
