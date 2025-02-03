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

// Fungsi untuk mendapatkan ID dari URL
function getBoardingHouseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Ambil parameter id dari URL
}

const boarding_house_id = getBoardingHouseIdFromUrl(); // ID boarding house yang akan diedit

// Fungsi untuk fetch data berdasarkan ID
async function fetchBoardingHouseById(id) {
    if (!id) {
        console.error("ID Boarding House tidak ditemukan di URL.");
        return;
    }
    if (!token) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    try {
        const response = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Gagal mengambil data boarding house");

        const data = await response.json();
        populateForm(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fungsi untuk mengisi form dengan data yang didapat
function populateForm(data) {
    const boardingHouse = data.boardingHouse; // Ambil objek boardingHouse

    document.getElementById("ownerKos").value = boardingHouse.owner_id || "";
    document.getElementById("categoryKos").value = boardingHouse.category_id || "";
    document.getElementById("namaKos").value = boardingHouse.name || "";
    document.getElementById("alamatKos").value = boardingHouse.address || "";
    document.getElementById("descriptionKos").value = boardingHouse.description || "";
    document.getElementById("rulesKos").value = boardingHouse.rules || "";

    // Tandai fasilitas yang telah dipilih setelah checkbox tersedia
    setTimeout(() => {
        const selectedFacilities = new Set(boardingHouse.facilities_id || []);
        document.querySelectorAll("input[name='fasilitasKos[]']").forEach(checkbox => {
            checkbox.checked = selectedFacilities.has(checkbox.value);
        });
    }, 500);

    const imageContainer = document.getElementById("existingImages");
    if (imageContainer) {
        imageContainer.innerHTML = ""; // Hapus konten lama sebelum menambahkan gambar baru
        boardingHouse.images.forEach((image, index) => {
            const imageElement = document.createElement("img");
            imageElement.src = image;
            imageElement.alt = `Gambar ${index + 1}`;
            imageElement.style.width = "100px"; // Sesuaikan ukuran gambar jika perlu
            imageElement.style.marginRight = "10px";
            imageContainer.appendChild(imageElement);
        });
    }    
}

// Fungsi untuk fetch data dropdown dan checkbox
async function fetchData(url, containerElement, keyId, keyName, isCheckbox = false) {
    if (!token) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();
        const listData = data.data || data;

        if (!Array.isArray(listData)) {
            throw new Error("Format data tidak sesuai");
        }

        containerElement.innerHTML = isCheckbox ? "" : `<option value="">Pilih</option>`;

        listData.forEach(item => {
            if (isCheckbox) {
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
document.addEventListener("DOMContentLoaded", async () => {
    const ownerKosContainer = document.getElementById("ownerKos");
    const categoryKosContainer = document.getElementById("categoryKos");
    const fasilitasKosContainer = document.getElementById("fasilitasKos");

    await fetchData("https://kosconnect-server.vercel.app/api/users/owner", ownerKosContainer, "user_id", "fullname");
    await fetchData("https://kosconnect-server.vercel.app/api/categories/", categoryKosContainer, "category_id", "name");
    await fetchData("https://kosconnect-server.vercel.app/api/facility/type?type=boarding_house", fasilitasKosContainer, "facility_id", "name", true);

    if (boarding_house_id) {
        await fetchBoardingHouseById(boarding_house_id); // Fetch data boarding house jika ID tersedia
    }
});

// Fungsi untuk menangani submit form (PUT update)
document.getElementById("formTambahKos").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!boarding_house_id) return console.error("ID tidak ditemukan.");

    const formData = new FormData(this);

    // Ambil semua fasilitas yang dipilih
    const facilities = [];
    document.querySelectorAll("input[name='fasilitasKos[]']:checked").forEach(opt => {
        facilities.push(opt.value);
    });

    // Konversi FormData menjadi objek JSON
    const jsonData = {
        owner_id: document.getElementById("ownerKos").value,
        category_id: document.getElementById("categoryKos").value,
        name: document.getElementById("namaKos").value,
        address: document.getElementById("alamatKos").value,
        description: document.getElementById("descriptionKos").value,
        rules: document.getElementById("rulesKos").value,
        facilities: facilities // Kirim sebagai array, bukan string JSON
    };

    try {
        const response = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData) // Kirim dalam format JSON
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Gagal memperbarui data");
        }

        alert("Boarding House berhasil diperbarui!");
        window.location.href = "manajemen_kos.html";
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan: " + error.message);
    }
});
