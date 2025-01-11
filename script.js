function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    // Fungsi membaca nilai cookie berdasarkan nama
    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    }

    // Ambil token dan elemen yang dibutuhkan
    const authToken = getCookie("authToken");
    const userRole = getCookie("userRole");
    const userNameElement = document.querySelector(".user-dropdown .name");
    const adminWidgetElement = document.querySelector(".widget-info");

    if (authToken) {
        fetch("https://kosconnect-server.vercel.app/api/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch user data");
                return response.json();
            })
            .then(data => {
                const user = data.user;
                const userName = user?.fullname || userRole || "Admin Tidak Diketahui";
                userNameElement.textContent = userName;
                adminWidgetElement.textContent = userName; // Tambahkan nama admin ke widget
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                userNameElement.textContent = userRole || "Guest";
                adminWidgetElement.textContent = "Gagal Memuat Nama Admin";
            });
    } else {
        userNameElement.textContent = "Guest";
        adminWidgetElement.textContent = "Guest";
    }

    // Logika logout
    const logoutBtn = document.querySelector(".dropdown-menu li a");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure";
            document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure";

            // Arahkan ke halaman login setelah logout
            window.location.href = "https://kosconnect.github.io/login/";
        });
    }
});
