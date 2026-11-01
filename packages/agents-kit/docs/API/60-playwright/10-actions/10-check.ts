/**
 * @title Actions.check
 *
 * Cocher un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Actions.check(searchForm, "onlyPublished");
