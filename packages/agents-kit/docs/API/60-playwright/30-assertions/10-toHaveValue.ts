/**
 * @title Assertions.toHaveValue
 *
 * Vérifier la valeur d’un élément visible.
 */
import { Assertions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Assertions.toHaveValue(searchForm, "query", "TypeScript");
