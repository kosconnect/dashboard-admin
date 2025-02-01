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
    document.getElementById("ownerKos").value = data.owner_id || "";
    document.getElementById("categoryKos").value = data.category_id || "";
    document.getElementById("namaKos").value = data.name || "";
    document.getElementById("alamatKos").value = data.address || "";
    document.getElementById("longitudeKos").value = data.longitude || "";
    document.getElementById("latitudeKos").value = data.latitude || "";
    document.getElementById("descriptionKos").value = data.description || "";
    document.getElementById("rulesKos").value = data.rules || "";

    // Set fasilitas yang sudah dipilih sebelumnya
    const selectedFacilities = new Set((data.facilities || []).map(facility => facility.facility_id));
    document.querySelectorAll("input[name='fasilitasKos[]']").forEach(checkbox => {
        checkbox.checked = selectedFacilities.has(checkbox.value);
    });
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

    if (!boarding_house_id) {
        console.error("ID Boarding House tidak ditemukan. Tidak dapat melakukan update.");
        return;
    }

    const ownerKos = document.getElementById("ownerKos").value;
    const categoryKos = document.getElementById("categoryKos").value;
    const namaKos = document.getElementById("namaKos").value;
    const alamatKos = document.getElementById("alamatKos").value;
    const longitudeKos = document.getElementById("longitudeKos").value;
    const latitudeKos = document.getElementById("latitudeKos").value;
    const descriptionKos = document.getElementById("descriptionKos").value;
    const rulesKos = document.getElementById("rulesKos").value;

    const fasilitasKos = Array.from(document.querySelectorAll("input[name='fasilitasKos[]']:checked")).map(opt => opt.value);

    const imageInputs = document.querySelectorAll("input[name='imagesKos[]']");

    let imageCount = 0;
    const formData = new FormData();

    imageInputs.forEach((input) => {
        if (input.files.length > 0) {
            formData.append("images", input.files[0]);
            imageCount++;
        }
    });

    if (imageCount > 5) {
        alert("Anda hanya bisa mengunggah maksimal 5 gambar.");
        return;
    }

    formData.append("owner_id", ownerKos);
    formData.append("category_id", categoryKos);
    formData.append("name", namaKos);
    formData.append("address", alamatKos);
    formData.append("longitude", longitudeKos);
    formData.append("latitude", latitudeKos);
    formData.append("description", descriptionKos);
    formData.append("rules", rulesKos);
    formData.append("facilities", JSON.stringify(fasilitasKos));

    try {
        const response = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boarding_house_id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) throw new Error("Gagal memperbarui data");

        alert("Boarding House berhasil diperbarui!");
        window.location.href = "manajemen_kos.html";
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat memperbarui boarding house.");
    }
});
