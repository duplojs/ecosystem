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

### Opérations autorisées depuis l'infrastructure

L'infrastructure ne réalise pas directement les transitions métier :

- appeler une `Fact` depuis une route, un repository ou une autre implémentation infrastructurelle est interdit ;
- appeler `Flag.append` ou construire directement un flag dans l'infrastructure est interdit ;
- modifier une entité ou lui ajouter une information métier depuis l'infrastructure est interdit.

L'infrastructure peut en revanche :

- appeler un repository ou une autre capacité déclarée par le domaine ou l'application ;
- hydrater une donnée externe dans l'implémentation du repository avec `map` ou `decodeMap` ;
- appeler une fonction de requalification qui vérifie l'état d'une entité et appose localement le flag correspondant ;
- transmettre au use case une entité portant les preuves produites par cette requalification.

Une fonction de requalification est une vérification préalable. Elle ne modifie pas les propriétés métier et ne réalise aucune transition. La création ou modification métier reste portée par une `Fact` appelée depuis le domaine applicatif.

### Hydrater les données externes

L'implémentation qui récupère une donnée externe est responsable de son hydratation. Un repository qui lit une base, une API ou un fichier vérifie et hydrate la donnée avant de la retourner à l'application, avec le résultat ou l'erreur prévus par son contrat.

Le repository ne doit pas retourner une donnée brute en laissant à l'application la responsabilité de reconstruire une entité métier déjà attendue par son contrat. Si la donnée est valide mais ne possède pas encore une preuve de contexte ou d'état, la couche qui en a besoin appelle la fonction de requalification prévue par le domaine.

### Utiliser les structures aux frontières HTTP

Une route est un moyen de consommer le cycle de vie du logiciel. Elle peut utiliser directement une `DataStructure` du domaine lorsque la capacité HTTP sert directement ce modèle métier. Elle peut aussi déclarer une structure spécifique lorsque le client attend une forme différente, ou lorsque certaines propriétés ne doivent pas être exposées.

Une route peut retourner une entité complète si le client en a besoin et si son exposition ne révèle pas de donnée inutile ou sensible. Elle doit réduire ou transformer la réponse lorsque le contrat du client ne nécessite pas toute l'entité, notamment pour protéger des informations de sécurité.

Il n'existe donc pas d'obligation générale de créer un DTO séparé. La décision dépend du contrat consommé et des informations qui peuvent être exposées.

### Distinguer les erreurs à traiter

Avant de choisir le traitement d'une erreur, déterminer deux besoins indépendants :

1. faut-il prévenir le client ou l'utilisateur de l'échec ?
2. faut-il prévenir les développeurs ou la télémétrie ?

Une erreur métier attendue est traitée par le contrat de résultat et peut être transformée en réponse adaptée au consommateur. Une erreur technique qui compromet une opération, une transaction ou une garantie d'exécution doit être signalée à la télémétrie et suivre la politique technique prévue : propagation, reprise, annulation ou réinitialisation.

Selon le point d'entrée, la présentation technique change : une consommation HTTP produit une erreur ou une réponse HTTP ; une commande produit une erreur de commande ou une sortie console. Cette présentation ne déplace pas la règle métier dans l'infrastructure.
