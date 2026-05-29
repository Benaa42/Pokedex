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
      // Confirma/atualiza pelo Firestore e garante entrada em 'usernames' (migração)
      db.collection('users').doc(user.uid).get()
        .then(function (doc) {
          if (!usernameEl) return;
          var uname = (doc.exists && doc.data().username)
            ? doc.data().username
            : (user.displayName || user.email.split('@')[0]);
          usernameEl.textContent = uname;

          // Migração: garante que usernames/{lowerName} existe para contas antigas
          if (doc.exists && doc.data().username) {
            var lowerName = doc.data().username.toLowerCase();
            db.collection('usernames').doc(lowerName).get().then(function (unameDoc) {
              if (!unameDoc.exists) {
                db.collection('usernames').doc(lowerName).set({
                  uid:      user.uid,
                  username: doc.data().username,
                  email:    user.email,
                }).catch(function () {});
              }
            }).catch(function () {});
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
