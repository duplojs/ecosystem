/**
 * @title Assertions.toBeDisabled
 *
 * Vérifier qu’un élément visible est désactivé.
 */
import { Assertions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Assertions.toBeDisabled(searchForm, "submit");
