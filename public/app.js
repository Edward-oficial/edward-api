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

    json.textContent = "Cargando...";

    try{

        const res = await fetch(path);

        const data = await res.json();

        last = JSON.stringify(data, null, 2);

        json.textContent = last;

    }catch{

        json.textContent = "Error al obtener datos.";

    }

}

function copyEndpoint(path){

    navigator.clipboard.writeText(location.origin + path);

    toast();

}

function copyJson(){

    navigator.clipboard.writeText(last);

    toast();

}

function toast(){

    const t = document.getElementById("toast");

    t.style.display = "block";

    setTimeout(() => {

        t.style.display = "none";

    }, 1800);

}
