/* ===========================================================
   pages/listeUtilisateurs.js — Liste des utilisateurs (Admin)
   CRUD : Voir détails / Modifier / Supprimer
   =========================================================== */

const PageListeUtilisateurs = {
  render(container) {
    container.innerHTML = `
      <h1 class="page-title">Liste des Utilisateurs</h1>
      <p class="page-sub">Gestion complète des comptes (CRUD).</p>
      <div class="card" id="table-wrapper">
        <p>Chargement des utilisateurs…</p>
      </div>
    `;

    const wrapper = document.getElementById("table-wrapper");

    Api.getAll()
      .then((users) => {
        if (!users.length) {
          wrapper.innerHTML = `<div class="empty-state">Aucun utilisateur trouvé.</div>`;
          return;
        }

        wrapper.innerHTML = `
          <table class="data-table">
            <thead>
              <tr>
                <th>Pseudo</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map(
                  (u) => `
                <tr>
                  <td>${u.pseudo || ""}</td>
                  <td>${u.nom || ""}</td>
                  <td>${u.prenom || ""}</td>
                  <td>${u.email || ""}</td>
                  <td>${u.admin ? "Admin" : "Visiteur"}</td>
                  <td>
                    <a class="action-link view" data-action="view" data-id="${u.id}">Voir</a>
                    <a class="action-link edit" data-action="edit" data-id="${u.id}">Modifier</a>
                    <a class="action-link delete" data-action="delete" data-id="${u.id}">Supprimer</a>
                  </td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        `;

        wrapper.querySelectorAll("[data-action]").forEach((el) => {
          el.addEventListener("click", () => {
            const id = el.getAttribute("data-id");
            const action = el.getAttribute("data-action");

            if (action === "view") {
              window.location.hash = `#details/${id}`;
            } else if (action === "edit") {
              window.location.hash = `#modifier/${id}`;
            } else if (action === "delete") {
              if (confirm("Confirmez-vous la suppression de cet utilisateur ?")) {
                Api.remove(id)
                  .then(() => PageListeUtilisateurs.render(container))
                  .catch((err) => {
                    alert("Échec de la suppression.");
                    console.error(err);
                  });
              }
            }
          });
        });
      })
      .catch((err) => {
        wrapper.innerHTML = `<div class="empty-state">Erreur lors du chargement des utilisateurs.</div>`;
        console.error(err);
      });
  },
};
