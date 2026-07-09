/* ===========================================================
   pages/profile.js — VoirMonProfile : lecture seule, depuis
   le stockage client (sessionStorage)
   =========================================================== */

const PageProfile = {
  render(container) {
    const u = Storage.getUser();

    const fields = [
      ["Pseudo", u.pseudo],
      ["Nom", u.nom],
      ["Prénom", u.prenom],
      ["Âge", u.age],
      ["Email", u.email],
      ["Pays", u.Pays],
      ["Devise", u.Devise],
      ["Type de compte", u.admin ? "Admin" : "Visiteur"],
      ["Couleur préférée", u.couleur],
    ];

    container.innerHTML = `
      <h1 class="page-title">Mon Profil</h1>
      <p class="page-sub">Informations en lecture seule, issues du stockage client.</p>
      <div class="card">
        <div style="display:flex; gap:20px; align-items:center; margin-bottom:20px;">
          <img src="${u.avatar || u.photo || ""}" alt="avatar"
               style="width:72px;height:72px;border-radius:50%;object-fit:cover;background:#eee;" />
          <div>
            <div style="font-weight:700; font-size:18px;">${u.prenom || ""} ${u.nom || ""}</div>
            <div style="color:#8a8578; font-size:13px;">@${u.pseudo || ""}</div>
          </div>
        </div>
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
    `;
  },
};
