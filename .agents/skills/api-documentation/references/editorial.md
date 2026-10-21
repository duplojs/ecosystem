# Contrat éditorial et signatures

## Informations utiles au lecteur

Écrire en français accessible, avec les accents et les noms exacts de l'API. Le lecteur connaît JavaScript et TypeScript. Commencer par ce que fait la fonction, sur quelle donnée et avec quel résultat ou bénéfice observable. Éviter les promesses générales sur les performances, la pureté, les plateformes ou le typage sans preuve propre à cette API.

Décrire le contrat sans raconter l'implémentation. Ne pas répéter la même information dans l'introduction, les paramètres et le retour. Une fonction simple mérite une page courte ; une page plus longue doit expliquer des différences réelles.

Faciliter la lecture en diagonale : phrases courtes, paragraphes centrés sur une idée, liste pour des garanties ou variantes distinctes. Mettre quelques **mots-clés utiles en gras** et les identifiants en `code`, sans soulignement décoratif ni mise en évidence de chaque phrase. Dans Valeur de retour, séparer au besoin la valeur obtenue, l'affinement et les contraintes plutôt que les accumuler dans un seul paragraphe. Une explication simple peut rester en prose.

L'introduction et la description de recherche portent l'utilité propre à la fonction. Ne pas leur ajouter systématiquement « s'utilise directement ou dans un pipe ». Les signatures et l'exemple montrent déjà ces usages. Réserver une explication textuelle à une différence d'inférence ou de comportement réellement utile pour cette fonction. Dans Syntaxe et Paramètres, ne pas redéfinir le fonctionnement général des formes directe et curifiée.

## Ordre des sections

| Partie | Présence et contenu |
| --- | --- |
| `# nomFonction` et introduction | Obligatoires ; nom public exact, utilité en une ou quelques phrases |
| `## Exemple` | Obligatoire ; exemple principal externe en `ts twoslash`, pouvant réunir plusieurs mini-usages utiles |
| `## Syntaxe` | Obligatoire ; contrats publics, sans Twoslash |
| `## Paramètres` | Si la fonction a des paramètres à expliquer ; nom, rôle, forme, facultativité/défaut réel et conditions utiles ; détailler les paramètres des callbacks |
| `## Valeur de retour` | Obligatoire ; valeur, structure, affinement et variantes pertinentes, pas seulement un type recopié |
| `## Exemples complémentaires` | Si une capacité distincte mérite un extrait autonome : option propre à une forme, composition, async ou subtilité de type ; pas un fichier par simple appel supplémentaire |
| `## Points d'attention` | Seulement limitation, piège, erreur, perte de garantie ou condition essentielle non déjà expliquée ailleurs |
| `## Voir aussi` | Si une composition, alternative, complément ou notion dispose d'une vraie page cible |
| `## Sources` | Si une référence externe apporte un éclairage technique utile et a été vérifiée |

Pas de section vide ni de texte de remplissage. Un paramètre trivial peut tenir en une ligne. Pour des options ou callbacks structurés, un tableau peut faciliter la comparaison. Une fonction sans paramètres n'a pas besoin d'une section Paramètres.

Une source externe doit être ouverte et son contenu vérifié avant citation. Préférer MDN pour un parallèle avec JavaScript ou la documentation officielle de la technologie concernée. L'absence de source externe utile n'est pas une lacune. Ne pas créer des liens vers des guides prévus mais absents.

## Présenter les surcharges

Inventorier toutes les surcharges publiques avant de choisir leur présentation. Couvrir chaque capacité distincte ; des variantes équivalentes peuvent être regroupées si leurs différences restent explicites. Ne pas inventer de forme directe, curifiée, async ou type guard parce qu'une fonction voisine la propose.

Favoriser les capacités les plus riches. Pour les familles comparables : curifiée avec type guard, curifiée avec prédicat booléen, directe avec type guard, directe avec prédicat booléen. C'est un ordre de présentation, pas un changement de l'ordre de résolution des surcharges TypeScript ; garder cette distinction si le choix d'une surcharge est sensible à son ordre réel.

Séparer les formes curifiée et directe dans deux blocs, chacun sous son titre `### Signature curifiée` ou `### Signature directe`, même si elles sont courtes. Si une famille comporte plusieurs capacités, utiliser `#### Avec type guard` et `#### Avec prédicat booléen`, avec un bloc par variante. Une signature unique peut rester directement sous Syntaxe. Avec `outline: [2, 3]`, les niveaux quatre structurent le texte sans allonger le sommaire latéral.

Conserver le placement des génériques : ceux de l'appel de configuration et ceux de la fonction retournée n'ont pas le même effet sur l'inférence. Conserver également `const`, `readonly`, paramètres optionnels, unions, type predicates, relations entrée/sortie et erreurs de compatibilité utiles. Décrire le résultat d'un prédicat aussi comme affinement lorsqu'il en possède un.

## Mise en forme des signatures

Les `.d.ts` peuvent être compactés par le build : reprendre leur contrat, pas leur mise en page. Suivre la présentation aérée des sources `scripts/` :

