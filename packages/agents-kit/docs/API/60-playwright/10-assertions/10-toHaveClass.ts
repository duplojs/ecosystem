/**
 * @title Assertions.toHaveClass
 *
 * Vérifier les classes d’un élément visible.
 */
import { Assertions } from "@duplojs/playwright";
import { navigation } from "../fixtures/component";

await Assertions.toHaveClass(navigation, "menuButton", /active/);
