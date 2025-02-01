// const urlParams = new URLSearchParams(window.location.search);
// const boardingHouseId = urlParams.get('boarding_house_id');
// console.log("Boarding House ID:", boardingHouseId);

// Fungsi untuk membaca boarding_house_id dari URL
function getBoardingHouseIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("boarding_house_id");
}

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
async function fetchData(url, containerElement, keyId, keyName) {
    if (!token) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();
        const listData = data.data || data;

        if (!Array.isArray(listData)) {
            throw new Error("Format data tidak sesuai");
        }

        containerElement.innerHTML = "";

        listData.forEach(item => {
            const checkboxWrapper = document.createElement("div");
            const checkboxInput = document.createElement("input");
            checkboxInput.type = "checkbox";
            checkboxInput.name = containerElement.id + "[]";
            checkboxInput.value = item[keyId];
            checkboxInput.id = `${containerElement.id}_${item[keyId]}`;

            const checkboxLabel = document.createElement("label");
            checkboxLabel.setAttribute("for", checkboxInput.id);
            checkboxLabel.textContent = item[keyName];

            checkboxWrapper.appendChild(checkboxInput);
            checkboxWrapper.appendChild(checkboxLabel);
            containerElement.appendChild(checkboxWrapper);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

// Fungsi untuk fetch owner_id dari boarding house
async function fetchOwnerIdAndFacilities() {
    const boardingHouseId = getBoardingHouseIdFromURL();
    if (!boardingHouseId) {
        console.error("Boarding house ID tidak ditemukan di URL.");
        return;
    }

    if (!token) {
        console.error("Tidak ada token JWT, tidak dapat melanjutkan permintaan.");
        return;
    }

    try {
        // Fetch data boarding house berdasarkan boarding_house_id
        const response = await fetch(`https://kosconnect-server.vercel.app/api/boardingHouses/${boardingHouseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Gagal mengambil data boarding house");

        const data = await response.json();
        const ownerId = data?.data?.owner_id;

        if (!ownerId) {
            console.error("Owner ID tidak ditemukan.");
            return;
        }

        console.log("Owner ID:", ownerId);

        // Fetch custom facilities berdasarkan owner_id
        const fasilitasTambahanContainer = document.getElementById("fasilitasTambahan");
        fetchData(`https://kosconnect-server.vercel.app/api/customFacilities/admin?owner_id=${ownerId}`, fasilitasTambahanContainer, "facility_id", "name");

    } catch (error) {
        console.error("Error:", error);
    }
}

// Panggil fungsi untuk mengisi fasilitas saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    const fasilitasKamarContainer = document.getElementById("fasilitasKamar");

    // Fetch fasilitas umum tanpa owner_id
    fetchData("https://kosconnect-server.vercel.app/api/facility/type?type=room", fasilitasKamarContainer, "facility_id", "name");

    // Fetch fasilitas tambahan berdasarkan owner_id
    fetchOwnerIdAndFacilities();
});

// Fungsi untuk menangani submit form
document.getElementById("formTambahKamar").addEventListener("submit", async function (e) {
    e.preventDefault();

    const tipeKamar = document.getElementById("tipeKamar").value;
    const ukuranKamar = document.getElementById("ukuranKamar").value;
    const hargaKamar = document.getElementById("hargaKamar").value;
    const kamarTersedia = document.getElementById("kamarTersedia").value;
    const fasilitasKamar = Array.from(document.querySelectorAll("input[name='fasilitasKamar[]']:checked")).map(opt => opt.value);
    const fasilitasTambahan = Array.from(document.querySelectorAll("input[name='fasilitasTambahan[]']:checked")).map(opt => opt.value);
    const imagesKamar = document.getElementById("imagesKamar").files;

    if (imagesKamar.length > 5) {
        alert("Anda hanya bisa mengunggah maksimal 5 gambar.");
        return;
    }

    const formData = new FormData();
    formData.append("type", tipeKamar);
    formData.append("size", ukuranKamar);
    formData.append("price", hargaKamar);
    formData.append("available_rooms", kamarTersedia);
    formData.append("facilities", JSON.stringify(fasilitasKamar));
    formData.append("additional_facilities", JSON.stringify(fasilitasTambahan));

    for (let i = 0; i < imagesKamar.length; i++) {
        formData.append("images", imagesKamar[i]);
    }

    try {
        const response = await fetch("https://kosconnect-server.vercel.app/api/rooms/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) throw new Error("Gagal menyimpan data");

        alert("Kamar berhasil ditambahkan!"); 
        window.location.href = "manajemen_kamar_kos.html";
    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menambahkan kamar."); 
    }
});
