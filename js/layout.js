/* ===========================================================
   layout.js — Coquille applicative : header, nav, index, footer
   et routeur basé sur le hash de l'URL (#accueil, #profile, ...)
   =========================================================== */

// --- Garde de session : redirection si non connecté ---
if (!Storage.isLoggedIn()) {
  window.location.replace("login.html");
}

const currentUser = Storage.getUser();

// --- Couleur d'arrière-plan lue depuis le stockage client ---
if (currentUser && currentUser.couleur) {
  document.body.style.backgroundColor = currentUser.couleur;
}

// --- Header : nom, prénom, déconnexion ---
document.getElementById("header-username").textContent =
  `${currentUser.prenom || ""} ${currentUser.nom || ""}`.trim() || currentUser.pseudo;

document.getElementById("logout-btn").addEventListener("click", () => {
  Storage.clearUser();
  window.location.href = "login.html";
});

/* ---------- Définition du menu ---------- */
// route : identifiant utilisé dans le hash (#route)
// render : fonction exposée par le fichier de page correspondant
const MENU_ADMIN = [
  { route: "accueil", label: "Accueil", render: PageAccueil.render },
  { route: "profile", label: "Mon Profil", render: PageProfile.render },
  { route: "couleur", label: "Modifier Couleur", render: PageModifierCouleur.render },
  { route: "utilisateurs", label: "Liste Utilisateurs", render: PageListeUtilisateurs.render },
  { route: "ajouter", label: "Ajouter Utilisateur", render: PageAjouterUtilisateur.render },
  { route: "demandes", label: "Demandes", render: PageDemandes.render },
];

const MENU_VISITEUR = [
  { route: "accueil", label: "Accueil", render: PageAccueil.render },
  { route: "profile", label: "Mon Profil", render: PageProfile.render },
  { route: "couleur", label: "Modifier Couleur", render: PageModifierCouleur.render },
  { route: "demandes", label: "Mes Demandes", render: PageDemandes.render },
];

const menu = Storage.isAdmin() ? MENU_ADMIN : MENU_VISITEUR;

/* ---------- Rendu de la navigation horizontale et verticale ---------- */
function renderMenus(activeRoute) {
  const navEl = document.getElementById("app-nav");
  const indexEl = document.getElementById("app-index");
  navEl.innerHTML = "";
  indexEl.innerHTML = "";

  menu.forEach((item) => {
    const a1 = document.createElement("a");
    a1.href = `#${item.route}`;
    a1.textContent = item.label;
    if (item.route === activeRoute) a1.classList.add("active");
    navEl.appendChild(a1);

    const a2 = document.createElement("a");
    a2.href = `#${item.route}`;
    a2.textContent = item.label;
    if (item.route === activeRoute) a2.classList.add("active");
    indexEl.appendChild(a2);
  });
}

/* ---------- Routeur ---------- */
const contentEl = document.getElementById("content-section");

function baseRoute(hash) {
  // gère les routes paramétrées type #details/3 -> "details"
  return hash.replace("#", "").split("/")[0];
}

function router() {
  const hash = window.location.hash || "#accueil";
  const routeName = baseRoute(hash) || "accueil";
  const param = hash.split("/")[1]; // ex : id pour #details/3

  const found = menu.find((m) => m.route === routeName);

  renderMenus(routeName);

  if (found) {
    contentEl.innerHTML = "";
    found.render(contentEl, param);
    return;
  }

  // Routes secondaires non présentes dans le menu (détails / modifier)
  if (routeName === "details" && Storage.isAdmin()) {
    contentEl.innerHTML = "";
    PageDetailsUtilisateur.render(contentEl, param);
    return;
  }
  if (routeName === "modifier" && Storage.isAdmin()) {
    contentEl.innerHTML = "";
    PageModifierUtilisateur.render(contentEl, param);
    return;
  }

  contentEl.innerHTML = `<div class="empty-state">Page introuvable.</div>`;
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
