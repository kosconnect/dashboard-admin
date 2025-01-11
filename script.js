function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    // Toggle the display between none and block
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

document.addEventListener("DOMContentLoaded", () => {
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
  
    // Elemen header dan user info
    const userNameElement = document.querySelector(".user-dropdown .name");
    const userRoleElement = document.querySelector(".user-dropdown .role");
  
    // Logika mengganti informasi pengguna berdasarkan authToken
    if (authToken) {
      // Fetch user data dari endpoint backend
      fetch("https://kosconnect-server.vercel.app/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        })
        .then((data) => {
          // Update nama dan peran pengguna di UI
          const user = data.user;
          if (user && user.fullname) {
            userNameElement.textContent = user.fullname;
          } else {
            console.warn("User data is incomplete. Falling back to user role.");
            if (userRole) {
              userNameElement.textContent = userRole;
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Fallback ke userRole dari cookie jika tersedia
          if (userRole) {
            userNameElement.textContent = userRole;
          }
        });
    } else {
      // Jika tidak ada token, tampilkan nilai default
      userNameElement.textContent = "Guest";
    }
  
    // Logika logout
    const logoutBtn = document.querySelector(".dropdown-menu li a");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
      });
    }
  });
  