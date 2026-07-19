(function () {

    function goLogin() {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    const token = localStorage.getItem("token");

    if (!token) {
        goLogin();
        return;
    }

    try {

        const payload = JSON.parse(atob(token.split(".")[1]));

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            goLogin();
        }

    } catch (err) {
        goLogin();
    }

})();