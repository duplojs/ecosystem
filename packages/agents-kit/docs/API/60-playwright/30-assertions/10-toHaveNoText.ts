/**
 * @title Assertions.toHaveNoText
 *
 * Vérifier que le texte d’un élément visible est vide.
 */
import { Assertions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

// Le message visible doit avoir un texte vide.
await Assertions.toHaveNoText(searchForm, "feedback");
