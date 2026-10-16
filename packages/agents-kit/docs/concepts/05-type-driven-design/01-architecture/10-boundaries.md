### Frontières entre domaine, application et infrastructure

Déterminer les dépendances autorisées, les opérations utilisables depuis chaque couche et le traitement des données et erreurs aux frontières du système.
---

### Sens des dépendances

Les couches suivent cette direction :

```text
Infrastructure → Application → Domaine
Infrastructure → Domaine
```

Le domaine ne dépend ni de l'application ni de l'infrastructure. L'application orchestre les opérations du domaine et définit les ports dont elle a besoin. L'infrastructure fournit les implémentations concrètes et adapte les systèmes externes à ces contrats.

Une dépendance vers le domaine depuis l'infrastructure est donc autorisée lorsqu'elle sert à consommer un contrat ou une capacité du logiciel. Elle ne permet pas à l'infrastructure de déplacer une règle métier dans sa propre couche.

### Respecter les responsabilités aux frontières

Une couche extérieure peut consommer le domaine et l'application, mais ne réalise pas leurs transitions à leur place. L'infrastructure peut :

- lire des données à travers un repository, dont l'implémentation les hydrate avec `map` ou `decodeMap` ;
- appeler une fonction pure de qualification pour établir une condition attendue par l'application ;
- appeler un use case et adapter son résultat au point d'entrée consommé.

Les lectures seules, comme `findById` ou `findMany`, peuvent servir une consultation ou préparer les entrées d'un use case sans imposer un use case de relais. Lorsqu'une opération comporte des règles métier, le domaine les exprime et l'application orchestre leur exécution, les effets et la persistance.

L'infrastructure passe alors par le use case : elle n'appelle directement ni `Fact` ni agrégat et ne modifie pas une entité pour réaliser une transition. Elle n'utilise pas non plus `Flag.append` ; la qualification du domaine établit le flag après avoir constaté la condition.

### Faire entrer les données dans le modèle

L'implémentation qui lit une base, une API ou un fichier hydrate la donnée avant de la retourner avec le contrat prévu. Les structures du domaine servent aussi à valider les entrées externes, afin de transmettre les types métier jusqu'aux use cases.

La couche qui possède la donnée établit les préconditions demandées : qualification du domaine pour un flag, opération prévue par le contrat pour une évidence de contexte. Un simple filtre technique ne suffit pas à produire ces preuves.

### Adapter les résultats

Un résultat métier attendu reste discriminé par son contrat, souvent avec `Either` et une `information`. La frontière le traduit ensuite vers le besoin du consommateur : réponse HTTP, sortie de commande ou autre protocole. Le code de transport ne remplace pas la règle qui a produit le résultat.

Un `Left` ne représente pas automatiquement une erreur technique. Une situation métier prévue reste un résultat à traiter ; une erreur technique imprévisible est normalement levée et signalée à la télémétrie. Elle ne devient un résultat que si le contrat choisit explicitement de la capturer, par exemple avec `DEither.safeCallback` ou `DEither.asyncSafeCallback`, et la couche qui consomme ce résultat doit encore le traiter.
