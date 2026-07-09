/* ===========================================================
   api.js — Toutes les requêtes fetch vers l'API mockapi.io
   Endpoint : https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire
   =========================================================== */

const API_BASE = "https://670ed5b73e7151861655eaa3.mockapi.io/Stagiaire";

const Api = {
  /** GET /Stagiaire — liste complète des utilisateurs */
  getAll() {
    return fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau (" + res.status + ")");
        return res.json();
      });
  },

  /** GET /Stagiaire/:id — un seul utilisateur */
  getOne(id) {
    return fetch(`${API_BASE}/${id}`).then((res) => {
      if (!res.ok) throw new Error("Utilisateur introuvable");
      return res.json();
    });
  },

  /** POST /Stagiaire — création d'un utilisateur */
  create(data) {
    return fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("Échec de la création");
      return res.json();
    });
  },

  /** PUT /Stagiaire/:id — mise à jour d'un utilisateur */
  update(id, data) {
    return fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("Échec de la mise à jour");
      return res.json();
    });
  },

  /** DELETE /Stagiaire/:id — suppression d'un utilisateur */
  remove(id) {
    return fetch(`${API_BASE}/${id}`, { method: "DELETE" }).then((res) => {
      if (!res.ok) throw new Error("Échec de la suppression");
      return res.json();
    });
  },

  /** Recherche d'un utilisateur par pseudo (utilisé au login) */
  findByPseudo(pseudo) {
    return this.getAll().then((list) =>
      list.find((u) => (u.pseudo || "").toLowerCase() === pseudo.toLowerCase())
    );
  },
};
