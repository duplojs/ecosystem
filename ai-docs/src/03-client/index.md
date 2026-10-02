# Client

Le client est l'endroit où les données typées rencontrent l'interaction
utilisateur. C'est aussi l'endroit où la logique peut facilement se disperser :
requêtes écrites au cas par cas, formulaires propres à chaque écran,
comportements locaux difficiles à maintenir.

DuploJS cherche à ramener ces usages vers une forme plus déclarative et
constante. Les interactions sont décrites à partir de contrats et de
compositions, ce qui permet de garder un code homogène, fortement typé et
assez flexible pour couvrir des interfaces spécifiques sans abandonner le
modèle commun.
