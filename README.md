# Mini-Projet JavaScript — M105

Application web (HTML / CSS / JavaScript vanilla) réalisée selon le
cahier des charges "Mini-Projet Javascript" (ISTA Hay Salam — Formateur : Khalid MZIBRA).

## Structure du projet

```
mini-projet-js/
├── index.html              -> redirige vers login.html ou layout.html
├── login.html               -> page d'authentification (Partie B)
├── createAccount.html       -> page de création de compte (Partie C)
├── layout.html               -> coquille applicative SPA (Partie D)
├── css/
│   └── style.css
├── js/
│   ├── api.js                -> requêtes fetch CRUD vers mockapi.io (Partie F)
│   ├── storage.js             -> gestion sessionStorage / localStorage (Partie A)
│   ├── login.js
│   ├── createAccount.js
│   ├── layout.js              -> header, nav, index, routeur (hash routing)
│   └── pages/
│       ├── accueil.js
│       ├── profile.js              -> VoirMonProfile
│       ├── modifierCouleur.js
│       ├── listeUtilisateurs.js
│       ├── detailsUtilisateur.js
│       ├── modifierUtilisateur.js
│       ├── ajouterUtilisateur.js
│       └── demandes.js             -> Partie E (demandes / workflow)
└── README.md
```

## Lancer le projet

Comme l'application utilise `fetch` et le hash-routing, il est préférable
de la servir via un petit serveur local plutôt que d'ouvrir les fichiers
directement avec `file://`.

Avec Python :
```bash
cd mini-projet-js
python3 -m http.server 8080
```
Puis ouvrez `http://localhost:8080/login.html`.

Ou avec l'extension VSCode "Live Server".

## Fonctionnement général

- **Stockage client** : l'utilisateur authentifié est stocké dans
  `sessionStorage` (`storage.js`). Il est supprimé à la déconnexion.
- **API** : toutes les opérations CRUD passent par
  `https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire` (`api.js`).
- **Routage** : `layout.html` est une mini-SPA : le menu (NavigationBar
  horizontale + Index verticale) change le hash de l'URL
  (`#accueil`, `#profile`, `#couleur`, `#utilisateurs`,
  `#details/:id`, `#modifier/:id`, `#ajouter`, `#demandes`), et
  `layout.js` affiche le composant correspondant dans `#content-section`.
- **Rôles** : le menu et l'accès aux pages changent selon `admin` (voir
  tableau de la partie D du sujet).
- **Demandes** (partie E) : comme l'API fournie ne gère pas les
  demandes, elles sont simulées via `localStorage` (`Storage.addDemande`,
  etc.) — à remplacer par de vrais appels API si un endpoint dédié est
  ajouté.

## Pistes d'amélioration (point G.3)

- Pagination / recherche sur `ListeUtilisateurs`
- Vraie API pour les demandes (au lieu de localStorage)
- Tests unitaires (Jest) sur la validation des formulaires
- Thème sombre basé sur la couleur préférée de l'utilisateur
