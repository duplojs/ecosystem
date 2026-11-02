/**
 * @title Actions.fill
 *
 * Remplacer la valeur d’un champ visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Actions.fill(searchForm, "query", "TypeScript");
