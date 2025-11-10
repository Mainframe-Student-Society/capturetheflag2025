document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const msg = document.getElementById("login-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      msg.textContent = "Please enter both username and password.";
      return;
    }

    // redirect to general 
    window.location.href = "/general";
  });
});
