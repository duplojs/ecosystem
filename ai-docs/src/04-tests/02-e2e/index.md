# Tests E2E

`@duplojs/playwright` organise Playwright autour du site teste.

La suite nomme les parties du parcours : `Website` pour le contexte global,
`Page` pour les ecrans navigables, `Component` pour les zones reutilisables.

Le test reste un test Playwright, mais il se lit comme une specification :
naviguer, recuperer une page ou un composant, agir, verifier un etat. Les
locators restent dans les objets qui representent l'interface.
