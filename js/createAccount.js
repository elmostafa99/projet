/* ===========================================================
   createAccount.js — Logique de la page de création de compte
   =========================================================== */

const createForm = document.getElementById("create-form");
const createBtn = document.getElementById("create-btn");
const createErrorList = document.getElementById("error-list");

// Règle mot de passe : >=8 car., 1 maj, 1 min, 1 chiffre, 1 caractère spécial
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function showCreateErrors(messages) {
  createErrorList.innerHTML = "";
  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    createErrorList.appendChild(li);
  });
}

function field(id) {
  return document.getElementById(id).value.trim();
}

createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const values = {
    nom: field("nom"),
    prenom: field("prenom"),
    pseudo: field("pseudo"),
    age: field("age"),
    email: field("email"),
    couleur: field("couleur"),
    Pays: field("pays"),
    Devise: field("devise"),
    admin: document.getElementById("admin").value === "true",
    avatar: field("avatar"),
    photo: field("photo"),
    MotDePasse: document.getElementById("motdepasse").value,
    confirmation: document.getElementById("confirmation").value,
  };

  const errors = [];

  // Tous les champs sont obligatoires
  Object.entries(values).forEach(([key, val]) => {
    if (val === "" || val === null || val === undefined) {
      errors.push(`Le champ "${key}" est obligatoire.`);
    }
  });

  // Règles du mot de passe
  if (values.MotDePasse && !PASSWORD_REGEX.test(values.MotDePasse)) {
    errors.push(
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
    );
  }

  // Confirmation du mot de passe
  if (values.MotDePasse !== values.confirmation) {
    errors.push("La confirmation du mot de passe ne correspond pas.");
  }

  if (errors.length) {
    showCreateErrors(errors);
    return;
  }

  createBtn.disabled = true;
  createBtn.textContent = "Création en cours…";

  const payload = {
    nom: values.nom,
    prenom: values.prenom,
    pseudo: values.pseudo,
    age: values.age,
    email: values.email,
    couleur: values.couleur,
    Pays: values.Pays,
    Devise: values.Devise,
    admin: values.admin,
    avatar: values.avatar,
    photo: values.photo,
    MotDePasse: values.MotDePasse,
  };

  Api.create(payload)
    .then(() => {
      alert("Compte créé avec succès ! Vous allez être redirigé vers la page de connexion.");
      window.location.href = "login.html";
    })
    .catch((err) => {
      createBtn.disabled = false;
      createBtn.textContent = "Créer le compte";
      showCreateErrors(["Échec de la création du compte. Réessayez."]);
      console.error(err);
    });
});
