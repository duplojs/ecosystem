/**
 * @title Assertions.toBeChecked
 *
 * Vérifier qu’un élément visible est coché.
 */
import { Assertions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Assertions.toBeChecked(searchForm, "onlyPublished");
