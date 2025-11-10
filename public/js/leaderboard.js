document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("leaderboard-body");

  try {
    const res = await fetch("/leaderboard/data");
    const data = await res.json();

    if (!data.success) {
      tbody.innerHTML = `<tr><td colspan="3">Failed to load leaderboard.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";

    data.leaderboard.forEach(player => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${player.rank}</td>
        <td>${player.username}</td>
        <td class="${player.role === 'Good' ? 'role-saver' : 'role-exploiter'}">${player.role}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading leaderboard:", err);
    tbody.innerHTML = `<tr><td colspan="3">Error loading data.</td></tr>`;
  }

  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "/dashboard";
  });
});
