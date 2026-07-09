/* ===========================================================
   pages/demandes.js — Partie "E- Développement"
   - Un visiteur peut créer une demande (titre, description)
   - Elle est "En attente" jusqu'à ce que l'admin l'approuve
     ou la rejette (ou l'annule lui-même si encore en attente)
   - L'admin voit toutes les demandes et peut changer leur état
     à tout moment.
   Remarque : l'API fournie (mockapi/Stagiaire) ne gère pas les
   demandes ; elles sont donc persistées côté client
   (localStorage) via Storage.addDemande / getDemandes / ...
   =========================================================== */

function badgeFor(statut) {
  const map = {
    "En attente": "pending",
    "Approuvée": "approved",
    "Rejetée": "rejected",
  };
  return `<span class="badge ${map[statut] || "pending"}">${statut}</span>`;
}

const PageDemandes = {
  render(container) {
    const user = Storage.getUser();
    if (Storage.isAdmin()) {
      this.renderAdmin(container);
    } else {
      this.renderVisiteur(container, user);
    }
  },

  /* ---------- Vue Visiteur ---------- */
  renderVisiteur(container, user) {
    const mesDemandes = Storage.getDemandes().filter(
      (d) => d.auteurId === user.id
    );

    container.innerHTML = `
      <h1 class="page-title">Mes Demandes</h1>
      <p class="page-sub">Soumettez une demande ; elle sera examinée par un administrateur.</p>

      <div class="card" style="max-width:520px;">
        <form id="demande-form">
          <div class="field">
            <label>Titre</label>
            <input type="text" id="d-titre" required />
          </div>
          <div class="field">
            <label>Description</label>
            <input type="text" id="d-description" required />
          </div>
          <button type="submit" class="btn-primary">Envoyer la demande</button>
        </form>
      </div>

      <div class="card" id="mes-demandes-wrapper">
        ${this.tableDemandesVisiteur(mesDemandes)}
      </div>
    `;

    document.getElementById("demande-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const titre = document.getElementById("d-titre").value.trim();
      const description = document.getElementById("d-description").value.trim();
      if (!titre || !description) return;

      Storage.addDemande(titre, description, user.id, user.pseudo);
      PageDemandes.render(container);
    });

    const wrapper = document.getElementById("mes-demandes-wrapper");
    wrapper.querySelectorAll("[data-cancel]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Storage.removeDemande(btn.getAttribute("data-cancel"));
        PageDemandes.render(container);
      });
    });
  },

  tableDemandesVisiteur(list) {
    if (!list.length) {
      return `<div class="empty-state">Vous n'avez encore soumis aucune demande.</div>`;
    }
    return `
      <table class="data-table">
        <thead>
          <tr><th>Titre</th><th>Description</th><th>Statut</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${list
            .map(
              (d) => `
            <tr>
              <td>${d.titre}</td>
              <td>${d.description}</td>
              <td>${badgeFor(d.statut)}</td>
              <td>
                ${
                  d.statut === "En attente"
                    ? `<a class="action-link delete" data-cancel="${d.id}">Annuler</a>`
                    : "—"
                }
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
  },

  /* ---------- Vue Admin ---------- */
  renderAdmin(container) {
    const all = Storage.getDemandes();
    const enAttente = all.filter((d) => d.statut === "En attente");
    const approuvees = all.filter((d) => d.statut === "Approuvée");
    const rejetees = all.filter((d) => d.statut === "Rejetée");

    container.innerHTML = `
      <h1 class="page-title">Gestion des Demandes</h1>
      <p class="page-sub">Approuvez, rejetez ou modifiez l'état de n'importe quelle demande.</p>

      <div class="card">
        <h3 style="margin-top:0;">En attente (${enAttente.length})</h3>
        ${this.tableDemandesAdmin(enAttente)}
      </div>
      <div class="card">
        <h3 style="margin-top:0;">Approuvées (${approuvees.length})</h3>
        ${this.tableDemandesAdmin(approuvees)}
      </div>
      <div class="card">
        <h3 style="margin-top:0;">Rejetées (${rejetees.length})</h3>
        ${this.tableDemandesAdmin(rejetees)}
      </div>
    `;

    container.querySelectorAll("[data-approve]").forEach((btn) =>
      btn.addEventListener("click", () => {
        Storage.updateDemandeStatut(btn.getAttribute("data-approve"), "Approuvée");
        PageDemandes.render(container);
      })
    );
    container.querySelectorAll("[data-reject]").forEach((btn) =>
      btn.addEventListener("click", () => {
        Storage.updateDemandeStatut(btn.getAttribute("data-reject"), "Rejetée");
        PageDemandes.render(container);
      })
    );
    container.querySelectorAll("[data-pending]").forEach((btn) =>
      btn.addEventListener("click", () => {
        Storage.updateDemandeStatut(btn.getAttribute("data-pending"), "En attente");
        PageDemandes.render(container);
      })
    );
  },

  tableDemandesAdmin(list) {
    if (!list.length) {
      return `<div class="empty-state">Aucune demande dans cette catégorie.</div>`;
    }
    return `
      <table class="data-table">
        <thead>
          <tr><th>Auteur</th><th>Titre</th><th>Description</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${list
            .map(
              (d) => `
            <tr>
              <td>${d.auteurPseudo}</td>
              <td>${d.titre}</td>
              <td>${d.description}</td>
              <td>
                ${
                  d.statut !== "Approuvée"
                    ? `<a class="action-link view" data-approve="${d.id}">Approuver</a>`
                    : ""
                }
                ${
                  d.statut !== "Rejetée"
                    ? `<a class="action-link delete" data-reject="${d.id}">Rejeter</a>`
                    : ""
                }
                ${
                  d.statut !== "En attente"
                    ? `<a class="action-link edit" data-pending="${d.id}">Remettre en attente</a>`
                    : ""
                }
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
  },
};
