const API_URL = "/api/comments";
const list = document.getElementById("commentList");
const alertBox = document.getElementById("formAlert");

function showAlert(message, type = "error") {
    alertBox.textContent = message;
    alertBox.classList.remove("hidden");

    if (type === "error") {
        alertBox.classList.remove("bg-green-600");
        alertBox.classList.add("bg-red-600");
    } else {
        alertBox.classList.remove("bg-red-600");
        alertBox.classList.add("bg-green-600");
    }

    setTimeout(() => alertBox.classList.add("hidden"), 4000);
}

async function loadComments() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            showAlert("No se pudieron cargar los comentarios.");
            return;
        }

        const data = await res.json();
        list.innerHTML = "";

        const comments = data.comments ?? [];

        if (comments.length === 0) {
            list.innerHTML = `
                <div class="col-span-full text-center text-gray-500 bg-white p-6 rounded-xl shadow border">
                    Aún no hay comentarios. ¡Sé el primero en dejar uno! 😊
                </div>
            `;
            return;
        }

        comments.forEach(({ comment, email, name }) => {
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded-xl shadow-md border";

            card.innerHTML = `
                <p class="text-gray-700 whitespace-pre-line">${comment}</p>

                <div class="mt-3 text-sm text-gray-500 border-t pt-2">
                    <span class="font-semibold">${name}</span><br>
                    <span>${email}</span>
                </div>
            `;

            list.appendChild(card);
        });

    } catch (err) {
        showAlert("Error al conectar con el servidor.");
        console.error(err);
    }
}

document.getElementById("commentForm").addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!name || !email || !comment) {
        showAlert("Debes completar todos los campos.");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, comment })
        });

        if (res.status === 422) {
            const errorData = await res.json();

            showAlert(errorData.message || "Datos inválidos. Revisa el formulario.");
            return;
        }

        if (!res.ok) {
            showAlert("Ocurrió un error inesperado. Intenta más tarde.");
            return;
        }

        showAlert("Comentario enviado correctamente.", "success");

        e.target.reset();

        loadComments();
    } catch (err) {
        showAlert("No se pudo enviar el comentario. Verifica tu conexión.");
        console.log(err);
    }
});

function openImageModal(src, title, description) {
    document.getElementById("modalImage").src = src;
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDescription").textContent = description;

    const modal = document.getElementById("imageModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex"); // para centrar
}

function closeImageModal() {
    const modal = document.getElementById("imageModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}


loadComments();