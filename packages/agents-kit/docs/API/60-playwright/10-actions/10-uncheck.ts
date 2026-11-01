/**
 * @title Actions.uncheck
 *
 * Décocher un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Actions.uncheck(searchForm, "onlyPublished");
