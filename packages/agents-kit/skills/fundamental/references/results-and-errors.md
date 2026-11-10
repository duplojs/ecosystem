# Résultats et erreurs

## Choisir le contrat

Une fonction qui établit des états sans décider lesquels conviennent à l'appelant produit des `DEither.Result` nommés. Tous sont des `Right` ; les distinguer par leur information.

Une fonction qui décide d'une réussite ou d'un refus prévisible les exprime en `Right` ou `Left`, y compris pour les absences et refus techniques. Toutes ses branches renvoient un `Either` ; `DEither.ok()` représente une réussite sans valeur.

## Sélectionner et poursuivre

| Intention du consommateur | Outil |
| --- | --- |
| Autoriser certaines informations et refuser toutes les autres, même futures | `keepAsRightByInformation` |
| Décider explicitement du statut de chaque variante | `keepAsRightSelection` |
| Décider explicitement des variantes d'une garde | `isSelected` |
| Traiter chaque information | `matchInformation` |

Les sélecteurs exhaustifs imposent de revoir la décision lorsqu'une variante apparaît. Une sélection partielle ou un repli exprime au contraire un comportement commun voulu.

Le reclassement conserve information et valeur. `unwrapRight` extrait les valeurs acceptées et conserve les `Left` : une garde `isLeft` peut ensuite retourner le refus. Si le contrat garantit uniquement des `Right` admis, l'extraction peut être directe. Voir [la sélection et le retour anticipé](examples/result-selection.ts).

Pour sélectionner à une étape d'un `rightPipe` avant son déballage automatique, lire [Composition](composition.md#asynchronisme-et-résultats).

## Propager ou adapter un refus

Une fonction réutilisable transmet ses refus à l'appelant, qui peut les propager, les adapter ou récupérer. Une absence exploitable reste un résultat, même issue d'une I/O. Voir [la propagation d'une erreur de lecture](examples/error-propagation.ts).

Préférer une API sûre. Si une API lève sur un refus documenté, `safeCallback` ou `asyncSafeCallback` permettent sa capture ; examiner la cause avant de la traduire. Une défaillance imprévue déjà levée remonte implicitement. Si elle est capturée, conserver sa cause dans le résultat jusqu'à la consommation finale, sans la requalifier en refus métier ni la relancer dans l'adaptation.

## Consommer le résultat final

Réserver `throw` et `OrThrow` au code qui décide de la conséquence finale : réponse, diagnostic ou interruption du programme. Une fonction appelée depuis cette frontière reste responsable de transmettre ses résultats.

Au démarrage, une configuration invalide peut empêcher l'exécution : voir [l'initialisation](examples/environment-initialization.ts). Dans un test, `OrThrow` peut affirmer un résultat ou préparer une fixture ; le code testé conserve ses refus typés. Pour les constantes prouvables, préférer les [déclarations sûres](examples/safe-declarations.ts).
