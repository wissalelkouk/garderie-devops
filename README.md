# Garderie DevOps

Site web d'une garderie (crèche) avec une chaîne **CI/CD complète** : le code est récupéré depuis GitHub, construit en images Docker par **Jenkins**, puis publié sur **Docker Hub**.

Le projet sert à la fois d'application web (frontend + backend) et de démonstration d'une démarche DevOps (conteneurisation, pipeline automatisé, tests).

---

## Sommaire

1. [Architecture](#architecture)
2. [Technologies](#technologies)
3. [Structure du projet](#structure-du-projet)
4. [Prérequis](#prérequis)
5. [Lancer le projet en local](#lancer-le-projet-en-local)
6. [Docker](#docker)
7. [Pipeline CI/CD Jenkins](#pipeline-cicd-jenkins)
8. [Images Docker Hub](#images-docker-hub)
9. [Tests](#tests)
10. [Dépannage](#dépannage)
11. [Sécurité](#sécurité)
12. [Améliorations prévues](#améliorations-prévues)
13. [Auteure](#auteure)

---

## Architecture

```
┌──────────────┐     HTTP      ┌──────────────┐
│   Frontend   │ ────────────► │   Backend    │
│  Next.js     │  BACKEND_URL  │  Node.js     │
│  port 3000   │               │  port 5000   │
└──────────────┘               └──────────────┘

GitHub ──► Jenkins ──► docker build ──► Docker Hub
                       (frontend + backend)
```

- Le **frontend** affiche le site (page d'accueil, services, navigation).
- Le **backend** expose l'API utilisée par le frontend.
- Le frontend joint le backend grâce à la variable `BACKEND_URL` (par défaut `http://backend:5000` dans Docker).

## Technologies

| Domaine | Outil |
|---|---|
| Frontend | Next.js 16 (Turbopack), React |
| Backend | Node.js 20 |
| Tests | Jest |
| Conteneurisation | Docker (image de base `node:20-alpine`) |
| Intégration continue | Jenkins (pipeline déclaratif, `Jenkinsfile`) |
| Registre d'images | Docker Hub |
| Versionnage | Git / GitHub |

## Structure du projet

```
garderie-devops/
├── backend/
│   ├── server.js            # Point d'entrée de l'API
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile           # Image du backend (port 5000)
│   └── .dockerignore
├── frontend/
│   ├── app/                 # Pages et routes Next.js
│   ├── components/
│   │   ├── Hero.js          # Bannière d'accueil
│   │   ├── Navbar.js        # Barre de navigation
│   │   └── Services.js      # Présentation des services
│   ├── public/              # Fichiers statiques (images, icônes)
│   ├── __tests__/           # Tests Jest
│   ├── jest.config.js
│   ├── next.config.mjs
│   ├── package.json
│   ├── Dockerfile           # Image du frontend (port 3000)
│   └── .dockerignore
├── Jenkinsfile              # Définition du pipeline CI/CD
├── docker-compose.yml       # Lancement des deux services (si présent)
├── .gitignore
├── AGENTS.md
└── README.md
```

## Prérequis

- **Node.js 20** et **npm** (pour le développement local)
- **Docker** (pour construire et lancer les images)
- **Git**
- Un compte **Docker Hub** (pour publier les images)
- **Jenkins** avec le plugin Docker/Pipeline et un accès au démon Docker (pour la CI/CD)

## Lancer le projet en local

### Backend

```bash
cd backend
npm install
npm start
```

L'API écoute sur **http://localhost:5000**.

### Frontend

```bash
cd frontend
npm install
BACKEND_URL=http://localhost:5000 npm run dev
```

Le site est disponible sur **http://localhost:3000**.

Sous Windows (PowerShell) :

```powershell
$env:BACKEND_URL="http://localhost:5000"; npm run dev
```

### Build de production du frontend

```bash
cd frontend
npm run build
npm start
```

## Docker

### Construire les images

```bash
docker build -t wissl/garderie-backend:latest ./backend
docker build -t wissl/garderie-frontend:latest ./frontend
```

Le frontend accepte l'argument de build `BACKEND_URL` :

```bash
docker build --build-arg BACKEND_URL=http://backend:5000 -t wissl/garderie-frontend:latest ./frontend
```

### Lancer les conteneurs

```bash
docker network create garderie-net

docker run -d --name backend  --network garderie-net -p 5000:5000 wissl/garderie-backend:latest
docker run -d --name frontend --network garderie-net -p 3000:3000 wissl/garderie-frontend:latest
```

Le nom du conteneur `backend` correspond à l'adresse `http://backend:5000` utilisée par le frontend.

### Dockerfile backend

1. Part de `node:20-alpine`.
2. Copie `package*.json`, puis installe les dépendances de production (`npm install --omit=dev`).
3. Copie le code, expose le port **5000** et démarre avec `npm start`.

### Dockerfile frontend

1. Part de `node:20-alpine`.
2. Installe les dépendances (`npm install`).
3. Définit `BACKEND_URL`, puis compile avec `npm run build`.
4. Expose le port **3000** et démarre avec `npm start`.

> **Conseil :** pour réduire fortement la taille de l'image frontend (et accélérer les `docker push`), utilisez un **build multi-étapes** avec `output: 'standalone'` dans `next.config.mjs`. Voir la section [Améliorations prévues](#améliorations-prévues).

## Pipeline CI/CD Jenkins

Le pipeline est décrit dans le `Jenkinsfile` à la racine du dépôt.

| # | Stage | Rôle |
|---|---|---|
| 1 | **Checkout** | Récupère le code depuis GitHub (branche `main`). |
| 2 | **Install** | Configure npm (timeouts et tentatives) puis installe les dépendances du frontend. |
| 3 | **Build Frontend** | `docker build` de l'image `wissl/garderie-frontend:latest`. |
| 4 | **Build Backend** | `docker build` de l'image `wissl/garderie-backend:latest`. |
| 5 | **Push Frontend** | Connexion à Docker Hub, puis `docker push` de l'image frontend. |
| 6 | **Push Backend** | `docker push` de l'image backend. |
| 7 | **Post Actions** | `docker logout` pour ne pas laisser d'identifiants sur la machine. |

Si un stage échoue, les stages suivants sont ignorés.

### Identifiants Docker Hub dans Jenkins

Le pipeline utilise un credential Jenkins de type *Username with password* (variable `DOCKERHUB_CREDS` dans le `Jenkinsfile`) :

- **Username** : votre nom d'utilisateur Docker Hub (`wissl`)
- **Password** : un **Personal Access Token** Docker Hub avec les droits *Read & Write*

Pour créer un token : Docker Hub → *Account Settings* → *Personal access tokens*.

### Réglages npm contre les coupures réseau

Le pipeline applique ces réglages avant `npm install` :

```bash
npm config set fetch-timeout 600000
npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 20000
```

## Images Docker Hub

| Image | Description |
|---|---|
| `wissl/garderie-frontend` | Site Next.js (port 3000) |
| `wissl/garderie-backend` | API Node.js (port 5000) |

Récupérer et lancer :

```bash
docker pull wissl/garderie-frontend:latest
docker pull wissl/garderie-backend:latest
```

## Tests

Les tests du frontend utilisent **Jest** :

```bash
cd frontend
npm test
```

## Dépannage

### `npm error code ECONNRESET` pendant `npm install`

Connexion coupée vers le registre npm (réseau lent ou instable).

- Relancer le build (les couches déjà en cache ne sont pas refaites).
- Garder les réglages `fetch-retries` / `fetch-timeout` ci-dessus.
- Tester la connexion : `npm ping` et `curl -I https://registry.npmjs.org`.
- Vérifier le proxy ou le DNS de la machine (ex. `"dns": ["8.8.8.8", "1.1.1.1"]` dans `/etc/docker/daemon.json`).

### `unauthorized: incorrect username or password` au `docker login`

- Le credential Jenkins est faux, expiré ou le token n'a pas les bons droits.
- Si la 2FA est activée sur Docker Hub, il faut obligatoirement un **Personal Access Token**.
- Tester à la main : `echo "<TOKEN>" | docker login -u wissl --password-stdin`.

### `net/http: timeout awaiting response headers` pendant `docker push`

Une grosse couche n'a pas pu être envoyée avant le timeout.

- Relancer la commande : Docker ne renvoie pas les couches déjà poussées.
  ```bash
  for i in 1 2 3 4 5; do docker push wissl/garderie-frontend:latest && break; sleep 20; done
  ```
- Limiter les envois parallèles dans `/etc/docker/daemon.json` :
  ```json
  { "max-concurrent-uploads": 1 }
  ```
  puis `sudo systemctl restart docker`.
- Alléger l'image (`.dockerignore`, build multi-étapes).
- Ajouter `retry(5)` autour des `docker push` dans le `Jenkinsfile`.

### Jenkins reconstruit une ancienne version

Jenkins clone le code depuis GitHub : pensez à enregistrer, `git commit` et `git push` avant de lancer un build.

## Sécurité

- **Ne jamais écrire de mot de passe ou de token** dans le code, le `Jenkinsfile` ou ce README. Utilisez les *Credentials* Jenkins.
- Si un token a été exposé (conversation, capture d'écran, dépôt), **révoquez-le** immédiatement et créez-en un nouveau.
- Ajoutez `node_modules`, `.next`, `.env` et `.git` aux fichiers `.dockerignore` et `.gitignore`.
- Activez l'authentification sur Jenkins si le serveur est accessible depuis l'extérieur.

## Améliorations prévues

- **Dockerfile frontend multi-étapes** avec `output: 'standalone'` (image de ~150-250 Mo au lieu de plus d'1 Go).
- Remplacer `npm install` par `npm ci` dans les Dockerfiles pour des builds reproductibles.
- Ajouter `retry` et `timeout` autour des pushs dans le `Jenkinsfile`.
- Étape de **tests automatisés** (`npm test`) dans le pipeline avant le build.
- Tags de version (par exemple le numéro de build ou le hash du commit) en plus de `latest`.
- Déploiement automatique (docker-compose, serveur, ou Kubernetes).

## Auteure

**Wissal El Kouk**
Dépôt : https://github.com/wissalelkouk/garderie-devops
