# Tests E2E

`@duplojs/playwright` est une couche d'organisation au-dessus de Playwright.
Elle ne remplace pas les locators, les assertions ni le runner Playwright :
elle aide surtout a ranger le test autour du site qu'on manipule.

L'idee est de donner des noms aux parties importantes du parcours : un
`Website` pour le contexte global, des `Page` pour les ecrans navigables et
des `Component` pour les morceaux d'interface que l'on reutilise.

Un test reste donc un test Playwright, mais il se lit plus naturellement :
aller sur une page, recuperer un composant, faire une action, verifier un
etat. Quand la suite grossit, cette structure evite de recopier les memes
locators et les memes intentions dans chaque spec.
