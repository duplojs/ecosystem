## DCommon

Fonctions générales de composition, de transformation, de contrôle de flux et de manipulation des valeurs partagées par les autres domaines DuploJS.

### [DCommon.and](10-and.ts)

Combiner plusieurs prédicats dans une condition qui doit tous les satisfaire.
 
### [DCommon.asserts](10-asserts.ts)

Affirmer une contrainte de type et lever une erreur si le prédicat échoue.
 
### [DCommon.asyncInnerPipe](10-asyncInnerPipe.ts)

Construire une fonction qui enchaîne des opérations synchrones ou asynchrones.
 
### [DCommon.asyncLoop](10-asyncLoop.ts)

Contrôler une boucle asynchrone avec un compteur et une sortie typée.
 
### [DCommon.asyncPipe](10-asyncPipe.ts)

Exécuter séquentiellement plusieurs transformations en attendant chaque résultat.
 
### [DCommon.callThen](10-callThen.ts)

Appliquer une fonction à une valeur immédiate ou promise, avec gestion optionnelle des erreurs.
 
### [DCommon.cast](10-cast.ts)

Vérifier au niveau du typage qu’une valeur respecte une contrainte attendue.
 
### [DCommon.clone](10-clone.ts)

Copier récursivement les tableaux et objets simples sans modifier la valeur source.
 
### [DCommon.createAsyncRetry](10-createAsyncRetry.ts)

Décorer une fonction asynchrone avec une stratégie de nouvelle tentative.
 
### [DCommon.createBuilder](10-createBuilder.ts)

Configurer des handlers réutilisables pour construire un objet par étapes.
 
### [DCommon.createEnum](10-createEnum.ts)

Créer un enum littéral qui expose ses valeurs, un tuple et un prédicat `has`.
 
### [DCommon.createExternalPromise](10-createExternalPromise.ts)

Exposer les contrôles `resolve` et `reject` d’une promise séparément de sa création.
 
### [DCommon.createFormData](10-createFormData.ts)

Transformer un objet de valeurs en `FormData` en conservant ses valeurs d’entrée typées.
 
### [DCommon.createInterpolation](10-createInterpolation.ts)

Préparer une fonction qui remplace les identifiants entre accolades dans un modèle.
 
### [DCommon.createQueue](10-createQueue.ts)

Créer une file d’attente typée avec une capacité optionnelle.
 
### [DCommon.createTransformer](10-createTransformer.ts)

Créer une fonction de transformation récursive liée à un nom de méthode.
 
### [DCommon.detachObjectMethod](10-detachObjectMethod.ts)

Détacher une méthode d’un objet tout en conservant son contexte d’exécution.
 
### [DCommon.equal](10-equal.ts)

Créer un prédicat d’égalité pour une valeur ou une liste de valeurs littérales.
 
### [DCommon.escapeRegExp](10-escapeRegExp.ts)

Échapper les caractères spéciaux d’une chaîne avant de l’utiliser dans une expression régulière.
 
### [DCommon.falsy](10-falsy.ts)

Identifier les valeurs falsy JavaScript avec un narrowing TypeScript.
 
### [DCommon.forward](10-forward.ts)

Retourner une valeur telle quelle pour la rendre explicite dans une composition.
 
### [DCommon.forwardAsserts](10-forwardAsserts.ts)

Vérifier une valeur et la retourner, ou produire une fonction réutilisable de vérification.
 
### [DCommon.forwardLog](10-forwardLog.ts)

Afficher une valeur puis la retourner pour observer une composition.
 
### [DCommon.infer](10-infer.ts)

Inférer une contrainte à partir d’une valeur littérale dans une expression typée.
 
### [DCommon.innerPipe](10-innerPipe.ts)

Composer plusieurs transformations dans une fonction réutilisable.
 
### [DCommon.instanceOf](10-instanceOf.ts)

Créer un prédicat basé sur un constructeur avec narrowing de l’instance.
 
### [DCommon.isType](10-isType.ts)

Construire un prédicat de type à partir d’un type runtime.
 
