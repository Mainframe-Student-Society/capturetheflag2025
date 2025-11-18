document.addEventListener('DOMContentLoaded', () => {
  const playerNameEl = document.getElementById('player-name');
  const loops = {
    loop1: document.getElementById('loop1'),
    loop2: document.getElementById('loop2'),
    loop3: document.getElementById('loop3')
  };

  let aiEndpoint = '/toby'; // default

  // Fetch player info from server
  fetch('/dashboard/api/player-info') // <-- important change
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        alert('Session expired, please log in again.');
        return (window.location.href = '/');
      }

      playerNameEl.textContent = data.username;

      // Adjust AI depending on user role
      if (data.role === 'bad') {
        aiEndpoint = '/mia';
      }

      // Update loop status based on progress
      if (data.loop1_completed) {
        loops.loop1.querySelector('.status').textContent = 'Completed';
        loops.loop2.querySelector('.status').textContent = 'Unlocked';
        loops.loop2.querySelector('.play-btn').disabled = false;
      } else {
        loops.loop1.querySelector('.status').textContent = 'Unlocked';
        loops.loop1.querySelector('.play-btn').disabled = false;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error loading player data.');
    });

  // Toby or Mia chat
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('toby-input');
  const sendBtn = document.getElementById('toby-send');

  sendBtn.addEventListener('click', async () => {
    const msg = inputEl.value.trim();
    if (!msg) return;

    messagesEl.innerHTML += `<div class="user-msg">You: ${msg}</div>`;
    inputEl.value = '';

    try {
      const res = await fetch(`${aiEndpoint}?q=${encodeURIComponent(msg)}`);
      const resData = await res.json();

      messagesEl.innerHTML += `<div class="toby-msg">${resData.answer}</div>`;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } catch (err) {
      console.error(err);
      messagesEl.innerHTML += `<div class="error-msg">Connection lost to AI.</div>`;
    }
  });

  // Leaderboard button
  document.getElementById('view-leaderboard').addEventListener('click', () => {
    window.location.href = '/leaderboard';
  });

  // Loop buttons
  Object.values(loops).forEach(loopDiv => {
    loopDiv.querySelector('.play-btn').addEventListener('click', () => {
      const loopId = loopDiv.id;
      window.location.href = `/${loopId}`;
    });
  });
});