- Indenter avec des tabulations, un niveau par imbrication. Conserver les noms génériques descriptifs du contrat ; ne pas les raccourcir en `T`, `U` pour gagner une ligne.
- Mettre les génériques sur plusieurs lignes, un par ligne, y compris pour un seul générique ; fermer `>` au niveau de la déclaration.
- Mettre les paramètres sur plusieurs lignes, un par ligne, avec virgule finale. Développer de la même façon les paramètres des callbacks et de la fonction retournée.
- Aérer aussi les arguments de types imbriqués et les types conditionnels lorsqu'ils deviennent difficiles à lire. Ne pas déplacer les génériques pour obtenir une présentation plus courte.
- Pas de commentaire pour expliquer la syntaxe dans le bloc. Les titres distinguent les formes ; une explication de garantie ou d'abréviation se place en prose à proximité.
- Les blocs de signatures présentent les déclarations de la fonction, sans `import` ni code de préparation. Les imports versionnés appartiennent aux fichiers d'exemples. Une structure auxiliaire nécessaire se présente dans sa propre sous-section, pas au milieu d'une surcharge.

Les types auxiliaires peuvent précéder les signatures s'ils décrivent une structure nécessaire à leur lecture. Leur présentation suit les mêmes règles d'indentation. Ne pas donner une sous-section à chaque nom rencontré dans les déclarations : appliquer le tri ci-dessous.

## Simplifier seulement ce qui gêne la lecture

Par défaut, représenter fidèlement les signatures. Préférer les types publics nommés aux calculs conditionnels développés.

Pour une signature illisible :

1. Identifier le détail interne à masquer et la garantie utilisateur qu'il calcule.
2. Conserver les arguments et leurs relations, le rôle et la portée des génériques, les type guards et les différences entre surcharges.
3. Marquer le bloc comme « représentation abrégée » et expliquer exactement l'omission à proximité. Un alias pédagogique local doit être nommé et présenté comme tel, jamais comme un export du package.
4. Décrire en prose les garanties omises et les montrer dans un exemple compilé si elles déterminent l'intérêt de la fonction.
5. Comparer à nouveau au contrat source pour vérifier qu'aucune garantie n'a été renforcée, perdue silencieusement ou transformée en promesse runtime.

Les blocs `ts` de Syntaxe sont une représentation du contrat, pas des modules à compiler ni des exemples Twoslash. Ne pas employer un `any` ou `unknown` de remplacement sans signaler ce qui est abrégé. Un type auxiliaire privé peut être cité pour expliquer la déclaration, mais ne pas le qualifier de public ou montrer un import qui n'existe pas.

Un nom de retour opaque cité dans les signatures doit rester compréhensible : donner une définition ou une vue abrégée fidèle du type lorsqu'elle clarifie sa structure. La prose précise ensuite ses conditions et garanties. Une seule explication textuelle suffit si elle rend entièrement le contrat lisible ; ne pas créer un sous-titre qui ne fait que reformuler le nom de l'alias, ni remplacer sa structure par un paragraphe difficile à relier à la signature.

Pour sélectionner les types auxiliaires :

- **Structure à fournir ou résultat à exploiter** : décrire les champs, variantes ou relations nécessaires à l'usage. Ajouter une définition séparée si elle apporte plus que l'explication des paramètres ou du retour.
- **Utilitaire de vérification statique d'un argument** : expliquer dans Paramètres ce que la valeur doit respecter, les valeurs refusées ou conditions de compatibilité utiles, et le caractère statique de la vérification. Dans une signature abrégée, garder le type de valeur et les génériques utiles, puis reporter ces conditions dans l'explication de l'argument. Le nom et la définition du mécanisme de contrôle n'ont pas à être reproduits simplement parce qu'ils apparaissent dans le type d'une option.
- **Calcul interne** : conserver seulement la représentation nécessaire pour comprendre le contrat. Une simplification explicitement signalée peut masquer ce calcul, mais doit préserver ses conditions d'acceptation et les garanties observables. Ne pas faire passer une vérification TypeScript pour une validation runtime.

Ajouter `### Types auxiliaires` seulement si ce tri laisse des définitions utiles ; ne pas recopier leur graphe de dépendances. Un type public peut être complexe sans nécessiter une explication de tous ses utilitaires internes.

## Concepts : documenter les conséquences

- **Contraintes** : indiquer celles exigées, produites, conservées ou perdues. Une garantie de type ne constitue pas automatiquement une validation runtime. Une transformation immuable ne conserve pas automatiquement toutes les contraintes.
- **Forme curifiée** : montrer son appel dans l'étape du pipe et l'effet concret de la composition, sans définir à nouveau la curryfication. Ne pas déplacer l'appel de configuration dans une variable si cela prive l'inférence de son contexte.
- **Either** : nommer les variantes, informations et valeurs réellement retournées, les conditions de chaque issue et la manière pertinente de les exploiter. Vérifier avant d'affirmer un arrêt au premier Left ; un pipe ordinaire n'a pas cette propriété par principe.

Ne pas transformer ces passages en cours théorique. Lier un guide humain existant lorsque cela apporte un complément réel ; AgentKit reste une source de travail de l'agent.
