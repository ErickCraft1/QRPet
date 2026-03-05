const doc = document;
const qrForm = doc.getElementById("qrForm");
const qrCodeContainer = doc.getElementById("qrCodeContainer");
const msgError = doc.querySelector(".error-message");

const QR = new QRCode(qrCodeContainer);

qrForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const petName = doc.getElementById("petName").value;
  const petBreed = doc.getElementById("petBreed").value;
  const petAge = doc.getElementById("petAge").value;
  const ownerContact = doc.getElementById("ownerContact").value;
  const ownerName = doc.getElementById("ownerName").value;

  // 1. Guardar en el backend y obtener el ID
  const formData = new FormData();
  formData.append("petName", petName);
  formData.append("petBreed", petBreed);
  formData.append("petAge", petAge);
  formData.append("ownerName", ownerName);
  formData.append("petImage", doc.getElementById("petImg").files[0]);

  // Validar que sea número antes de agregarlo al formData
  if (isNaN(ownerContact)) {
    msgError.style.display = "block";
    return;
  } else {
    msgError.style.display = "none";
    formData.append("ownerContact", ownerContact);
  }

  const response = await fetch("/api/qr", {
    method: "POST",
    body: formData,
  });
  const { id } = await response.json();

  // 2. Generar el QR con la URL de la mascota
  QR.clear();
  QR.makeCode(`${window.location.origin}/mascota/${id}`);
  doc.getElementById("downloadBtn").style.display = "block";
});
doc.getElementById("downloadBtn").addEventListener("click", () => {
  const img = qrCodeContainer.querySelector("img");
  if (!img) return;

  // Crear un link de descarga temporal
  const link = doc.createElement("a");
  link.href = img.src;
  link.download = `Mascota_QR.png`;
  link.click();
});
