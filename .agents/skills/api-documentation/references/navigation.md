# Index, métadonnées et navigation

## Routes

Parcours : langue → version majeure → API → package → namespace éventuel → fonction. Calculer les chemins depuis les exports et la documentation existante :

```text
docs/<langue>/<version>/api/<package>/<namespace éventuel>/<fonction>.md
docs/examples/<version>/api/<package>/<namespace éventuel>/<fonction>.ts
```

Ne pas imposer un namespace aux packages qui exposent leurs fonctions à un autre niveau. Préserver la casse des noms publics et les routes déjà établies. Les URLs internes sont actuellement absolues depuis la racine documentaire, sans `.md` grâce à `cleanUrls: true` ; les index utilisent une barre finale, par exemple `/fr/v1/api/lang/array/`.

## Trois responsabilités d'index

| Niveau | Intervention autorisée lors de la génération d'une fonction |
| --- | --- |
| `api/index.md` | Routeur vers les packages ; ajouter seulement un accès manquant au package si nécessaire ; préserver l'interface existante, sans concevoir de grille ou de cartes |
| `api/<package>/index.md` | Préserver la page sur mesure et ses contenus ; mettre à jour uniquement les accès nécessaires. Si elle manque, créer titre, présentation factuelle courte et liens existants vers les domaines/fonctions concernés |
| Index de namespace/domaine | Créer ou maintenir un sommaire par finalité avec import pertinent, catégories utiles et entrées descriptives |

Une conception complète de page package nécessite une demande spécifique ; ne pas remplir un template marketing. Ne pas modifier `docs/fr/index.md` ni les guides pour raccorder les nouvelles pages.

## Sommaires par usage

Déduire les catégories des fonctions réellement documentées et du vocabulaire du domaine. Réutiliser les regroupements existants valides. Classer par exemple des transformations et des recherches dans des groupes distincts lorsque cet ensemble le justifie ; ne pas créer de catégories vides pour suivre un plan théorique.

Format préféré pour un namespace suffisamment fourni :

```md
## Transformation

### [map](/fr/v1/api/lang/array/map)

Transforme les éléments du tableau avec une fonction.
```

Le lien d'exemple ci-dessus existe dans le dépôt initial ; tout autre lien doit être résolu avant ajout. Un très petit namespace peut garder une présentation compacte, avec une phrase utile par entrée. Ne pas transformer trois fonctions en dix catégories.

Chaque fonction documentée apparaît une seule fois dans le sommaire principal, sous son nom exact, avec son utilité en une phrase. Ne pas lister des fonctions encore sans page comme si elles étaient documentées. Ne pas supprimer des entrées valides hors du lot ni déplacer des contenus éditoriaux sans nécessité.

## Frontmatter des pages de fonction

Exemple valide pour la page `map`, à adapter aux faits et à l'ordre de navigation réel :

```yaml
---
title: "DArray.map — transformer les éléments d'un tableau"
description: "DArray.map transforme chaque élément d'un tableau avec une fonction et conserve les contraintes de taille compatibles."
outline: [2, 3]
pageClass: docs-layout-api
prev:
  text: "Array"
  link: "/fr/v1/api/lang/array/"
next:
  text: "Array"
  link: "/fr/v1/api/lang/array/"
---
```

Le H1 reste le nom de fonction. `title` et `description` identifient l'API et son utilité hors contexte pour la recherche. Échapper correctement le YAML. Conserver les autres métadonnées valides ; ne pas écraser un `head` existant. VitePress utilise déjà `title` et `description` : ne pas dupliquer les balises SEO ou inventer des champs de découvrabilité. Éviter `layout: page`, qui retirerait les fonctionnalités du layout documentaire.

Pour chaque index créé ou modifié lors de l'intégration, vérifier et compléter `title`, `description`, `outline: [2, 3]` et `pageClass: docs-layout-api-index`, même si son contenu existait déjà. Le titre identifie le package ou namespace ; la description précise ses capacités plutôt que « fonctions pour manipuler les tableaux ». Exemple pour Array :

