/**
 * @title Actions.forceClick
 *
 * Forcer le clic sans contrôle préalable de visibilité.
 */
import { Actions } from "@duplojs/playwright";
import { navigation } from "../fixtures/component";

// Force le clic Playwright ; aucun contrôle préalable de visibilité n’est effectué.
await Actions.forceClick(navigation, "menuButton");
