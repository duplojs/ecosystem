/**
 * @title Assertions.toBeEnabled
 *
 * Vérifier qu’un élément visible est activé.
 */
import { Assertions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Assertions.toBeEnabled(searchForm, "submit");
