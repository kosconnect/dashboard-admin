// Fungsi untuk mendapatkan JWT token dari cookie
function getJwtToken() {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === 'authToken') {
            return decodeURIComponent(value);
        }
    }
    console.error("Token tidak ditemukan.");
    return null;
}

// Ambil token dari cookie
const token = getJwtToken();

// Fungsi untuk fetch data dan isi dropdown atau checkbox
async function fetchData(url, containerElement, keyId, keyName, isCheckbox = false) {
    if (!token) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Pastikan token digunakan dengan benar
            }
        });

        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();

        // Pastikan data memiliki properti "data" yang berisi array
        const listData = data.data || data; // Untuk kategori dan fasilitas

        if (!Array.isArray(listData)) {
            throw new Error("Format data tidak sesuai");
        }

        // Kosongkan container sebelum diisi
        containerElement.innerHTML = isCheckbox ? "" : `<option value="">Pilih</option>`; // kosongkan jika checkbox, atau pilih untuk dropdown

        // Tambahkan data ke container (dropdown/checkbox)
        listData.forEach(item => {
            if (isCheckbox) {
                // Membuat checkbox untuk fasilitas
                const checkboxWrapper = document.createElement("div");
                const checkboxInput = document.createElement("input");
                checkboxInput.type = "checkbox";
                checkboxInput.name = "fasilitasKos[]";
                checkboxInput.value = item[keyId];
                checkboxInput.id = `fasilitas_${item[keyId]}`;

                const checkboxLabel = document.createElement("label");
                checkboxLabel.setAttribute("for", checkboxInput.id);
                checkboxLabel.textContent = item[keyName];

                checkboxWrapper.appendChild(checkboxInput);
                checkboxWrapper.appendChild(checkboxLabel);
                containerElement.appendChild(checkboxWrapper);
            } else {
                // Membuat option untuk dropdown
                const option = document.createElement("option");
                option.value = item[keyId];
                option.textContent = item[keyName];
                containerElement.appendChild(option);
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

// Panggil fungsi untuk mengisi dropdown dan checkbox saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    const ownerKosContainer = document.getElementById("ownerKos");
    const categoryKosContainer = document.getElementById("categoryKos");
    const fasilitasKosContainer = document.getElementById("fasilitasKos");

    // Fetch data untuk Owner, Category, dan Facility
    fetchData("https://kosconnect-server.vercel.app/api/users/owner", ownerKosContainer, "user_id", "fullname");
    fetchData("https://kosconnect-server.vercel.app/api/categories/", categoryKosContainer, "category_id", "name");
    fetchData("https://kosconnect-server.vercel.app/api/facility/type?type=boarding_house", fasilitasKosContainer, "facility_id", "name", true);
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
    const rulesKos = document.getElementById("rulesKos").value;

    // Ambil fasilitas yang dipilih (bisa lebih dari satu)
    const fasilitasKos = Array.from(document.querySelectorAll("input[name='fasilitasKos[]']:checked")).map(opt => opt.value);
    // Ambil file gambar yang diunggah
    const imagesKos = document.getElementById("imagesKos").files;

    // Cek apakah jumlah gambar tidak lebih dari 5
    if (imagesKos.length > 5) {
        alert("Anda hanya bisa mengunggah maksimal 5 gambar.");
        return; // Hentikan eksekusi jika gambar lebih dari 5
    }

    const formData = new FormData();

    formData.append("owner_id", ownerKos);
    formData.append("category_id", categoryKos);
    formData.append("name", namaKos);
    formData.append("address", alamatKos);
    formData.append("longitude", longitudeKos);
    formData.append("latitude", latitudeKos);
    formData.append("description", descriptionKos);
    formData.append("rules", rulesKos);

    // Tambahkan fasilitas ke FormData dalam format array JSON
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
