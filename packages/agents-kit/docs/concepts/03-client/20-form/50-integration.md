## Intégrer un formulaire dans une page Vue

Séparer la logique d'un formulaire de son rendu dans une page Vue.

---

Une séparation recommandée consiste à construire le formulaire et à regrouper ses opérations dans un composable. La page consomme son interface et reste centrée sur la présentation ; Form n'impose pas cette organisation.

Dans [usePostModeration.ts](./examples/postModeration/usePostModeration.ts), le composable configure les champs, choisit la variante, valide la soumission et libère le formulaire à la fin du scope Vue. Il expose le composant `ModerationForm` et les seuls états et actions utiles à la page. En cas de validation réussie, il utilise la valeur validée ; les erreurs restent affichées par les templates du formulaire.

[ThePage.vue](./examples/postModeration/ThePage.vue) monte ce composant, place le bouton de soumission dans son slot par défaut et relie son événement `submit` à l'opération du composable. Les boutons de décision illustrent le changement de variante depuis l'interface.
