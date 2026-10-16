# Placer les hooks et intercepteurs

Le client porte les comportements communs : `addRequestHook`, `addResponseHook`, `addErrorHook` et les hooks ciblant une information, un code ou une famille de réponses. Les hooks de requête et de réponse peuvent transformer leur entrée ; retourner la valeur destinée à la suite du cycle. Les réactions globales telles que les loaders ou la journalisation se placent à ce niveau.

Chaque appel retourne une `PromiseRequest`, représentation de cet échange. Lui attacher immédiatement les traitements locaux avant `await` : les `when*` enregistrent des callbacks et renvoient la même `PromiseRequest`. Ils permettent de composer plusieurs réactions sans sélectionner ni extraire le résultat. `addRequestInterceptor` et `addResponseInterceptor` permettent les transformations locales. `whenError` traite une erreur de requête ; `whenNotPredictedResponse` observe une réponse sans marqueur lorsque le mode de réponses prévues est actif.

Après les hooks locaux, choisir l’attente ou le sélecteur selon [le résultat voulu](responses.md). Pour ajouter un loader ou une instrumentation globale, lire `docs/concepts/03-client/10-http/30-hook.ts` depuis le package installé : cet exemple suit les effets communs pendant le cycle d'un échange.
