/* ===========================================================
   pages/ajouterUtilisateur.js — Ajouter un utilisateur (Admin)
   =========================================================== */

const PageAjouterUtilisateur = {
  render(container) {
    container.innerHTML = `
      <h1 class="page-title">Ajouter un Utilisateur</h1>
      <p class="page-sub">Création d'un compte via l'API.</p>
      <div class="card" style="max-width:520px;">
        <form id="add-form">
          <div class="field-row">
            <div class="field">
              <label>Nom</label>
              <input type="text" id="a-nom" required />
            </div>
            <div class="field">
              <label>Prénom</label>
              <input type="text" id="a-prenom" required />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Pseudo</label>
              <input type="text" id="a-pseudo" required />
            </div>
            <div class="field">
              <label>Âge</label>
              <input type="number" id="a-age" required />
            </div>
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" id="a-email" required />
          </div>
          <div class="field-row">
            <div class="field">
              <label>Rôle</label>
              <select id="a-admin">
                <option value="false">Visiteur</option>
                <option value="true">Admin</option>
              </select>
            </div>
            <div class="field">
              <label>Couleur</label>
              <input type="text" id="a-couleur" value="teal" />
            </div>
          </div>
          <div class="field">
            <label>Mot de passe</label>
            <input type="password" id="a-password" required />
          </div>
          <button type="submit" class="btn-primary">Ajouter</button>
          <div id="add-msg" style="margin-top:12px; font-size:13px;"></div>
        </form>
      </div>
    `;

    document.getElementById("add-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const msgEl = document.getElementById("add-msg");

      const payload = {
        nom: document.getElementById("a-nom").value.trim(),
        prenom: document.getElementById("a-prenom").value.trim(),
        pseudo: document.getElementById("a-pseudo").value.trim(),
        age: document.getElementById("a-age").value,
        email: document.getElementById("a-email").value.trim(),
        admin: document.getElementById("a-admin").value === "true",
        couleur: document.getElementById("a-couleur").value.trim() || "teal",
        MotDePasse: document.getElementById("a-password").value,
      };

      msgEl.textContent = "Ajout en cours…";
      msgEl.style.color = "#6b6a5f";

      Api.create(payload)
        .then(() => {
          msgEl.textContent = "Utilisateur ajouté avec succès ✔";
          msgEl.style.color = "#1f6b3a";
          document.getElementById("add-form").reset();
        })
        .catch((err) => {
          msgEl.textContent = "Échec de l'ajout de l'utilisateur.";
          msgEl.style.color = "#c0392b";
          console.error(err);
        });
    });
  },
};
