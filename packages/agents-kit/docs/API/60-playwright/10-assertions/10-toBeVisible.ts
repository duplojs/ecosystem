/**
 * @title Assertions.toBeVisible
 *
 * Faire défiler jusqu’à l’élément puis vérifier sa visibilité.
 */
import { Assertions } from "@duplojs/playwright";
import { navigation } from "../fixtures/component";

// L’élément est d’abord défilé dans la vue, puis sa visibilité est vérifiée.
await Assertions.toBeVisible(navigation, "menu");
