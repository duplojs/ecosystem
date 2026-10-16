# Modèles et transitions

Les chemins `docs/` ci-dessous se résolvent depuis la racine du package `@duplojs/agents-kit` installé, retrouvée selon le `SKILL.md`.

## Dessiner le cycle de vie utile

Pour une nouvelle opération, identifier les invariants permanents, les conditions d'entrée, les changements et les garanties de sortie. Une petite entité peut suffire : ajouter des états ou des preuves lorsqu'ils expriment une distinction métier requise, sans inventer un cycle de vie plus détaillé que le besoin.

Regrouper le modèle dans le namespace de l'entité : NewType, structures, définition commune, variantes de propriétés, flags et union des faits. La shape principale reste stable ; si certaines propriétés n'existent que dans un cas, les placer dans une variante de TaggedObject plutôt que rendre toutes les propriétés facultatives.

Un état nommé n'épuise pas les conditions possibles. Une entité peut être disponible, éligible à une action et liée à une autre entité selon plusieurs qualifications compatibles. Ne pas transformer chaque combinaison de flags en un nouvel état exclusif. Une qualification lit l'entité, vérifie sa condition et retourne un résultat qui porte le flag associé ; elle ne change aucune propriété métier.

Lire `docs/concepts/01-fundamental/06-modeling/20-entity.ts`, `30-tagged-object.ts` et `40-entity-lifecycle.ts` pour les constructions et leurs garanties. L'entité `Client` et ses qualifications sont illustrées dans `docs/concepts/05-type-driven-design/fixtures/business/domains/entities/client/index.ts`.

## Donner une cible à chaque fait

Chaque création ou modification métier passe par un fait. Un fait peut lire plusieurs entités, mais il n'en modifie qu'une. Pour deux cibles, définir deux faits et les coordonner dans l'agrégat. Pour plusieurs changements successifs d'une même cible, transmettre la valeur retournée par le fait précédent.

`Entity.update` appartient aux faits ; `Flag.append` appartient aux qualifications et aux faits qui établissent réellement la condition. Une hydratation avec `map` ou `decodeMap` reconstitue une donnée existante et ne remplace pas un événement de création.

Après une mise à jour, repartir de la nouvelle entité, reconstruire les flags dont les conditions sont établies et appliquer le nouveau fait. Les anciens flags et l'ancien fait courant ne sont pas conservés par `Entity.update`. Ne pas réintroduire les preuves d'une valeur antérieure par un spread ou un cast. Le fait courant porté par l'entité ne constitue pas un historique persistant.

Lire `docs/concepts/05-type-driven-design/02-domains/10-entities.md` et les faits associés à `Book` pour les préconditions et la payload de chaque transition. Les valeurs passées à `update` doivent déjà satisfaire leurs structures : `update` ne les valide pas.

## Placer l'exigence à la bonne granularité

Une contrainte commune à toutes les exécutions d'une transition appartient au fait. Une exigence propre à un parcours métier appartient à son agrégat ou à l'étape qui en est responsable.

Dans les fixtures `createBook` de `docs/concepts/05-type-driven-design/fixtures/business/domains/` :

- `entities/book/facts/create.ts` reçoit un `Book.Id` et un `Book.Title` ;
- `aggregates/createBook.ts` exige l'identifiant généré et la preuve du titre non enregistré, extraits des méthodes de `BookRepository` avec `GetEvidenceResult`.

Un autre parcours peut ainsi réutiliser le fait avec une autre provenance autorisée. Si le métier considère ces créations comme deux événements différents, créer des faits distincts. Ne pas déplacer systématiquement toutes les évidences sur les faits, ni sur les seuls agrégats.

L'agrégat n'appelle pas le repository pour obtenir la preuve : il l'exige en entrée. Il n'exécute pas non plus une callback impure reçue de l'extérieur. S'il demande un effet, il déclare la dépendance dans un Resolver ; sans effet à déclarer, il peut retourner directement sa valeur ou son Either.

Lire `docs/concepts/05-type-driven-design/02-domains/20-aggregates.md` et `30-repositories.md` avant de choisir le contrat d'une nouvelle opération.
