/**
 * @title Actions.selectOption
 *
 * Sélectionner des options et retourner leurs valeurs.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

// Le select autorise plusieurs valeurs ; au runtime, le résultat contient les valeurs sélectionnées.
const selected = await Actions.selectOption(searchForm, "categories", ["typescript", "testing"]);
