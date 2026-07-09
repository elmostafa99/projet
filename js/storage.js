/* ===========================================================
   storage.js — Gestion du stockage client
   - sessionStorage : session de l'utilisateur connecté
   - localStorage   : "se rappeler de moi" + demandes (simulateur
                       de base de données côté client, car l'API
                       fournie ne gère pas les demandes)
   =========================================================== */

const SESSION_KEY = "utilisateurConnecte";
const REMEMBER_KEY = "seRappelerDeMoi";
const DEMANDES_KEY = "demandes";

const Storage = {
  /* ---------- Session utilisateur ---------- */
  setUser(user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },
  getUser() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  clearUser() {
    sessionStorage.removeItem(SESSION_KEY);
  },
  isLoggedIn() {
    return !!this.getUser();
  },
  isAdmin() {
    const u = this.getUser();
    return !!(u && (u.admin === true || u.admin === "true"));
  },
  /** Met à jour la couleur préférée dans le stockage client */
  updateUserField(field, value) {
    const u = this.getUser();
    if (!u) return;
    u[field] = value;
    this.setUser(u);
  },

  /* ---------- Se rappeler de moi ---------- */
  remember(pseudo, motDePasse) {
    localStorage.setItem(REMEMBER_KEY, JSON.stringify({ pseudo, motDePasse }));
  },
  forget() {
    localStorage.removeItem(REMEMBER_KEY);
  },
  getRemembered() {
    const raw = localStorage.getItem(REMEMBER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  /* ---------- Demandes (fonctionnalité "Développement") ---------- */
  getDemandes() {
    const raw = localStorage.getItem(DEMANDES_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  saveDemandes(list) {
    localStorage.setItem(DEMANDES_KEY, JSON.stringify(list));
  },
  addDemande(titre, description, auteurId, auteurPseudo) {
    const list = this.getDemandes();
    list.push({
      id: Date.now().toString(),
      titre,
      description,
      auteurId,
      auteurPseudo,
      statut: "En attente", // "En attente" | "Approuvée" | "Rejetée"
      dateCreation: new Date().toISOString(),
    });
    this.saveDemandes(list);
  },
  updateDemandeStatut(id, statut) {
    const list = this.getDemandes();
    const d = list.find((x) => x.id === id);
    if (d) d.statut = statut;
    this.saveDemandes(list);
  },
  removeDemande(id) {
    this.saveDemandes(this.getDemandes().filter((x) => x.id !== id));
  },
};
