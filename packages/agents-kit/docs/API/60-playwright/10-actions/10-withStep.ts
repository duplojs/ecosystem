/**
 * @title Actions.withStep
 *
 * Ajouter une étape Playwright nommée autour d’une interaction.
 */
import { Actions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

// Cette étape englobe celle produite par click dans le rapport Playwright.
await Actions.withStep("Lancer la recherche").click(searchForm, "submit");
