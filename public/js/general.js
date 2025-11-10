document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-btn");
  const dashboardBtn = document.getElementById("dashboard-btn");
  const leaderboardBtn = document.getElementById("leaderboard-btn");

  playBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/general/player/current-loop");
      const data = await res.json();

      if (data.success && data.redirect) {
        window.location.href = data.redirect;
      } else {
        alert(data.message || "No active loop available yet.");
      }
    } catch (err) {
      console.error(err);
      alert("Network issue, try again!");
    }
  });

  dashboardBtn.addEventListener("click", () => {
    window.location.href = "/dashboard";
  });

  leaderboardBtn.addEventListener("click", () => {
    window.location.href = "/leaderboard";
  });
});
