---
name: duplojs-jsdoc
description: Rediger, ajouter ou corriger la JSDoc publique des fonctions exportees des packages DuploJS avec @duplojs/unplugin-jsdoc-include, en separant les commentaires sources, les fichiers jsDoc et les exemples TypeScript.
---

# JSDoc

Ce skill sert a documenter les fonctions exportees des packages DuploJS.

La JSDoc visible dans le code source doit rester minimale : elle contient principalement une balise `{@include ...}`. Le contenu redige est place dans le dossier `jsDoc/` du package courant, afin d'etre injecte pendant le build par `@duplojs/unplugin-jsdoc-include`.

La documentation produite est destinee aux fichiers generes, notamment les `.d.ts`. Elle fait partie du contrat public de l'API au meme titre que le comportement runtime et les declarations TypeScript.

## Demarche

1. Identifier le package, le domaine, le fichier source et les fonctions a documenter.
2. Lire les conventions d'organisation dans [references/organization.md](references/organization.md).
3. Lire les conventions de redaction et d'inclusion dans [references/content.md](references/content.md).
4. Lire imperativement [les regles d'importation du projet](../../importations.md) avant d'ajouter ou modifier des exemples TypeScript.
5. Verifier si le package possede un `AGENTS.md` ou des instructions locales applicables.
6. Comprendre l'intention publique de la fonction a partir des exports, overloads, signatures, contraintes de type, predicates, formes curifiees, tests et implementations voisines.
7. Creer ou modifier les fichiers `jsDoc/` necessaires, puis ajouter le commentaire source `{@include ...}` correspondant.
8. Valider que les exemples TypeScript compilent, que les chemins d'include sont resolubles depuis le `includedPath` configure et que le build/type checking du package restent valides lorsque c'est pertinent.

## Regles essentielles

La JSDoc redigee est toujours en anglais, meme si le skill et les consignes du projet sont en francais.

La documentation doit expliquer l'utilisation publique de la fonction, pas decrire son implementation interne.

Les exemples doivent etre typables. Ils doivent utiliser les imports publics adaptes au contexte d'un consommateur ou les alias explicitement prevus par le package pour les exemples de documentation.

Les fonctions curifiees sont principalement concues pour etre composees dans `pipe`. Lorsqu'une fonction s'y prete, documenter au moins un exemple qui la montre dans un petit flux simple plutot que seulement dans un appel isole.

Ne pas inventer de comportement a partir du nom d'une fonction. Lorsque l'intention n'est pas claire, la deduire en priorite des declarations TypeScript, des tests et de la documentation existante. Si une ambiguite importante persiste, la signaler.

Les fichiers de documentation ne doivent pas remplacer les tests. Si une incoherence entre documentation souhaitee, typage et comportement runtime est detectee, conserver le code tel quel et signaler l'incoherence.
