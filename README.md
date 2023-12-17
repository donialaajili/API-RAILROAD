# Railroad API

## Introduction

### Bienvenue sur l'API railroad !

RailRoad Ltd est une entreprise qui vise à produire la meilleure expérience pour vos déplacements locaux et nationaux.

Cette API vous permettra d'accéder aux informations des différentes gares et autres données.

Elle s'occupe également de la gestion des différentes informations et autorisations concernant la gestions des données.

## Pré-requis

Pour utiliser l'API vous devrez d'abord vous assurer d'avoir **Node**, **NPM** ainsi que **MongoDB Compass** d'installés sur votre machine.

Cette dernière a été developpée et testée sous la version 21.0.0 pour **Node** et sous la version 10.2.0 pour **NPM**.

N'ayant pas été testée avec d'autres versions, nous ne garantissons pas son bon fonctionnement le cas échéant.

Vous devrez également vous assurer qu'aucun service n'écoute sur les port suivants : 
- `27017` étant utilisé par MongoDB Compass
- `8080` utilisé par notre API 

## Premiers pas

Dernière étape avant de pouvoir lancer l'API, vous devez ouvrir un terminal à la racine du projet et entrer la commande `npm install`.

Cela vous permettra d'installer toutes les dépendances nécessaires au bon fonctionnement de l'API.

### Vous pouvez désormais lancer l'API !

Toujours dans un terminal à la racine du projet, il ne vous reste plus qu'à saisir la commande `npm run server`.

Vous verrez alors apparaître dans votre terminal le port sur lequel s'exécute l'API, l'adresse de la documentation ainsi que le status de la connexion à la base de données.

## Tests

Une batterie de tests est également à votre disposition, pour la lancer il vous suffit de saisir la commande `npm run test` dnas le terminal à la racine du projet.

>**ATTENTION !** L'exécution des tests effacera toutes les données présentent sur la base de données. Assurez-vous d'avoir une sauvegarde de vos données importantes avec de lancer le script.