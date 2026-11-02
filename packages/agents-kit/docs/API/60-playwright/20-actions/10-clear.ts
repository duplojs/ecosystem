/**
 * @title Actions.clear
 *
 * Effacer un champ visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Actions.clear(searchForm, "query");
