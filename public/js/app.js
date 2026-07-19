let last = "";

function toggleMenu(){
    document.getElementById("sideMenu").classList.toggle("open");
    document.getElementById("overlay").classList.toggle("show");
}

function closeMenu(){
    document.getElementById("sideMenu").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
}

async function run(path){

    const json = document.getElementById("json");
    const apiKey = localStorage.getItem("apiKey");

    let finalPath = path;

    if(apiKey){
        finalPath += (path.includes("?") ? "&" : "?") + "apikey=" + encodeURIComponent(apiKey);
    }

    json.textContent = "Cargando...";

    try{

        const res = await fetch(finalPath);

        const data = await res.json();

        last = JSON.stringify(data, null, 2);

        json.textContent = last;

    }catch{

        json.textContent = "Error al obtener datos.";

    }

}

function copyEndpoint(btn){

    const card = btn.closest(".card");
    const pathEl = card ? card.querySelector(".path") : null;

    if(!pathEl) return;

    navigator.clipboard.writeText(location.origin + pathEl.textContent.trim());

    toast();

}

function copyJson(){

    navigator.clipboard.writeText(last);

    toast();

}

function copyApiKey(){

    const key = localStorage.getItem("apiKey");

    if(!key){
        alert("No se encontró tu API key. Cierra sesión y vuelve a entrar.");
        return;
    }

    navigator.clipboard.writeText(key);

    toast();

}

function refreshApiKeyInPaths(){

    const apiKey = localStorage.getItem("apiKey") || "TU_API_KEY";

    document.querySelectorAll(".path[data-endpoint]").forEach(function(el){
        el.textContent = el.getAttribute("data-endpoint").replace("TU_API_KEY", apiKey);
    });

}

document.addEventListener("DOMContentLoaded", function(){

    const input = document.getElementById("apiKeyInput");

    if(input){

        input.value = localStorage.getItem("apiKey") || "";

        input.addEventListener("input", function(){
            localStorage.setItem("apiKey", input.value.trim());
            refreshApiKeyInPaths();
        });

    }

    refreshApiKeyInPaths();

});

function logout(){

    localStorage.removeItem("token");

    window.location.href = "/login";

}

function toast(){

    const t = document.getElementById("toast");

    t.style.display = "block";

    setTimeout(() => {

        t.style.display = "none";

    }, 1800);

}
