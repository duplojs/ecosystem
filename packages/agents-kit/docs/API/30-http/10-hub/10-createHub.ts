/**
 * @title createHub
 *
 * Créer le Hub qui rassemble les routes et configure une application HTTP.
 */
import { createHub } from "@duplojs/http";

// environment est requis : DEV, PROD ou BUILD ; EnvironmentCustom permet
// aux applications d'étendre ce type par augmentation de module.
// Les composants et plugins peuvent adapter leur comportement à cette valeur.
const hub = createHub({
	environment: "DEV",
});
