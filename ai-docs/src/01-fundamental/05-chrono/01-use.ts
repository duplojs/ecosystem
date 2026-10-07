/**
 * @title Représentation des instants et des durées.
 *
 * TheDate et TheTime pour modéliser le temps avec des valeurs immuables.
 */
import * as DChrono from "@duplojs/lang/chrono";

// TheDate représente un instant absolu ; TheTime une durée ou une quantité de temps.
// Privilégier ces types aux Date et number natifs dans le domaine pour rendre ce sens explicite.
const instant = DChrono.createDate("2026-09-30");
const duration = DChrono.createTime(2, "hour");

// La transformation produit un nouvel instant ; la valeur initiale reste inchangée.
const later = DChrono.addTime(instant, duration);
