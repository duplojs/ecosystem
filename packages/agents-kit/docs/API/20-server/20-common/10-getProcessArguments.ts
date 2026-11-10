/**
 * @title DSCommon.getProcessArguments
 *
 * Lire les arguments utilisateur du processus.
 */
import * as DSCommon from "@duplojs/server/common";

const argumentsFromTerminal = DSCommon.getProcessArguments();

// Les entrées de lancement du runtime ne figurent pas dans ce tableau.
