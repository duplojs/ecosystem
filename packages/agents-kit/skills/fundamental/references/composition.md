# Composer une opération

## Forme directe et forme curifiée

La forme directe reçoit la donnée et les paramètres. La forme curifiée reçoit les paramètres dans l'étape du pipe, puis retourne la fonction qui recevra la donnée.

Lire la surcharge curifiée en distinguant les génériques de l'appel de configuration de ceux de la fonction retournée. Quand cette dernière ne déclare pas ses propres génériques, ses types sont déjà fixés à la configuration ; un appel ultérieur avec la donnée ne les infère pas à nouveau. Les génériques présents sur la surcharge extérieure ne rendent pas la fonction retournée générique.

Cette signature indique un usage directement dans `DCommon.pipe` ou `DCommon.asyncPipe`, dont le contexte fournit le type de la donnée lors de la configuration. Écrire l'appel de la forme curifiée à l'intérieur des arguments du pipe. Une fonction préparée dans une variable reste hors de ce contexte, même si cette variable est ensuite utilisée comme étape d'un pipe. Ne pas ajouter annotations, génériques explicites ou casts pour rendre cette préparation typable. Pour réutiliser le traitement, écrire une fonction qui reçoit la donnée et construit son pipe, ou utiliser la forme directe avec cette donnée.

Comparer les formes directe et curifiée dans [cet exemple de transformation](examples/composition.ts). Les vérifications de type montrent l'inférence lorsque les appels sont écrits dans le pipe. Le cas à éviter utilise des génériques explicites pour préparer une fonction, puis la passe à un pipe : ce code peut compiler tout en contredisant l'usage attendu.

Le pipe suit ici une même donnée : utilisateurs, utilisateurs actifs, noms. Une fonction déjà unaire de l'API peut être passée directement, comme `DString.trim`. Pour une forme curifiée, écrire son appel de configuration dans l'étape. Ne pas supposer que toutes les fonctions exposent les mêmes surcharges.

## Mise en forme des pipes

Écrire tous les appels de pipe sur plusieurs lignes, avec chaque argument sur sa propre ligne, une virgule après le dernier argument et la parenthèse de fermeture sur une ligne séparée. Ce format s'applique aussi à une donnée suivie d'une seule étape, comme dans le premier pipe de l'exemple. L'appel qui configure la forme curifiée occupe la ligne de l'étape ; une variable préparée auparavant ne le remplace pas.

## Plusieurs sources indépendantes

Quand plusieurs données indépendantes demandent chacune leur propre préparation, les nommer avant de les combiner. Cette préparation concerne les données ; les appels curifiés restent écrits dans les étapes de leur pipe.

Voir [la préparation de deux arguments indépendants](examples/independent-inputs.ts).

Le résultat de cet appel peut ensuite devenir l'entrée d'un autre pipe si plusieurs transformations se suivent.

## Asynchronisme et résultats

`DCommon.asyncPipe` attend chaque étape avant la suivante. Un seul `await` sur le pipe suffit pour obtenir le résultat final.

Voir [un enchaînement asynchrone](examples/async-composition.ts).

Si chaque étape peut renvoyer un `Either`, utiliser `DEither.rightPipe` ou `DEither.rightAsyncPipe` pour propager automatiquement le premier `Left`. Un pipe ordinaire ne décide pas à lui seul comment traiter un `Left`. Les pipes de `DEither` transmettent la valeur du `Right` à l'étape suivante, et non son wrapper.

Pour approfondir, rechercher la currification et la composition des `Either` dans `docs/concepts.llms.md`, depuis la racine AgentKit indiquée dans les instructions du projet.
