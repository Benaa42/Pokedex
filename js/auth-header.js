// Gerencia o estado de autenticação no cabeçalho de todas as páginas.
// Requer: firebase-init.js carregado antes.
// Espera no HTML: #header-auth-login, #header-auth-user, #header-auth-username, #header-logout-btn
(function () {
  auth.onAuthStateChanged(function (user) {
    var loginEl    = document.getElementById('header-auth-login');
    var userEl     = document.getElementById('header-auth-user');
    var usernameEl = document.getElementById('header-auth-username');
    if (!loginEl) return;

    if (user) {
      loginEl.style.display = 'none';
      userEl.style.display  = 'flex';
      // Mostra displayName imediatamente (definido no cadastro)
      if (usernameEl && user.displayName) usernameEl.textContent = user.displayName;
      // Confirma/atualiza pelo Firestore (fonte mais confiável)
      db.collection('users').doc(user.uid).get()
        .then(function (doc) {
          if (!usernameEl) return;
          if (doc.exists && doc.data().username) {
            usernameEl.textContent = doc.data().username;
          } else if (user.displayName) {
            usernameEl.textContent = user.displayName;
          } else {
            usernameEl.textContent = user.email.split('@')[0];
          }
        })
        .catch(function () {
          if (usernameEl) usernameEl.textContent = user.displayName || user.email.split('@')[0];
        });
    } else {
      loginEl.style.display = 'flex';
      if (userEl) userEl.style.display = 'none';
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('header-logout-btn');
    if (btn) btn.addEventListener('click', function () { auth.signOut(); });
  });
})();
