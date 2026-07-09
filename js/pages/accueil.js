/* ===========================================================
   pages/accueil.js — Page d'accueil (visible admin + visiteur)
   =========================================================== */

const PageAccueil = {
  render(container) {
    const user = Storage.getUser();
    container.innerHTML = `
      <h1 class="page-title">Bienvenue, ${user.prenom || user.pseudo} 👋</h1>
      <p class="page-sub">Content de vous revoir sur votre espace personnel.</p>
      <div class="card">
        <p>Vous êtes connecté en tant que <strong>${
          user.admin ? "Administrateur" : "Visiteur"
        }</strong>.</p>
        <p>Utilisez le menu ci-dessus (ou sur le côté) pour naviguer entre les
        différentes sections de l'application : votre profil, la couleur de
        votre interface${
          user.admin
            ? ", la gestion des utilisateurs"
            : ""
        } et vos demandes.</p>
      </div>
    `;
  },
};
