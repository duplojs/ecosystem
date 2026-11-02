/**
 * @title Assertions.toHaveAttribute
 *
 * Vérifier un attribut d’un élément visible.
 */
import { Assertions } from "@duplojs/playwright";
import { navigation } from "../fixtures/component";

await Assertions.toHaveAttribute(navigation, "menuButton", "aria-expanded", "true");

// Sans valeur, l’attribut doit correspondre à /.+/ : une valeur vide ne suffit pas.
await Assertions.toHaveAttribute(navigation, "menuButton", "aria-controls");
