---
name: ai-docs
description: "Créer, organiser ou corriger l'AI Doc DuploJS dans `ai-docs/src` : documentation concise pour les agents, routage conceptuel et exposition au `LLMS.md`."
---

# AI Docs

L'AI Doc fournit aux agents les connaissances nécessaires pour utiliser et implémenter les concepts de l'écosystème DuploJS. Sa source de vérité est `ai-docs/src/` ; le `LLMS.md` est généré depuis cette arborescence. Modifier les sources documentaires.

Le **routage** permet de trouver la connaissance pertinente. Le **contenu documentaire** permet d'agir correctement une fois la ressource consultée. Organiser les deux pour limiter le contexte chargé et les répétitions.

## Préparer l'intervention

- Définir la connaissance que la ressource doit transmettre et les décisions qu'elle doit permettre à l'agent de prendre. Respecter le périmètre demandé.
- Consulter les documents voisins et les ressources déjà consacrées aux notions mobilisées. Réutiliser leur terminologie et identifier ce qui peut être référencé.
- Vérifier les exports publics et les signatures TypeScript utiles ; lire les implémentations et les tests lorsque le comportement ou les garanties nécessitent confirmation.
- Avant de créer ou modifier un exemple TypeScript, lire `.agents/importations.md` à la racine de l'écosystème.

## Organisation et exposition

Le parcours de génération commence dans `ai-docs/src/` et descend récursivement dans les dossiers à préfixe numérique. Il reconnaît les fichiers documentaires numérotés et les `index.md`. L'ordre est lexical.

| Ressource | Convention |
| --- | --- |
| Dossier parcouru | Préfixe ordinal sur deux chiffres : `01-constraint/`, `02-currying/`, etc. |
| Fichier documentaire | Préfixe sur deux chiffres, selon le niveau d'exposition ci-dessous. Même convention pour Markdown et TypeScript. |
| `index.md` | Présentation courte du domaine correspondant au dossier. |
| Ressource auxiliaire | Fichier ou dossier sans préfixe numérique, comme `fixtures/` ; non parcouru, sauf `index.md`. Peut être référencé ou importé par les documents. |

Choisir le niveau d'exposition avant de numéroter un nouveau fichier :

| Format | Préfixes disponibles | Contenu intégré au `LLMS.md` |
| --- | --- | --- |
| TypeScript fondamental | `01` à `09` | Header et contenu documentaire. |
| TypeScript consulté à la demande | `10, 20, 30, 40, 50, 60, 70, 80, 90` | Header uniquement. |
| Markdown, y compris `index.md` | `01` à `09` ou les dizaines ci-dessus ; `index.md` sans préfixe | Partie précédant le premier séparateur `---`, ou fichier entier sans séparateur. |

Les fichiers détaillés utilisent exclusivement les dizaines indiquées : les positions intermédiaires comme `15` ou `25` sont exclues. Le préfixe ordonne les ressources dans leur niveau ; il ne change pas la règle d'exposition du Markdown.

Le séparateur Markdown est une ligne contenant exactement `---` ; il n'est pas exposé. La partie suivante reste dans le fichier source et se consulte à la demande. Un Markdown sans séparateur doit donc contenir uniquement du routage.

## Rédiger le routage

Nommer le concept, le problème ou la capacité documentée avec un titre explicite et une description succincte. Le routage identifie le sujet sans l'enseigner : les explications, comportements détaillés et exemples appartiennent au contenu documentaire.

- **Index :** caractériser le domaine à la granularité du dossier. Un index supérieur présente un domaine large ; les ressources suivantes précisent les concepts.
- **Markdown :** placer le titre et la description avant le séparateur.
- **TypeScript :** ouvrir chaque fichier parcouru avec un header de cette forme :

```ts
/**
 * @title Preuves de passage par une opération.
 *
 * Exiger dans les types qu'une valeur soit passée par un traitement préalable.
 */
```

Un symbole d'API peut nommer le concept lui-même. Les fonctions utilisées seulement pour l'illustrer restent dans l'exemple.

Pour vérifier le périmètre du routage : **si l'exemple change mais transmet la même connaissance, le titre et la description doivent rester pertinents.**

## Rédiger le contenu documentaire

Écrire pour un agent qui peut consulter le reste de l'AI Doc. Donner les règles et les informations nécessaires pour utiliser ou implémenter le sujet correctement. Adapter la longueur et la structure à sa complexité ; un concept simple appelle une explication courte.

- **Sélectionner les détails utiles.** Ajouter une précision lorsqu'elle change une décision d'implémentation ou évite une erreur probable : contrat d'entrée ou de sortie, comportement runtime, garantie de typage, précondition ou limite pertinente. Ne pas transformer les possibilités d'explication en liste de sujets à couvrir systématiquement.
- **Donner une place unique à chaque connaissance.** Énoncer une règle une fois, dans la ressource responsable du concept. Référencer les fondamentaux et documents complémentaires plutôt que réexpliquer leurs mécanismes. Dans une révision, fusionner ou remplacer les passages concernés au lieu d'accumuler des blocs correctifs.
- **Utiliser les exemples comme preuves.** Choisir le plus petit exemple représentatif qui démontre la connaissance, avec du code typable et conforme aux conventions. Réutiliser les fixtures pertinentes ; ajouter un autre exemple seulement s'il apporte un comportement ou une garantie distincte.
- **Commenter ce que le code seul ne dit pas.** Expliquer les conditions, les résultats ou le typage utiles au raisonnement de l'agent. Éviter la paraphrase du code et les rappels généraux de TypeScript.

Le Markdown porte les explications et contextualise les liens vers les exemples TypeScript ou les fixtures, sans recopier leur implémentation. Les fichiers TypeScript documentaires associent code et commentaires après leur header ; plusieurs API peuvent être combinées pour démontrer un même concept.

## Intégrer et vérifier

Pour une création, placer la ressource dans le domaine approprié selon les conventions d'organisation et d'exposition. Pour une révision, conserver les connaissances utiles, corriger leur placement et retirer les répétitions. Adapter l'index si le périmètre du domaine évolue.

Avant de terminer :

- Vérifier la position, l'ordre, la numérotation et l'exposition selon les tableaux ci-dessus.
- Relire le routage indépendamment des exemples : il doit permettre de retrouver le sujet sans charger son explication.
- Relire le contenu du point de vue d'une future implémentation : retirer les passages sans apport à une décision ou à une garantie, et remplacer les réexplications par les références pertinentes.
- Vérifier les liens, l'exactitude des API et, pour les exemples TypeScript créés ou modifiés, la conformité des imports et le typage.
