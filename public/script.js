// public/script.js
const form = document.getElementById("vioraForm");
const messageDiv = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  try {
    const res = await fetch("https://viora-plus-2.onrender.com/submit", {
      method: "POST",
      body: data
    });

    const text = await res.text();
    messageDiv.innerText = text;
    form.reset();
  } catch (err) {
    console.error("Greška pri slanju forme:", err);
    messageDiv.innerText = "Došlo je do greške. Pokušaj ponovno.";
  }
});
