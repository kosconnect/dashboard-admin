function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector('.dropdown-menu');
    const userNameElement = document.querySelector(".user-dropdown .name");
    const userRoleElement = document.querySelector(".user-dropdown .role");
    const logoutBtn = document.querySelector(".dropdown-menu li a");

    // Fungsi toggle dropdown
    function toggleDropdown() {
        dropdown.classList.toggle('show');
    }

    document.querySelector(".user-dropdown").addEventListener("click", toggleDropdown);

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

    // Ambil token dan role dari cookie
    const authToken = getCookie("authToken");
    const userRole = getCookie("userRole");

    // Memuat data pengguna
    async function loadUserData() {
        if (authToken) {
            try {
                const response = await fetch("https://kosconnect-server.vercel.app/api/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch user data");

                const data = await response.json();
                const user = data.user;

                if (user && user.fullname) {
                    userNameElement.textContent = user.fullname;
                } else if (userRole) {
                    userNameElement.textContent = userRole;
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (userRole) {
                    userNameElement.textContent = userRole;
                }
            }
        } else {
            userNameElement.textContent = "Guest";
        }
    }

    // Logika logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            
            // Hapus cookies authToken dan userRole
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // Arahkan ke halaman login
            window.location.href = "https://kosconnect.github.io/login/";
        });
    }

    // Panggil fungsi memuat data pengguna
    loadUserData();
});
