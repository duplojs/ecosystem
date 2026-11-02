/**
 * @title Actions.extractContent
 *
 * Extraire le contenu textuel d’un élément visible.
 */
import { Actions } from "@duplojs/playwright";
import { articleList } from "../fixtures/component";

// Le résultat runtime est le texte du titre, ou null si son contenu textuel est absent.
const title = await Actions.extractContent(articleList, "title");
