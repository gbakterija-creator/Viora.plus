function nextStep(step) {
  document.querySelectorAll('.step').forEach(s => s.style.display = 'none');
  document.getElementById('step' + step).style.display = 'block';
}

document.getElementById('vioraForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  const res = await fetch('/submit', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  alert(data.message);
  this.reset();
  nextStep(1);
});
