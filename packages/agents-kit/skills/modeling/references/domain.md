# Modèles et transitions

Les chemins `docs/` ci-dessous se résolvent depuis la racine du package `@duplojs/agents-kit` installé, retrouvée selon le `SKILL.md`.

## Dessiner le cycle de vie utile

Pour une nouvelle opération, identifier les invariants permanents, les conditions d'entrée, les changements et les garanties de sortie. Une petite entité peut suffire : ajouter des états ou des preuves lorsqu'ils expriment une distinction métier requise, sans inventer un cycle de vie plus détaillé que le besoin.

Regrouper le modèle dans le namespace de l'entité : NewType, structures, définition commune, variantes de propriétés, flags et union des faits. La shape principale reste stable ; si certaines propriétés n'existent que dans un cas, les placer dans une variante de TaggedObject plutôt que rendre toutes les propriétés facultatives.

Un état nommé n'épuise pas les conditions possibles. Une entité peut être disponible, éligible à une action et liée à une autre entité selon plusieurs qualifications compatibles. Ne pas transformer chaque combinaison de flags en un nouvel état exclusif. Une qualification lit l'entité, vérifie sa condition et retourne un résultat qui porte le flag associé ; elle ne change aucune propriété métier.

Pour modifier cette organisation, lire `docs/concepts/05-type-driven-design/02-domains/10-entities.md`. Consulter ensuite les exemples de `docs/concepts/01-fundamental/06-modeling/` correspondant aux primitives utilisées : `10-new-type.ts`, `20-entity.ts`, `30-tagged-object.ts` ou `40-entity-lifecycle.ts`. La page sur les entités relie les fixtures de qualification et de transition.

## Donner une cible à chaque fait

Chaque création ou modification métier passe par un fait. Un fait peut lire plusieurs entités, mais il n'en modifie qu'une. Pour deux cibles, définir deux faits et les coordonner dans l'agrégat. Pour plusieurs changements successifs d'une même cible, transmettre la valeur retournée par le fait précédent.

`Entity.update` appartient aux faits ; `Flag.append` appartient aux qualifications et aux faits qui établissent réellement la condition. Une hydratation avec `map` ou `decodeMap` reconstitue une donnée existante et ne remplace pas un événement de création.

Après une mise à jour, repartir de la nouvelle entité, reconstruire les flags dont les conditions sont établies et appliquer le nouveau fait. Les anciens flags et l'ancien fait courant ne sont pas conservés par `Entity.update`. Ne pas réintroduire les preuves d'une valeur antérieure par un spread ou un cast. Le fait courant porté par l'entité ne constitue pas un historique persistant.

Les valeurs passées à `update` doivent déjà satisfaire leurs structures : `update` ne les valide pas. Vérifier les préconditions, la payload et les preuves de sortie dans les faits du projet avant d'ajouter une transition.

## Placer l'exigence à la bonne granularité

Une contrainte commune à toutes les exécutions d'une transition appartient au fait. Une exigence propre à un parcours métier appartient à son agrégat ou à l'étape qui en est responsable.

Comparer les parcours qui consomment le fait : conserver ses préconditions communes et placer les exigences supplémentaires dans le contrat du parcours qui les impose. Si le métier distingue les événements eux-mêmes, créer des faits distincts. Ne pas déplacer systématiquement toutes les évidences sur les faits, ni sur les seuls agrégats.

L'agrégat n'appelle pas le repository pour obtenir la preuve : il l'exige en entrée. Il n'exécute pas non plus une callback impure reçue de l'extérieur. S'il demande un effet, il déclare la dépendance dans un Resolver ; sans effet à déclarer, il peut retourner directement sa valeur ou son Either.

Pour un contrat d'agrégat, lire `docs/concepts/05-type-driven-design/02-domains/20-aggregates.md` ; son exemple `createBook` illustre les exigences propres à une transaction. Pour une capacité extérieure, lire `docs/concepts/05-type-driven-design/02-domains/30-repositories.md`. Si le contrat exige une provenance, consulter `docs/concepts/01-fundamental/06-modeling/50-evidence.ts` ; si c'est l'identité d'une dépendance qui compte, consulter `docs/concepts/01-fundamental/06-modeling/60-signed-function.ts`.
