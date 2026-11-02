/**
 * @title Assertions.withStep
 *
 * Ajouter une étape Playwright nommée autour d’une interaction.
 */
import { Assertions } from "@duplojs/playwright";
import { searchForm } from "../fixtures/component";

// Cette étape englobe celle produite par l’assertion dans le rapport Playwright.
await Assertions.withStep("Vérifier la recherche").toBeEnabled(searchForm, "submit");
