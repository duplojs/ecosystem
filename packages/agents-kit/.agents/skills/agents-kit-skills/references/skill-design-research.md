# Rédaction des skills pour des modèles moins performants

État des recherches consultées le 16 octobre 2026. Cette référence conserve les fondements des recommandations du skill interne ; elle se consulte pour revoir leur justification ou préparer une comparaison. Les choix proposés pour AgentKit n'ont pas encore été évalués sur DuploJS avec les modèles cibles.

## Sources et portée des résultats

- **[OpenAI — Build skills](https://learn.chatgpt.com/docs/build-skills).** La sélection utilise d'abord le nom et la description, puis les instructions du skill sont chargées lorsqu'il est utilisé. Les recommandations privilégient une tâche bien délimitée et des étapes avec entrées et sorties explicites. Cela décrit le fonctionnement et les pratiques recommandées, pas une comparaison expérimentale des organisations possibles d'AgentKit.
- **[Anthropic — Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).** Le guide recommande un chargement progressif, des références peu imbriquées et des essais avec tous les modèles visés. Il précise qu'un modèle économique peut avoir besoin de davantage d'indications qu'un modèle puissant. Ses limites de longueur sont des recommandations de fournisseur, pas des seuils optimaux démontrés pour DuploJS.
- **[SkillsBench, version initiale](https://arxiv.org/html/2602.12670v1).** Les skills sélectionnés améliorent les résultats moyens, avec une forte variation selon les tâches et les environnements d'exécution. Un petit modèle bénéficie des instructions procédurales dans les essais rapportés. Les analyses favorisent des contenus ciblés plutôt qu'exhaustifs, mais comparent des groupes de tâches et de skills différents : elles ne démontrent pas un optimum universel de longueur ou de nombre de skills. Les auteurs signalent le besoin de contrôles supplémentaires pour isoler les effets de la structure et du volume de contexte.
- **[Evaluating AGENTS.md, version initiale](https://arxiv.org/html/2602.11988v1).** Sur les tâches et agents étudiés, les fichiers de contexte entraînent davantage d'exploration et de coût, sans gain systématique de résolution. L'étude porte sur des fichiers de contexte de dépôt, principalement dans des projets Python ; elle ne prouve pas qu'une lecture conceptuelle ciblée soit inutile dans un écosystème spécialisé.
- **[SWE-Skills-Bench, version initiale](https://arxiv.org/html/2603.15401v1).** L'effet des skills de développement étudiés est limité et variable ; certaines instructions spécialisées aident, d'autres ajoutent des tokens ou dégradent les résultats lorsque leurs conventions de version contredisent le projet. Ce benchmark ne compare pas directement les trois organisations envisagées pour AgentKit.

## Recommandation retenue pour AgentKit

Un skill transmet dès son chargement les concepts pratiques indispensables, les invariants et les critères de choix. Les explications complètes et variantes restent accessibles par des liens directs, avec des conditions de lecture reconnaissables dans la tâche. Les concepts conservent leur rôle de référence ; un résumé opérationnel cohérent peut éviter une recherche supplémentaire.

Le déclenchement d'une lecture importante repose sur une situation observable, par exemple une preuve exigée par un contrat. Le laisser au seul sentiment de doute du modèle suppose qu'il reconnaisse lui-même ce qu'il ignore. Cette précaution et l'organisation retenue sont des déductions de conception à tester, pas des gains mesurés sur AgentKit.

La quantité de texte seule ne décide pas de l'efficacité : une explication supplémentaire peut éviter plusieurs lectures ou corrections. Conserver une rédaction commune aux modèles cibles, puis renforcer les passages dont les erreurs observées montrent l'insuffisance. Ne pas figer un quota de tokens, un nombre de références ou une variante de skill par modèle à partir de ces études.

## Comparer les rédactions

Pour une révision importante, choisir des tâches représentatives des décisions enseignées et comparer la rédaction actuelle à la proposition. Si nécessaire, isoler le compromis documentaire avec trois versions : contenu complet dans le skill, lecture conceptuelle systématique, ou concepts pratiques et lectures conditionnelles. Garder les mêmes connaissances disponibles pour que la comparaison porte sur leur organisation.

Fixer le modèle exact, l'effort de raisonnement, l'outil qui exécute l'agent, les ressources accessibles, l'état du projet et le budget. Répéter les tâches avec des sessions indépendantes pour limiter l'effet d'un essai isolé. Les premières cibles évoquées sont Luna en effort moyen et élevé, ainsi que des versions précises de GLM et d'autres modèles économiques ; cela ne constitue pas un classement de leurs capacités.

Vérifier les exigences de la tâche avec le typage, les tests pertinents et la lecture des garanties d'architecture. Observer aussi les API inventées, assertions injustifiées, garanties fabriquées ou effets exécutés après un refus. Mesurer les lectures, appels d'outils, tokens d'entrée, de sortie et de raisonnement disponibles, durée et coût. Comptabiliser les échecs et reprises dans le coût rapporté aux tâches réussies, en signalant les métriques indisponibles.

Séparer les conclusions de l'essai des hypothèses de rédaction. Un gain sur une tâche ou un modèle ne garantit pas le même effet ailleurs ; conserver les versions et résultats qui permettent de reproduire la comparaison.
