/* ===========================================================
   pages/modifierUtilisateur.js — Modifier un utilisateur (Admin)
   Route : #modifier/:id
   =========================================================== */

const PageModifierUtilisateur = {
  render(container, id) {
    container.innerHTML = `<p>Chargement…</p>`;

    if (!id) {
      container.innerHTML = `<div class="empty-state">Identifiant manquant.</div>`;
      return;
    }

    Api.getOne(id)
      .then((u) => {
        container.innerHTML = `
          <a href="#utilisateurs" class="action-link view">&larr; Retour à la liste</a>
          <h1 class="page-title">Modifier ${u.prenom || ""} ${u.nom || ""}</h1>
          <div class="card" style="max-width:520px;">
            <form id="edit-form">
              <div class="field-row">
                <div class="field">
                  <label>Nom</label>
                  <input type="text" id="e-nom" value="${u.nom || ""}" required />
                </div>
                <div class="field">
                  <label>Prénom</label>
                  <input type="text" id="e-prenom" value="${u.prenom || ""}" required />
                </div>
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Pseudo</label>
                  <input type="text" id="e-pseudo" value="${u.pseudo || ""}" required />
                </div>
                <div class="field">
                  <label>Âge</label>
                  <input type="number" id="e-age" value="${u.age || ""}" required />
                </div>
              </div>
              <div class="field">
                <label>Email</label>
                <input type="email" id="e-email" value="${u.email || ""}" required />
              </div>
              <div class="field-row">
                <div class="field">
                  <label>Rôle</label>
                  <select id="e-admin">
                    <option value="false" ${!u.admin ? "selected" : ""}>Visiteur</option>
                    <option value="true" ${u.admin ? "selected" : ""}>Admin</option>
                  </select>
                </div>
                <div class="field">
                  <label>Couleur</label>
                  <input type="text" id="e-couleur" value="${u.couleur || ""}" />
                </div>
              </div>
              <button type="submit" class="btn-primary">Enregistrer</button>
              <div id="edit-msg" style="margin-top:12px; font-size:13px;"></div>
            </form>
          </div>
        `;

        document.getElementById("edit-form").addEventListener("submit", (e) => {
          e.preventDefault();
          const msgEl = document.getElementById("edit-msg");

          const payload = {
            nom: document.getElementById("e-nom").value.trim(),
            prenom: document.getElementById("e-prenom").value.trim(),
            pseudo: document.getElementById("e-pseudo").value.trim(),
            age: document.getElementById("e-age").value,
            email: document.getElementById("e-email").value.trim(),
            admin: document.getElementById("e-admin").value === "true",
            couleur: document.getElementById("e-couleur").value.trim(),
          };

          msgEl.textContent = "Enregistrement en cours…";
          msgEl.style.color = "#6b6a5f";

          Api.update(id, payload)
            .then(() => {
              msgEl.textContent = "Utilisateur mis à jour avec succès ✔";
              msgEl.style.color = "#1f6b3a";
            })
            .catch((err) => {
              msgEl.textContent = "Échec de la mise à jour.";
              msgEl.style.color = "#c0392b";
              console.error(err);
            });
        });
      })
      .catch((err) => {
        container.innerHTML = `<div class="empty-state">Utilisateur introuvable.</div>`;
        console.error(err);
      });
  },
};
