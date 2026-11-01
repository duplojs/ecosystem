/**
 * @title Actions.type
 *
 * Saisir le texte caractère par caractère dans un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

// Contrairement à fill, la saisie déclenche une séquence de touches pour chaque caractère.
await Actions.type(searchForm, "query", "Ada", { delay: 20 });
