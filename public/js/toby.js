// public/js/toby.js
// Handles role styling + Toby typing animation + injecting panel content
document.addEventListener('DOMContentLoaded', async () => {
  // helper: typewriter effect
  function typeWrite(el, text, speed = 25) {
    return new Promise(resolve => {
      el.textContent = '';
      let i = 0;
      const interval = setInterval(() => {
        el.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  // fetch player info
  let info;
  try {
    const r = await fetch('/api/player-info');
    if (!r.ok) throw new Error('not logged in');
    info = await r.json();
  } catch (e) {
    // If not logged in, still show generic Toby and stop
    document.getElementById('toby-text').textContent = 'Please log in to play.';
    return;
  }

  const role = (info.role || 'good').toLowerCase();
  const username = info.username || 'agent';
  const container = document.getElementById('container');
  const pageTitle = document.getElementById('page-title');

  // theme based on role
  if (role === 'bad') {
    container.classList.add('theme-bad');
    pageTitle.style.color = '#ff6b6b';
    document.getElementById('toby-avatar').textContent = '🔥';
  } else {
    container.classList.add('theme-good');
    pageTitle.style.color = '#00ff99';
    document.getElementById('toby-avatar').textContent = '🤖';
  }

  // Toby's message depending on role
  const goodMsg = `Welcome, ${username}. I will be your assistant for this mission.\n\nLet me tell you about your first mission.\n\nBankMainframe subsystem is using a legacy backup config that was never properly archived.\nA routine maintenance file was left accessible. Somewhere inside there is a short control code — the "loophole" — that will let you access the next stage.\n\nYour mission: find the control code (single token) and submit it here. If you are Good, submit the code to get a Team Token (use it to form teams for Loop 2). If you are Bad, submit to claim the exploit token — you’ll get sabotage powers later.\n\nHints are available. Use them sparingly — hints reduce points.\n\nGood luck.`;

  const badMsg = `Welcome, ${username}. Mia here — ready to corrupt.\n\nBankMainframe is weak; legacy backups hold the keys. Find the control token and claim the exploit. Your team will be rewarded with sabotage powers when you succeed.\n\nHints are available; use them if you must (costs apply).\n\nExecute with precision.`;

  const message = (role === 'bad') ? badMsg : goodMsg;
  const tobyTextEl = document.getElementById('toby-text');

  // type the message with pauses for paragraphs
  const paragraphs = message.split('\n\n');
  for (let p of paragraphs) {
    await typeWrite(tobyTextEl, tobyTextEl.textContent + (tobyTextEl.textContent ? '\n\n' : '') + p, 18);
    await new Promise(r => setTimeout(r, 450));
  }

  // Now inject the panel contents
  document.getElementById('notice').textContent = `-- BACKOFFICE NOTICE --\nDate: 1979-11-11\nSystem: BANKMAIN - BACKUP\nFile archived: /archives/legacy/backup_ctrl.cfg\nAdmin contact: sysadmin@bank.local`;
  document.getElementById('config').textContent = `# backup_ctrl.cfg\n# WARNING: legacy system. Do not change.\nSERVICE=BACKOFFICE\nMODE=ARCHIVE\nENCRYPT=off\nACL=legacy_readonly\nARCHIVE_ID=MN-19791111\nCONTROL_CODE_PART1=YmFjaw==\nCONTROL_CODE_PART2=MTIz\n# end of file`;
  document.getElementById('audit').textContent = `Audit: 2025-11-01 03:02 - scheduled dump completed.\nNote from tech: "Left the old base64 tokens for backwards compat. decode needed by restore tool."`;

  // hook panel toggles (if not already hooked)
  document.querySelectorAll('.panel-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.target;
      const el = document.getElementById(id);
      el.classList.toggle('hidden');
      btn.textContent = el.classList.contains('hidden') ? btn.textContent.replace('▴','▾') : btn.textContent.replace('▾','▴');
    });
  });

  // hint button: local prompt that presents hint1
  document.getElementById('hint-btn').addEventListener('click', async () => {
    const want = confirm('Toby: Would you like a hint? (This may incur a points penalty)');
    if (!want) return;
    // For now show hint1 (client-side). Penalty applied later.
    alert('Toby hint: The code parts look encoded. Try common encodings like Base64.');
  });
});
