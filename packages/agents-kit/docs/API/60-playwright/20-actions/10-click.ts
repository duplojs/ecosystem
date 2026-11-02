/**
 * @title Actions.click
 *
 * Cliquer sur un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Actions.click(searchForm, "submit");
