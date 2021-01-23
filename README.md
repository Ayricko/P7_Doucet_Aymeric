# Groupomania - Projet7

7ème et dernier projet de ma formation OpenClassRooms. Le projet consistait à construire un réseau social interne pour les employés de l'entreprise Groupomania.

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

- [VueJs](https://vuejs.org/) - Framework (front-end)
- [NodeJs](https://nodejs.org/en/) - Runtime Engine (Back-end)
- [Express](https://nodejs.org/en/) - Framework (Back-end)
- [Sequelize](https://sequelize.org/) - ORM (Back-end)
- [MySql](https://www.mysql.com/fr/) - Base de donnée (Back-end)
- [VSC](https://code.visualstudio.com/) - Editeur de textes

## Démarrage

### Frontend:

Depuis le terminal de votre éditeur, placez vous dans le dossier front-end et exécuter la commande suivante:

`npm install`

Puis executer:

`npm run serve`

Rendez-vous ensuite à l'adresse suivante:
http://localhost:8080/

### Backend:

Depuis le terminal de votre éditeur, placez vous dans le dossier back-end et exécuter la commande suivante:

`npm install`

Puis executer:

`nodemon serve`

### Base de donnée:

Rendez-vous dans le dossier backend/config/config.json ou vous devrez modifier les champs `username` et `password` pour pouvoir vous connetcer à votre serveur MySql.

### MVP

Avec cette application Grouponmania vous pourrez:

- Creer votre compte avec une adresse mail et une mot de passe.
- Ajouter/modifier votre photo de profil, modifier vos informations de base (nom, prénom)
- Accèder aux publications des autres utilisateurs.
- Publier des posts avec ou sans photos.
- Commenter les posts.
- Modifier vos posts/commentaires, les supprimer, mais aussi signaler les posts/commentaires des autres utilisateurs pour les soumettres à l'administrateur.

## Auteurs

- **Aymeric Doucet** _alias_ [@Ayricko](https://github.com/Ayricko)
