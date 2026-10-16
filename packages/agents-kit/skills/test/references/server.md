# Remplacer les fonctions serveur

Lire [l'exemple de fonction utilisant une lecture serveur](examples/server.ts) pour tester un traitement applicatif sans accès réel au système de fichiers. Rechercher aussi « Remplacer les implémentations serveur » dans le routeur conceptuel pour un exemple de commande avec des arguments de processus contrôlés.

## Injecter la capacité utilisée

`setEnvironment` et `TESTImplementation` sont des exports directs de `@duplojs/server`, sans sous-export dédié. Importer les domaines tels que `DSFile` depuis leurs sous-exports habituels.

Activer l'environnement `TEST`, puis enregistrer les implémentations avec `TESTImplementation.set`. Les noms et signatures autorisés sont typés à partir des fonctions serveur disponibles. Fournir leurs résultats `Either` attendus, y compris dans les scénarios d'échec. Enregistrer aussi les capacités appelées indirectement par le traitement ; seules les fonctions qui passent par le mécanisme d'implémentation serveur sont remplaçables ainsi.

Utiliser un spy du runner comme implémentation injectée pour vérifier les arguments et le nombre d'appels. Le traitement testé continue d'appeler l'API serveur publique. Pour tester la propagation d'un échec, injecter cet échec, sélectionner son information dans le résultat applicatif et vérifier la valeur ou la cause propagée.

## Rétablir l'état partagé

Le registre et l'environnement sont partagés. Dans `afterEach`, appeler `TESTImplementation.clear()` et rétablir l'environnement attendu par la suite même après une assertion en échec. L'exemple rétablit `NODE` parce qu'il vise une suite Vitest exécutée sous Node ; adapter ce choix pour Bun ou Deno. Ne pas exécuter concurremment des tests qui modifient ce même état.

Une implémentation absente en environnement `TEST` provoque une exception. Corriger l'enregistrement manquant si cet appel fait partie du scénario. Un test d'intégration qui doit vérifier les I/O réelles conserve son environnement natif et utilise des ressources temporaires adaptées.
