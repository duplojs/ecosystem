---
name: api-documentation
description: "Créer, compléter ou maintenir les pages de documentation API humaine DuploJS dans docs/, leurs exemples TypeScript et leurs index, à partir de fonctions, fichiers, namespaces ou dossiers publics. Pour la JSDoc et la documentation destinée aux agents, utiliser leurs skills dédiés."
---

# Documentation API DuploJS

Produire une référence API utile aux développeurs à partir des contrats réels de la version documentée. La demande peut nommer une fonction (`DArray.filter`), un fichier, un namespace ou un dossier. Résoudre la cible sans demander de plan rédactionnel à l'utilisateur.

Ce skill appartient aux outils de contribution du monorepo, pas aux skills installables d'AgentKit. Retrouver la racine par `AGENTS.md`, `pnpm-workspace.yaml` et `docs/`. Les chemins commençant par `docs/`, `packages/` ou `.agents/` ci-dessous partent de cette racine ; les liens `references/` partent de ce skill.

## Cadre

- Définir le contexte `{ langue, version, package, exportPublic, namespace éventuel, fonctions }`. La langue par défaut est le français ; `version` désigne une majeure documentaire `vN`, résolue depuis la demande et le contexte existant. S'il n'existe qu'une majeure, la retenir ; sinon lever une ambiguïté réelle avant de rédiger. Ne pas figer `v1` ni déduire la cible de la version npm courante. Les chemins et imports sont calculés depuis ce contexte.
- La génération actuelle concerne seulement le français. Une demande d'autre langue nécessite un élargissement explicite du périmètre ; ne pas créer de traduction spontanée.
- Modifier les pages API ciblées, les exemples correspondants, les index nécessaires, les voisins de navigation et les pages directement liées dont le « Voir aussi » mérite une mise à jour. Préserver les contenus existants valides.
- Consulter les packages en lecture. Ne pas modifier leurs sources, la JSDoc, les guides, `docs/fr/index.md`, la navbar, les routes, les configurations globales ou les instantanés `docs/libs/` pour faciliter une génération.
- Ne jamais inventer d'export, surcharge, garantie, comportement, import, lien ou directive Twoslash. Un symbole interne ou absent de la version cible n'est pas une page API à générer.

## Démarche

1. **Résoudre.** Lire les consignes applicables à chaque périmètre, y compris les règles d'import avant d'écrire un exemple. Charger [Recherche et version cible](references/sources.md) une fois par opération. Établir la liste exacte des fonctions publiques demandées et leurs destinations avant de rédiger.
2. **Lire la référence existante.** Avant de concevoir le contenu ou les exemples, chercher la fonction dans `packages/agents-kit/docs/API.llms.md`, suivre son routeur et lire l'entrée ainsi que le fichier d'exemple lié lorsqu'ils existent. Compléter les notions nécessaires depuis `packages/agents-kit/docs/concepts.llms.md`. Cette lecture est systématique ; l'absence de référence mène aux déclarations, tests et sources disponibles, sans invention de contrat.
3. **Vérifier le contrat cible.** Confronter les usages et garanties trouvés aux exports et déclarations de la majeure documentée : surcharges, paramètres, génériques, retours et types auxiliaires. AgentKit guide la compréhension, mais ne remplace pas ce contrôle de version. Ne charger que les ressources conceptuelles utiles aux points restant à expliquer.
4. **Préparer le contenu.** Lire [Contrat éditorial et signatures](references/editorial.md). Choisir les types réellement utiles à la lecture et expliquer les vérifications statiques dans les paramètres concernés. Prévoir les usages distincts à montrer, leur ordre et les comparaisons nécessaires. L'exemple principal peut regrouper plusieurs mini-usages ; séparer un complément lorsqu'il mérite un développement propre. Ce plan de travail reste interne.
5. **Écrire et vérifier les exemples.** Suivre [Exemples et Twoslash](references/examples.md), y compris l'organisation des fichiers. Un pipe doit montrer l'insertion de la cible dans un mini-workflow utile. Vérifier les types d'entrée réellement inférés et sélectionner les observations Twoslash qui apportent une information. Compiler les fichiers `.ts` ; aucun cast artificiel pour faire passer un exemple.
6. **Rédiger et intégrer.** Écrire la page selon le contrat éditorial, inclure les exemples et suivre [Index, métadonnées et navigation](references/navigation.md). Vérifier aussi les métadonnées des index touchés. Insérer la page dans l'ordre du sommaire, ajuster ses voisins et boucler vers l'index aux deux extrémités. Réexaminer les « Voir aussi » des seules pages directement liées.
7. **Relire puis valider.** Appliquer la relecture de cohérence de [Validation](references/validation.md) à la page entière, avec le contenu de ses exemples inclus. Juger ce qu'un lecteur peut effectivement comprendre, corriger les lacunes et incohérences, puis effectuer les contrôles techniques. Rendre compte des contrôles exécutés et limites restantes ; la compilation seule ne suffit pas à déclarer une page prête.

## Travail par lots

Conserver en contexte un relevé compact commun : version et résolution des imports, exports publics, conventions documentaires, concepts déjà lus, index et ordre éditorial. Pour chaque fonction, ne garder que son contrat et les preuves particulières. Réutiliser ces informations tant que le package et la version ne changent pas.

Pour « complète ce dossier », inventorier pages manquantes et pages incomplètes dans le périmètre public correspondant ; pour « documente ce fichier », suivre ses seuls exports publics. Ne pas étendre aux fonctions auxiliaires importées. Traiter un groupe cohérent, vérifier ses exemples ensemble, puis intégrer ses index et sa navigation une seule fois. Lancer le build documentaire après les changements du lot, pas après chaque fonction. Ne pas charger tous les `.llms.md`, tous les tests ou tout un package par défaut.

Si une ambiguïté empêche de choisir la fonction ou la version, demander seulement cette précision et continuer les éléments indépendants. Si une information secondaire demeure inconnue, l'omettre et signaler la limite sans fabriquer de contrat.

## Calibration

Consulter les [cas de référence](references/cases.md) pour calibrer un choix éditorial inhabituel ou vérifier la méthode. Ils illustrent des critères de qualité sur des contrats réels ; ce ne sont ni des contenus à recopier ni des associations à imposer à d'autres fonctions. Construire chaque exemple depuis la cible et ses usages vérifiés. Ne pas créer leurs pages publiques hors du périmètre utilisateur.
