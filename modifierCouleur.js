/* ===========================================================
   pages/modifierCouleur.js — Modifier la couleur préférée
   Règle : les visiteurs de moins de 15 ans voient un message
   au lieu du formulaire.
   =========================================================== */

const COULEURS_DISPONIBLES = [
  "maroon", "navy", "teal", "olive", "purple",
  "coral", "black", "crimson", "steelblue", "seagreen",
];

const PageModifierCouleur = {
  render(container) {
    const u = Storage.getUser();
    const age = parseInt(u.age, 10) || 0;
    const estVisiteurMineur = !u.admin && age < 15;

    if (estVisiteurMineur) {
      container.innerHTML = `
        <h1 class="page-title">Modifier Couleur</h1>
        <div class="card empty-state">
          Cette fonctionnalité est réservée aux utilisateurs de 15 ans et plus.
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <h1 class="page-title">Modifier Couleur</h1>
      <p class="page-sub">Couleur actuelle :
        <span class="swatch" style="background:${u.couleur}"></span>${u.couleur}
      </p>
      <div class="card" style="max-width:420px;">
        <div class="field">
          <label for="new-couleur">Nouvelle couleur</label>
          <select id="new-couleur">
            ${COULEURS_DISPONIBLES.map(
              (c) => `<option value="${c}" ${c === u.couleur ? "selected" : ""}>${c}</option>`
            ).join("")}
          </select>
        </div>
        <button class="btn-primary" id="valider-couleur-btn">Valider</button>
        <div id="couleur-msg" style="margin-top:12px; font-size:13px;"></div>
      </div>
    `;

    document
      .getElementById("valider-couleur-btn")
      .addEventListener("click", () => {
        const nouvelle = document.getElementById("new-couleur").value;
        const msgEl = document.getElementById("couleur-msg");
        msgEl.textContent = "Mise à jour en cours…";
        msgEl.style.color = "#6b6a5f";

        Api.update(u.id, { couleur: nouvelle })
          .then(() => {
            Storage.updateUserField("couleur", nouvelle);
            document.body.style.backgroundColor = nouvelle;
            msgEl.textContent = "Couleur mise à jour avec succès ✔";
            msgEl.style.color = "#1f6b3a";
            const sub = container.querySelector(".page-sub");
            if (sub) {
              sub.innerHTML = `Couleur actuelle :
                <span class="swatch" style="background:${nouvelle}"></span>${nouvelle}`;
            }
          })
          .catch((err) => {
            msgEl.textContent = "Échec de la mise à jour de la couleur.";
            msgEl.style.color = "#c0392b";
            console.error(err);
          });
      });
  },
};
