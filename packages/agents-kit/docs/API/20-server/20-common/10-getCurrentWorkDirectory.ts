/**
 * @title DSCommon.getCurrentWorkDirectory
 *
 * Obtenir le répertoire de travail courant sous forme de résultat.
 */
import * as DSCommon from "@duplojs/server/common";

const result = DSCommon.getCurrentWorkDirectory();

// Le Right porte un chemin absolu ; le Left signale un échec du runtime.