### [DCommon.justExec](10-justExec.ts)

Encapsuler une logique impérative locale et affecter directement son résultat.
 
### [DCommon.justReturn](10-justReturn.ts)

Fournir une valeur déjà calculée à une étape de pipe sans écrire de callback.
 
### [DCommon.loop](10-loop.ts)

Contrôler une boucle synchrone avec un compteur et une sortie typée.
 
### [DCommon.memo](10-memo.ts)

Évaluer une fonction au premier accès puis mémoriser sa valeur.
 
### [DCommon.memoObject](10-memoObject.ts)

Exposer un objet calculé paresseusement tout en mémorisant son contenu.
 
### [DCommon.memoPromise](10-memoPromise.ts)

Mémoriser le résultat d’un calcul synchrone ou asynchrone.
 
### [DCommon.or](10-or.ts)

Combiner plusieurs prédicats en une condition satisfaite par au moins l’un d’eux.
 
### [DCommon.pipe](10-pipe.ts)

Appliquer une suite de transformations de gauche à droite.
 
### [DCommon.pipeCall](10-pipeCall.ts)

Corriger l’inférence d’une fonction sans générique utilisée dans un pipe.
 
### [DCommon.prepareAsyncPipe](10-prepareAsyncPipe.ts)

Préparer une fabrique de pipelines asynchrones partageant une contrainte d’entrée.
 
### [DCommon.preparePipe](10-preparePipe.ts)

Préparer une fabrique de pipelines partageant une contrainte d’entrée.
 
### [DCommon.promiseAll](10-promiseAll.ts)

Attendre un tuple ou un itérable de promesses en conservant la forme du tuple.
 
### [DCommon.promiseObject](10-promiseObject.ts)

Attendre toutes les propriétés promises d’un objet et reconstruire l’objet résolu.
 
### [DCommon.removeConstraint](10-removeConstraint.ts)

Retirer les contraintes DuploJS d’un type tout en conservant sa forme de valeur.
 
### [DCommon.shameOnYou](10-shameOnYou.ts)

Contourner explicitement une contrainte attendue dans un contrat de type.
 
### [DCommon.simpleClone](10-simpleClone.ts)

Créer une copie superficielle d’une valeur clonable.
 
### [DCommon.stringToBytes](10-stringToBytes.ts)

Convertir une quantité en octets écrite avec une unité ou déjà numérique.
 
### [DCommon.stringToMillisecond](10-stringToMillisecond.ts)

Additionner des durées écrites avec une unité ou exprimées en millisecondes.
 
### [DCommon.timeout](10-timeout.ts)

Créer une promise résolue après un délai en millisecondes.
 
### [DCommon.toCurriedPredicate](10-toCurriedPredicate.ts)

Adapter un prédicat non générique vers la forme curifiée attendue par une fonction.
 
### [DCommon.toJSON](10-toJSON.ts)

Transformer récursivement les valeurs DuploJS vers leur représentation JSON.
 
### [DCommon.toNative](10-toNative.ts)

Transformer récursivement les valeurs DuploJS qui exposent `toNative`.
 
### [DCommon.toRegExp](10-toRegExp.ts)

Convertir une chaîne, un tuple de chaînes ou une expression régulière en `RegExp`.
 
### [DCommon.transformer](10-transformer.ts)

Appliquer récursivement une méthode sans argument aux objets, tableaux et valeurs imbriqués.
 
### [DCommon.truthy](10-truthy.ts)

Identifier les valeurs truthy et retirer les valeurs falsy de leur union.
 
### [DCommon.useAsyncRetry](10-useAsyncRetry.ts)

Réessayer une opération asynchrone selon son résultat et une limite d’essais.
 
### [DCommon.when](10-when.ts)

Transformer une valeur uniquement lorsqu’un prédicat est satisfait.
 
### [DCommon.whenElse](10-whenElse.ts)

Choisir une transformation selon le résultat d’un prédicat.
 
### [DCommon.whenNot](10-whenNot.ts)

Transformer une valeur uniquement lorsqu’un prédicat n’est pas satisfait.
 
