// public/js/loop1.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loop1-form");
  const input = document.getElementById("answer");
  const modal = document.getElementById("token-modal");
  const modalText = document.getElementById("token-text");
  const modalClose = document.getElementById("close-modal");
  const inlineResult = document.getElementById("inline-result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const answer = input.value.trim();
    if (!answer) return alert("Enter your exploit code first!");

    try {
      const res = await fetch("/loop1/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Server returned error', text);
        return alert('Server error: ' + res.status);
      }

      const data = await res.json();

      if (data.success) {
        modalText.innerText = `Your unique team token is: ${data.token}\n\nUse it to create or join a team later.`;
        modal.classList.remove("hidden");
        inlineResult.innerText = `Token: ${data.token}`;
      } else {
        // Toby-style negative popup
        if (data.message && data.message.toLowerCase().includes('hint')) {
          inlineResult.innerText = data.message;
        } else {
          const wantHint = confirm('Toby: Incorrect. Do you want a hint? (Penalty may apply)');
          if (wantHint) {
            // basic client-side hint; server should still record hint usage for points
            alert('Hint: CONTROL_CODE_PART* looks like Base64. Decode and join the pieces.');
          }
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error, try again!");
    }
  });

  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});
