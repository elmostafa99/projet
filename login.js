/* ===========================================================
   login.js — Logique de la page de connexion
   =========================================================== */

const MAX_TENTATIVES = 3;
let tentatives = 0;

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const loginBtn = document.getElementById("login-btn");
const errorList = document.getElementById("error-list");

// Si déjà connecté, on va directement au layout
if (Storage.isLoggedIn()) {
  window.location.href = "layout.html";
}

// Pré-remplissage si "se rappeler de moi" a été coché précédemment
window.addEventListener("DOMContentLoaded", () => {
  const remembered = Storage.getRemembered();
  if (remembered) {
    usernameInput.value = remembered.pseudo;
    passwordInput.value = remembered.motDePasse;
    rememberInput.checked = true;
  }
});

function showErrors(messages) {
  errorList.innerHTML = "";
  messages.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    errorList.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const pseudo = usernameInput.value.trim();
  const motDePasse = passwordInput.value;
  const errors = [];

  if (!pseudo) errors.push("Le nom d'utilisateur est obligatoire.");
  if (!motDePasse) errors.push("Le mot de passe est obligatoire.");

  if (errors.length) {
    showErrors(errors);
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Connexion en cours…";

  Api.findByPseudo(pseudo)
    .then((user) => {
      loginBtn.textContent = "LOGIN";

      if (!user || user.MotDePasse !== motDePasse) {
        tentatives++;
        const restant = MAX_TENTATIVES - tentatives;

        if (restant <= 0) {
          showErrors([
            "Identifiants incorrects. Nombre maximal de tentatives atteint.",
          ]);
          loginBtn.disabled = true;
        } else {
          showErrors([
            `Identifiants incorrects. Il vous reste ${restant} tentative(s).`,
          ]);
          loginBtn.disabled = false;
        }
        return;
      }

      // Authentification réussie
      if (rememberInput.checked) {
        Storage.remember(pseudo, motDePasse);
      } else {
        Storage.forget();
      }

      Storage.setUser(user);
      window.location.href = "layout.html";
    })
    .catch((err) => {
      loginBtn.textContent = "LOGIN";
      loginBtn.disabled = false;
      showErrors(["Impossible de contacter le serveur. Réessayez plus tard."]);
      console.error(err);
    });
});
