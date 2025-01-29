// Fungsi untuk membaca nilai cookie berdasarkan nama
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

// Ambil token dari cookie
const token = getCookie("token");

// Fungsi untuk fetch data dan isi dropdown
async function fetchData(url, selectElement) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Jika butuh autentikasi
            }
        });
        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();
        
        // Kosongkan dropdown sebelum diisi
        selectElement.innerHTML = `<option value="">Pilih</option>`;

        // Tambahkan data ke dropdown
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;  // Sesuaikan dengan key dari API
            option.textContent = item.name;  // Sesuaikan dengan key dari API
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

// Panggil fungsi untuk mengisi dropdown
document.addEventListener("DOMContentLoaded", () => {
    fetchData("https://kosconnect-server.vercel.app/api/users/owner", document.getElementById("ownerKos"));
    fetchData("https://kosconnect-server.vercel.app/api/categories/", document.getElementById("categoryKos"));
    fetchData("https://kosconnect-server.vercel.app/api/facility/type?type=boarding_house", document.getElementById("fasilitasKos"));
});

// Fungsi untuk menangani submit form
document.getElementById("formTambahKos").addEventListener("submit", async function (e) {
    e.preventDefault();

    const ownerKos = document.getElementById("ownerKos").value;
    const categoryKos = document.getElementById("categoryKos").value;
    const namaKos = document.getElementById("namaKos").value;
    const alamatKos = document.getElementById("alamatKos").value;
    const longitudeKos = document.getElementById("longitudeKos").value;
    const latitudeKos = document.getElementById("latitudeKos").value;
    const descriptionKos = document.getElementById("descriptionKos").value;
    const fasilitasKos = Array.from(document.getElementById("fasilitasKos").selectedOptions).map(opt => opt.value);
    const rulesKos = document.getElementById("rulesKos").value;

    // Ambil file gambar yang diunggah
    const imagesKos = document.getElementById("imagesKos").files;
    const formData = new FormData();

    formData.append("owner_id", ownerKos);
    formData.append("category_id", categoryKos);
    formData.append("name", namaKos);
    formData.append("address", alamatKos);
    formData.append("longitude", longitudeKos);
    formData.append("latitude", latitudeKos);
    formData.append("description", descriptionKos);
    formData.append("rules", rulesKos);

    // Tambahkan fasilitas dalam format array JSON
    fasilitasKos.forEach(facility => {
        formData.append("facilities[]", facility);
    });

    // Tambahkan file gambar jika ada
    for (let i = 0; i < imagesKos.length; i++) {
        formData.append("images", imagesKos[i]);
    }

    try {
        const response = await fetch("https://kosconnect-server.vercel.app/api/boardingHouses/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}` // Jika API memerlukan autentikasi
            },
            body: formData
        });

        if (!response.ok) throw new Error("Gagal menyimpan data");

        alert("Kos berhasil ditambahkan!");
        window.location.href = "manajemen_kos.html"; // Redirect setelah sukses
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menambahkan kos.");
    }
});
