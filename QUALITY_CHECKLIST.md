# Charte qualité de Pro Cast

Principe directeur : **je sais toujours ce qui vient de se passer, rien ne disparaît sans mon accord et je peux corriger mon choix.**

## Invariants fonctionnels

- [ ] Toute action importante est réversible ou demande une confirmation explicite.
- [ ] Terminer une tâche la termine dans toutes ses représentations et dans tous ses blocs.
- [ ] Retirer une tâche d’un bloc ne supprime jamais la tâche.
- [ ] Supprimer un bloc conserve toutes ses tâches.
- [ ] Reporter un bloc déplace son occurrence sans la dupliquer.
- [ ] Une tâche peut appartenir à plusieurs blocs tout en restant une seule tâche.
- [ ] Archiver un scénario, un motif ou un décor conserve son historique.
- [ ] Pro et Perso ne modifient jamais les données l’un de l’autre.
- [ ] Une clôture manquée reste disponible et les clôtures fusionnées ne dupliquent pas les tâches.
- [ ] Un rituel validé ne réapparaît pas avant sa prochaine échéance.

## Cohérence de l’interface

- [ ] Les cartes Scène ont la même structure dans Têtes d’affiche, Plan et Planning.
- [ ] Glisser à gauche place une scène en Tête d’affiche.
- [ ] Glisser à droite ouvre les actions, avec « Faite » en premier.
- [ ] Toute action par geste possède une alternative visible ou découvrable.
- [ ] Chaque action donne immédiatement un retour visuel ou textuel.
- [ ] Les états terminée, abandonnée, reportée, archivée et Tête d’affiche sont distincts.
- [ ] Les boutons indisponibles expliquent pourquoi ils le sont.

## Données et résilience

- [ ] Une actualisation conserve les tâches, blocs, rituels, motifs, décors et réglages.
- [ ] Sauvegarder inclut toutes les collections de données.
- [ ] Restaurer récupère toutes les collections sans perdre la sauvegarde précédente.
- [ ] Annuler ou fermer un formulaire n’enregistre pas de modification involontaire.
- [ ] Les doublons d’identifiants et les références vers des tâches inexistantes sont détectés.
- [ ] L’app reste utilisable si Google Agenda est indisponible.
- [ ] Le changement de jour, de semaine ou d’heure d’été ne décale pas les dates.

## Mobile et accessibilité

- [ ] Le parcours complet fonctionne à 320 px de large et sur un iPhone récent.
- [ ] Le clavier ne masque jamais l’action principale.
- [ ] Les zones tactiles importantes font au moins 44 × 44 points lorsque possible.
- [ ] Les panneaux respectent les zones sûres iOS.
- [ ] Le mode sombre conserve un contraste lisible.
- [ ] Les boutons composés uniquement d’une icône possèdent un nom accessible.
- [ ] Le parcours reste réalisable sans geste précis ou prolongé.

## Contrôle avant déploiement

1. Exécuter `node scripts/quality-check.mjs`.
2. Tester une création, une modification, une annulation et une restauration de tâche.
3. Tester les gestes gauche et droite dans Têtes d’affiche, Plan, Planning et un bloc.
4. Tester une préparation quotidienne, une clôture et une préparation hebdomadaire.
5. Tester séparément Pro et Perso.
6. Actualiser la page au milieu d’un parcours et vérifier les données conservées.
7. Tester à 390 × 844 puis à 320 × 568, en modes clair et sombre.
8. Sauvegarder les données, restaurer le fichier, puis comparer les totaux.

Le déploiement est autorisé uniquement si le contrôle automatisé réussit et si aucun point critique de cette liste n’est en échec.
