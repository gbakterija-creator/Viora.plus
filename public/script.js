const form = document.getElementById("vioraForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const res = await fetch("https://viora-plus-2.onrender.com/submit", {
    method: "POST",
    body: data
  });

  const text = await res.text();
  document.getElementById("message").innerText = text;
  form.reset();
});
