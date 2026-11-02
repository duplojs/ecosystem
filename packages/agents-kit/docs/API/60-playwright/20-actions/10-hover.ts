/**
 * @title Actions.hover
 *
 * Survoler un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { navigation } from "../fixtures/component";

await Actions.hover(navigation, "menuButton");
