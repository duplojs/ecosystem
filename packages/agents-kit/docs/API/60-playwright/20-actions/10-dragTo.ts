/**
 * @title Actions.dragTo
 *
 * Glisser un élément visible vers une cible visible.
 */
import { Actions } from "@duplojs/playwright";
import { board } from "../fixtures/component";

// La source et la cible doivent être visibles avant le glisser-déposer.
await Actions.dragTo(board, "task", board.elements.doneColumn, { timeout: 5000 });
