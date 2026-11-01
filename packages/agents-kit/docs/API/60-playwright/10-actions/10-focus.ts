/**
 * @title Actions.focus
 *
 * Donner le focus à un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Actions.focus(searchForm, "query");
