# Manipuler des fichiers

`ServerFile` regroupe les principales fonctions permettant de manipuler des fichiers, des dossiers, des liens et, plus généralement, le système de fichiers.

Cette API est cross-platform : elle expose une interface commune pour Node.js, Deno et Bun, ce qui permet d'utiliser les mêmes fonctions quel que soit le runtime.

Les opérations sur le système de fichiers peuvent échouer pour de nombreuses raisons : fichier inexistant, permissions insuffisantes, chemin invalide, etc. Pour représenter explicitement ces cas, les fonctions de ServerFile retournent leurs résultats avec `Either`.