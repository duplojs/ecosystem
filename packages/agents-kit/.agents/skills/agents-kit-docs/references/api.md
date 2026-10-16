# Référence API

Dans `docs/API/`, documenter les fonctions exportées par les namespaces publics des packages. Un domaine correspond à un namespace, comme `DArray` pour `@duplojs/lang/array` ; établir son inventaire depuis les exports du chemin d'importation correspondant.

Exclure de cet inventaire les kinds, les kind handlers, les kind namespaces et les fonctions qu'ils génèrent, même lorsqu'ils sont exposés par un namespace public.

Consacrer un fichier TypeScript à chaque fonction demandée, en regroupant ses surcharges et ses formes d'appel. Tous ces fichiers portent le préfixe `10-`, sous la forme `10-<nom>.ts`, par exemple `10-map.ts` et `10-filter.ts`. Ce préfixe reste identique pour toutes les fonctions ; il ne s'applique pas au nommage des dossiers de domaine.

Le titre du header est `Namespace.fonction`, par exemple `@title DArray.map`, accompagné d'une courte phrase décrivant son rôle. Exposer uniquement ce header dans le routeur concerné, pour retrouver la fonction.

Le routage API comprend plusieurs fichiers `*.llms.md`, notamment des routeurs par domaine. Rattacher chaque source au routeur correspondant à son domaine ; ne pas supposer que toute la référence API est regroupée dans un seul fichier.

Dans le contenu du fichier, décrire en une phrase ce que fait globalement la fonction, puis le montrer par de petits exemples typés. Ne pas recopier les signatures publiques ni ajouter une explication détaillée de leurs paramètres, génériques ou surcharges : les appels illustrent leur utilisation.

Titrer les différents usages par des commentaires dans le fichier TypeScript, par exemple « Appel classique » et « Appel curifié ». Montrer ces deux formes lorsqu'elles existent, avec l'appel curifié dans `pipe` lorsque c'est pertinent.

Chaque exemple doit rendre son résultat de sortie explicite : indiquer la valeur obtenue dans un commentaire lorsqu'elle est déterminable et montrer le type inféré avec `DCommon.ExpectType` ou une vérification de typage équivalente. Pour une entrée dont la valeur dépend du runtime, préciser ce que représente la sortie et ses garanties. Appliquer cette règle aux appels classiques, curifiés et aux variations ; un appel seul ne suffit pas à documenter son résultat. Laisser le résultat s'inférer, sans annotation ni assertion qui imposerait le type attendu.

Écrire tous les appels de `pipe` sur plusieurs lignes, même avec seulement deux arguments : ouverture après le nom de la fonction, chaque argument sur sa propre ligne, virgule après le dernier et parenthèse de fermeture sur une ligne séparée. Écrire l'appel curifié directement sur la ligne de l'étape. L'[exemple de composition](../../../../skills/fundamental/references/examples/composition.ts) montre ce format avec une donnée et une seule étape, ainsi que la vérification du type de sortie avec `DCommon.ExpectType`.

Pour chaque fonction, examiner ses surcharges et les variantes acceptées par chacun de ses arguments, notamment les types en union. Couvrir ces variantes par des exemples et, lorsque plusieurs arguments proposent des variantes, montrer leurs combinaisons valides qui illustrent des usages, des comportements ou des garanties de sortie distincts. Vérifier le résultat propre à chaque combinaison illustrée. Regrouper les combinaisons équivalentes dans des exemples représentatifs pour éviter les répétitions. Donner à chaque variation un titre en commentaire qui nomme l'usage ou l'effet démontré.

Lorsque la fonction utilise les contraintes portées par les données d'entrée pour calculer le type du résultat, montrer cet effet dans une variation dédiée. Rendre visibles les contraintes des entrées et le type de sortie inféré : garanties préservées, renforcées ou perdues, ou changement de forme du résultat selon les garanties disponibles. Comparer de petits cas lorsque cela aide à comprendre cette dépendance. Pour mettre en scène une entrée ayant un type précis, notamment des contraintes, utiliser une déclaration `declare const` avec le nom de la variable et son type. Cette déclaration pose les garanties supposées de l'entrée ; l'exemple se concentre sur l'appel de la fonction et le type de sortie qu'elle infère. La vérification du type de sortie doit porter sur les garanties illustrées. Associer au code les commentaires nécessaires pour comprendre le lien entre les entrées et le résultat.
