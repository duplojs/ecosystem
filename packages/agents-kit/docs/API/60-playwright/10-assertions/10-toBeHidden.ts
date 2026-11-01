/**
 * @title Assertions.toBeHidden
 *
 * Vérifier que l’élément est caché.
 */
import { Assertions } from "@duplojs/playwright";
import { navigation } from "../fixtures/component";

await Assertions.toBeHidden(navigation, "menu");
