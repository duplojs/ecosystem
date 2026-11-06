### Transport de l'identité entre programmes

Reconnaître une donnée après désérialisation sans dépendre du constructeur de son runtime d'origine.

---

Les clés runtime des kinds dépendent de leur nom et de leur namespace. Un autre programme connaissant cette convention peut donc reconnaître la donnée, sans partager le gestionnaire en mémoire qui l'a créée.

Une sérialisation JSON conserve ces clés textuelles énumérables et leurs valeurs compatibles. Un objet taggé peut ainsi rester reconnaissable après transport entre deux serveurs. À l'inverse, JSON ne rétablit pas le prototype permettant la reconnaissance habituelle d'une instance de classe par `instanceof`.

Le transport doit préserver les marqueurs nécessaires : une propriété valant `undefined` est omise et une fonction n'est pas transportée. La présence d'un kind ne valide pas les données reçues ; utiliser le contrat de validation du domaine à la frontière externe.
