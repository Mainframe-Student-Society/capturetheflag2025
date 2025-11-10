// Shared tab, chat and helper functions used by pages.
// Include this script at bottom of pages: <script src="/js/common.js"></script>

(function () {
  // tabs: buttons with data-target="id"
  function initTabs(root = document) {
    root.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('.tabs') || document;
        group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        if (!target) return;
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        const el = document.getElementById(target);
        if (el) el.classList.add('active');
      });
    });
  }

  // chat/toby
  function initChat() {
    const tobyBtn = document.getElementById('tobyBtn');
    const chat = document.getElementById('chat');
    const closeChat = document.getElementById('closeChat');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    const messages = document.getElementById('messages');

    function openChat(){ if(chat){ chat.style.display='flex'; chat.setAttribute('aria-hidden','false'); chatInput && chatInput.focus(); } }
    function closeChatFn(){ if(chat){ chat.style.display='none'; chat.setAttribute('aria-hidden','true'); } }

    if (tobyBtn) tobyBtn.addEventListener('click', openChat);
    if (closeChat) closeChat.addEventListener('click', closeChatFn);

    window.addTobyMessage = function (text) {
      if (!messages) return;
      const r = document.createElement('div');
      r.style.marginTop = '8px';
      r.style.opacity = '.95';
      r.textContent = 'Toby: ' + text;
      messages.appendChild(r);
      messages.scrollTop = messages.scrollHeight;
      openChat();
    };

    if (sendBtn && chatInput && messages) {
      sendBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (!text) return;
        const el = document.createElement('div');
        el.style.marginTop = '8px';
        el.style.background = 'rgba(141,255,171,0.07)';
        el.style.padding = '8px';
        el.style.borderRadius = '6px';
        el.textContent = 'You: ' + text;
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
        chatInput.value = '';
        setTimeout(() => {
          addTobyMessage('This is a hint area. Ask about the artifacts or request a small hint (remember -25 points).');
        }, 600);
      });

      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); sendBtn.click(); }
      });
    }
  }

  // simple helper to call server update endpoint
  window.updateDB = async function(delta, note = '', extra = {}) {
    try {
      await fetch('/api/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ delta, note }, extra))
      });
    } catch (err) {
      console.warn('updateDB failed', err);
    }
  };

  // auto-init where applicable
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initChat();
  });
})();