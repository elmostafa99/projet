/* ===========================================================
   pages/detailsUtilisateur.js — Détails d'un utilisateur (Admin)
   Route : #details/:id
   =========================================================== */

const PageDetailsUtilisateur = {
  render(container, id) {
    container.innerHTML = `<p>Chargement…</p>`;

    if (!id) {
      container.innerHTML = `<div class="empty-state">Identifiant manquant.</div>`;
      return;
    }

    Api.getOne(id)
      .then((u) => {
        const fields = [
          ["Pseudo", u.pseudo],
          ["Nom", u.nom],
          ["Prénom", u.prenom],
          ["Âge", u.age],
          ["Email", u.email],
          ["Pays", u.Pays],
          ["Devise", u.Devise],
          ["Rôle", u.admin ? "Admin" : "Visiteur"],
          ["Couleur", u.couleur],
        ];

        container.innerHTML = `
          <a href="#utilisateurs" class="action-link view">&larr; Retour à la liste</a>
          <h1 class="page-title">Détails de ${u.prenom || ""} ${u.nom || ""}</h1>
          <div class="card">
            <div class="profile-grid">
              ${fields
                .map(
                  ([k, v]) => `
                <div class="profile-item">
                  <div class="k">${k}</div>
                  <div class="v">${v !== undefined && v !== "" ? v : "—"}</div>
                </div>`
                )
                .join("")}
            </div>
          </div>
          <a href="#modifier/${u.id}" class="btn-secondary" style="text-decoration:none; display:inline-block;">Modifier cet utilisateur</a>
        `;
      })
      .catch((err) => {
        container.innerHTML = `<div class="empty-state">Utilisateur introuvable.</div>`;
        console.error(err);
      });
  },
};
