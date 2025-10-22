# **Lilo**

Lilo est une application mobile développée avec **React Native**, permettant aux utilisateurs de d'exprimer leur sentiment et à un admin de les consulter de façon anymisé grâce à une intégration avec **Strapi** pour la gestion des données.

[GitHub](https://github.com/AlixOrf/Lilo.git)


## **Table des Matières**

- [Prérequis](#prérequis)
- [Installation](#installation)
  - [Installation des dépendances JavaScript (frontend)](#installation-des-dépendances-javascript-frontend)
  - [Installation des dépendances Strapi (backend)](#installation-des-dépendances-strapi-backend)
- [Fonctionnalités](#fonctionnalités)
- [Lancement de l'application](#lancement-de-lapplication)
- [Structure du projet](#structure-du-projet)
- [Contributeurs](#contributeurs)

## **Prérequis**

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- **Node.js**
- Autres dépendances :
  - **Expo**
  - **react-native-chart-kit**
  - **strapi-plugin-multi-select**
  - **react-native-calendars**
  - **react-native-async-storage/async-storage** 
  - **react-native-safe-area-context** 

## **Installation**

### **Installation des dépendances JavaScript (frontend)**

Installez les dépendances JavaScript :

```bash
cd Front_Lilo
npm i
npx expo install
```
### **Installation des dépendances Strapi (backend)**
Installez les dépendances JavaScript :
```bash
cd Lilo
npm i
```

Activez l'environnement virtuel :

```bash
npm run develop
```
### **Modification des URL avec votre adresse IP**
```bash
Lilo/
├── Front_Lilo/      
    ├── app/             
        ├── (tabs)/    
          ├── home.tsx :
            -  l.88
            -  l.109
          ├── stat.tsx :
            - l.15
        ├── login/  
          ├── login.tsx : 
            - l.16
          ├── loginman.tsx : 
            - l.16    
        ├── man/
          ├── statman.tsx :
              - l.50 
              - l.68         
```
## **Fonctionnalités**

**Connexion en tant qu'employer :** Connexion en tant que employé de l'entreprise, pouvant entrer leur "mood" et les consulter. 

**Connexion en tant que manager :** Connexion en tant que manager de l'entreprise, pouvant visioner les "moods" de son equipe.

**Envoi de mood vers Strapi :** L'utilisateur entre dans l'application ses "moods" qui sont envoyé à Stapi et conservé.

**Graphiques des moods :** L'utilisateur (employé ou manager) peut visualiser les moods dans des graphique mensuel.

## **Lancement de l'application**
Démarrage du frontend avec Expo :

```bash
npx expo start
```

## **Structure du projet**
```bash
Lilo/
├── Front_Lilo/          # Front de l'application
    ├── app/             
        ├── (tabs)/      # Application Employé
        ├── components/  # Différents components de l'application
        ├── context/     # Permettant aux utilisateurs de rester connecté
        ├── login/       # Point d'entrée de l'application
        ├── man/         # Application Manager
├── Lilo                 # Application Strapi
└── README.md            # Documentation du projet
```

## **Contributeurs**
[Alix Orfeuvre](https://github.com/AlixOrf)
[Kiara Wurtz](https://github.com/Kiaraw)
[Esteban Videra Dumont](https://github.com/Esteban-13)
[Awab Maaloum](https://github.com/awab26)