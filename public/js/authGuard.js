(function () {

    // Debe coincidir con ADMIN_EMAIL de utils/seedAdmin.js
    const ADMIN_EMAIL = "cololacalempira5@gmail.com";

    function goLogin() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    const token = localStorage.getItem("token");

    if (!token) {
        goLogin();
        return;
    }

    let payload;

    try {
        payload = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
        goLogin();
        return;
    }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
        goLogin();
        return;
    }

    window.currentUser = payload.username;

    document.addEventListener("DOMContentLoaded", function () {

        const badge = document.getElementById("userBadge");

        if (badge) {
            badge.textContent = payload.username;
        }

        const adminLink = document.getElementById("adminLink");

        if (adminLink) {
            adminLink.style.display = (payload.username === ADMIN_EMAIL) ? "block" : "none";
        }

    });

})();