```yaml
---
title: "Array — référence API Lang"
description: "Référence des fonctions DArray pour rechercher, transformer et organiser les éléments des tableaux."
outline: [2, 3]
pageClass: docs-layout-api-index
---
```

Adapter ces métadonnées au contenu réel, préserver les champs déjà valides et ne pas lancer une réécriture des index hors du périmètre. Le thème applique des largeurs différentes aux pages de fonction et aux index. La navbar et la recherche locale sont déjà configurées : aucune modification globale n'est nécessaire pour ajouter une page API.

## Ordre prev/next déterministe

La sidebar actuelle ne contient que le guide. Elle ne fournit pas d'ordre automatique aux pages API. Utiliser les objets frontmatter `{ text, link }`, pris en charge par le thème installé.

1. Prendre l'ordre des groupes et des entrées de l'index le plus proche. Stabiliser cet ordre selon le parcours d'usage ; ne pas prendre l'ordre alphabétique du disque. Pour un index nouvellement créé, choisir les groupes et l'ordre une fois pour le lot.
2. Aplatir les groupes en conservant leur ordre éditorial : les titres de groupe ne sont pas des pages et ne cassent pas la continuité. Relier les pages de fonction consécutives de ce même sommaire, y compris aux frontières des groupes.
3. Boucler sur le sommaire : la première fonction a l'index en `prev`, la dernière a l'index en `next`. Avec une seule fonction, ses deux liens pointent vers l'index. Ne pas mettre `false` à ces bornes et ne pas passer directement de la dernière à la première. Si une page existante utilise une autre convention, ajuster les bornes nécessaires pour respecter cette boucle.
4. Lors d'une insertion entre A et B, affecter `nouvelle.prev = A`, `nouvelle.next = B`, `A.next = nouvelle` et `B.prev = nouvelle`. Au début, affecter `nouvelle.prev = index`, `nouvelle.next = anciennePremière` et `anciennePremière.prev = nouvelle`. À la fin, affecter `ancienneDernière.next = nouvelle`, `nouvelle.prev = ancienneDernière` et `nouvelle.next = index`. Ne pas inventer de voisin si la liste était vide : les deux liens de la nouvelle page reviennent à l'index.
5. Vérifier les liens dans les deux sens entre fonctions et le retour au sommaire aux deux bornes. Il n'est pas nécessaire de donner au sommaire un `prev` et un `next` réciproques. Si la fonction est directement au niveau du package, utiliser la liste des fonctions de cet index ; ne pas réordonner toute sa présentation pour cela. Ne pas traverser les namespaces par simple proximité de fichiers.

## Maintenir les relations « Voir aussi »

Pas de lien vers une page planifiée mais absente. À chaque ajout, rechercher les pages déjà présentes des fonctions avec lesquelles la cible a une relation précise : composition caractéristique, alternative ou complément. Examiner leurs « Voir aussi » et ajouter le lien inverse lorsqu'il aide aussi leur lecteur. Cette mise à jour peut concerner un autre namespace du même contexte documentaire ; elle reste limitée aux relations identifiées, sans balayage de toutes les pages.

Un bon lien porte une raison propre aux API concernées, établie à partir de leurs contrats et usages vérifiés : exploiter un retour, compléter une opération, remplacer une approche sous d'autres conditions ou construire une composition caractéristique. Chercher cette raison dans les sources et AgentKit, puis évaluer son intérêt pour le lecteur de chaque page. Ne pas déduire une association d'un exemple à recopier ni imposer une réciprocité automatique.

Une API générique ne doit pas être liée à toutes les fonctions capables de la composer. Une proximité de namespace ou l'apparition accessoire dans un exemple ne suffit pas. Ajouter une courte raison au lien si elle aide à comprendre la relation, et garder les liens dans le même contexte de langue et de majeure. Un lien vers le sommaire peut faciliter l'orientation, mais ne remplace pas le choix de fonctions associées ; l'ordre prev/next n'est pas non plus une preuve de relation.
