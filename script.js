// --- PARTIE 3.1 : Logique Mathématique ---

// Fonction factorielle (récursive)
function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}

// Fonction applique (similaire à Array.map)
function applique(f, tab) {
  let resultat = [];
  for (let i = 0; i < tab.length; i++) {
    resultat.push(f(tab[i]));
  }
  return resultat;
}

// Tests en console
console.log("Factorielle de 6 :", fact(6));
console.log("Applique fact sur [1,2,3,4,5,6] :", applique(fact, [1, 2, 3, 4, 5, 6]));
console.log("Fonction non-nommée :", applique(function(n) { return n + 1; }, [1, 2, 3, 4, 5, 6]));


// --- PARTIE 3.2 & 3.3 : Dynamique de la page ---

// Structure de données pour les messages
let msgs = [];

// Fonction pour mettre à jour l'affichage et les données
function update() {

  fetch('https://tp-archiapp-js-serveur.onrender.com/msg/getAll')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const listElement = document.getElementById('messages-list');
      listElement.innerHTML = ''; // Efface la liste actuelle

      msgs.length = 0;

      for (let i = 0; i < data.length; i++) {
        msgs.push({
          "pseudo": data[i].pseudo,
          "msg": data[i].msg,
          "date": data[i].date
        })
      };
      msgs.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="msg-header">${item.pseudo} <span class="msg-date">le ${item.date}</span></div>
            <div class="msg-body">${item.msg}</div>
        `;
        listElement.appendChild(li);
      });
    });
}


// 1. Bouton "Mettre à jour" (Partie 3.3)
document.getElementById('update-button').addEventListener('click', () => {
  update();
});

// 2. Bouton "Envoyer"
document.getElementById('send-button').addEventListener('click', () => {
  const pseudoInput = document.getElementById('pseudo-input');
  const msgInput = document.getElementById('message-input');

  if (msgInput.value.trim() !== "") {
    const nouveauMsg = {
      "pseudo": pseudoInput.value || "Anonyme",
      "msg": msgInput.value,
      "date": new Date().toLocaleString()
    };

    fetch(`https://tp-archiapp-js-serveur.onrender.com/msg/post/${nouveauMsg.pseudo}/${nouveauMsg.msg}`).then(() => {
          msgs.push(nouveauMsg);
          update();
          msgInput.value = "";
          });
  } // Fermeture du IF
}); // Fermeture du addEventListener

// 3. Changement de Style (Mode Sombre)
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Changement du texte du bouton
  const btn = document.getElementById('theme-toggle');
  if (document.body.classList.contains('dark-mode')) {
    btn.textContent = "Passer en mode clair";
  } else {
    btn.textContent = "Passer en mode sombre";
  }
});

// Initialisation au chargement de la page
window.onload = () => {
  update();
};
