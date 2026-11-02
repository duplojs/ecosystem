/**
 * @title Assertions.toContainText
 *
 * Vérifier une partie du texte d’un élément visible.
 */
import { Assertions } from "@duplojs/playwright";
import { articleList } from "../fixtures/component";

await Assertions.toContainText(articleList, "title", /TypeScript/);
