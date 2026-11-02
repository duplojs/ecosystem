/**
 * @title Actions.press
 *
 * Appuyer sur une touche dans un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

await Actions.press(searchForm, "query", "Enter");
