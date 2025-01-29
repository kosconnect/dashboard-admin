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

// Fungsi untuk fetch data dan mengisi dropdown dengan metode POST
async function fetchAndFillDropdown(url, dropdownId, valueKey, textKey) {
    try {
        const token = getCookie("token"); // Ambil token dari cookie
        const response = await fetch(url, {
            method: "POST", // Ganti ke POST
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"  // Pastikan headernya mengizinkan JSON
            },
            credentials: "include",
            body: JSON.stringify({})  // Jika perlu body kosong atau data tertentu
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari ${url}`);
        }

        const data = await response.json();
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '<option value="">Pilih</option>'; // Reset dropdown

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueKey];  // ID sebagai value
            option.textContent = item[textKey]; // Nama sebagai teks
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error(`Error fetching data for ${dropdownId}:`, error);
    }
}

// Panggil fungsi untuk mengisi dropdown setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
    // Mengisi dropdown Owner
    fetchAndFillDropdown("https://kosconnect-server.vercel.app/api/users/owner", "ownerKos", "_id", "full_name");
    
    // Mengisi dropdown Kategori
    fetchAndFillDropdown("https://kosconnect-server.vercel.app/api/categories/", "categoryKos", "_id", "name");
    
    // Mengisi dropdown Fasilitas untuk Boarding House
    fetchAndFillDropdown("https://kosconnect-server.vercel.app/api/facility/type?type=boarding_house", "fasilitasKos", "_id", "name");
});
