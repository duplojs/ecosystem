### Métadonnées internes des kinds

Un petit store attaché à l'objet, exploitable dans les types ou au runtime selon son contrat.

---

Un objet peut porter plusieurs kinds. Dans un `Right`, ils contiennent notamment le statut, l'information contextuelle et la valeur. Un kind peut aussi n'être qu'un marqueur, avec une valeur `null`.

Certaines informations associées au kind servent uniquement au typage et ne reflètent pas nécessairement la valeur stockée. Consulter le contrat du domaine avant de les exploiter au runtime. Contrairement aux kinds, les [contraintes de typage](../01-constraint/index.md) n'ajoutent aucune propriété à la valeur.

Ces métadonnées sont internes, mais restent observables dans l'objet JavaScript. Le `has` d'un gestionnaire vérifie seulement la présence de sa clé ; la validation du contenu relève des [DataStructure](../04-data-structure/index.md).
