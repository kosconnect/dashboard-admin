// const urlParams = new URLSearchParams(window.location.search);
// const boardingHouseId = urlParams.get('boarding_house_id');
// console.log("Boarding House ID:", boardingHouseId);

// Fungsi untuk membaca boarding_house_id dari URL
function getBoardingHouseIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("boarding_house_id");
}

// Fungsi untuk membaca cookie (untuk autentikasi)
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Fungsi untuk mengambil dan menampilkan fasilitas kamar
async function loadFacilities() {
    try {
        const response = await fetch("https://kosconnect-server.vercel.app/api/customFacilities/admin");
        if (!response.ok) {
            throw new Error("Gagal mengambil data fasilitas");
        }
        const facilities = await response.json();

        const fasilitasContainer = document.getElementById("fasilitasKamar");
        const fasilitasTambahanContainer = document.getElementById("fasilitasTambahan");

        facilities.forEach((facility) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = facility.id;
            checkbox.name = "fasilitasKamar[]";
            checkbox.id = `fasilitas-${facility.id}`;

            const label = document.createElement("label");
            label.htmlFor = `fasilitas-${facility.id}`;
            label.textContent = facility.name;

            const wrapper = document.createElement("div");
            wrapper.classList.add("checkbox-item");
            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            if (facility.type === "primary") {
                fasilitasContainer.appendChild(wrapper);
            } else {
                fasilitasTambahanContainer.appendChild(wrapper);
            }
        });
    } catch (error) {
        console.error("Error saat mengambil fasilitas:", error);
    }
}

// Fungsi untuk menangani pengiriman formulir tambah kamar
document.getElementById("formTambahKamar").addEventListener("submit", async function (event) {
    event.preventDefault();

    const authToken = getCookie("authToken");
    if (!authToken) {
        alert("Anda harus login terlebih dahulu!");
        return;
    }

    const formData = new FormData();
    formData.append("room_type", document.getElementById("tipeKamar").value);
    formData.append("room_size", document.getElementById("ukuranKamar").value);
    formData.append("price", document.getElementById("hargaKamar").value);
    formData.append("available_rooms", document.getElementById("kamarTersedia").value);

    // Ambil fasilitas yang dipilih
    const selectedFacilities = [...document.querySelectorAll("#fasilitasKamar input:checked")].map(input => input.value);
    formData.append("facilities", JSON.stringify(selectedFacilities));

    const selectedAdditionalFacilities = [...document.querySelectorAll("#fasilitasTambahan input:checked")].map(input => input.value);
    formData.append("additional_facilities", JSON.stringify(selectedAdditionalFacilities));

    // Tambahkan gambar ke FormData
    const imageFiles = document.getElementById("imagesKamar").files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
    }

    try {
        const response = await fetch("https://kosconnect-server.vercel.app/api/rooms/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Gagal menambahkan kamar");
        }

        alert("Kamar berhasil ditambahkan!");
        window.location.href = "manajemen_kamar_kos.html"; // Redirect ke halaman manajemen
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menambahkan kamar");
    }
});

// Panggil fungsi untuk memuat fasilitas saat halaman dimuat
window.onload = loadFacilities;
