
const icons = document.querySelectorAll(".image-button");
const windows = document.querySelectorAll(".window");
const tabsContainer = document.querySelector(".window-tabs");

let activeWindow = null;
let highestZ = 60;

// OUVRIR UNE FENÊTRE

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.add("open");

    let tab = document.querySelector(
        `.task-tab[data-target="${id}"]`
    );

    // Créer l'onglet s'il n'existe pas
    if (!tab) {
        tab = document.createElement("button");
        tab.className = "task-tab";
        tab.dataset.target = id;

        tab.textContent = win.querySelector(
            ".window-title span"
        ).textContent;

        tabsContainer.appendChild(tab);

        tab.addEventListener("click", () => {
            if (activeWindow === id && win.classList.contains("open")) {
                minimizeWindow(id);
            } else {
                openWindow(id);
            }
        });
    }

    activateWindow(id);
}

// ACTIVER UNE FENÊTRE

function activateWindow(id) {
    const win = document.getElementById(id);
    if (!win || !win.classList.contains("open")) return;

    windows.forEach(w => {
        w.classList.remove("selected");
    });

    highestZ++;
    win.style.zIndex = highestZ;
    win.classList.add("selected");

    activeWindow = id;

    document.querySelectorAll(".task-tab").forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.target === id
        );
    });
}

// RÉDUIRE UNE FENÊTRE

function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.remove("open");
    win.classList.remove("selected");

    if (activeWindow === id) {
        activeWindow = null;
    }

    updateTabs();
}

// FERMER UNE FENÊTRE

function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.remove("open");
    win.classList.remove("selected");

    const tab = document.querySelector(
        `.task-tab[data-target="${id}"]`
    );

    if (tab) tab.remove();

    if (activeWindow === id) {
        activeWindow = null;
    }

    updateTabs();
}

// MISE À JOUR DES ONGLETS

function updateTabs() {
    const openWindows = [...windows].filter(
        win => win.classList.contains("open")
    );

    if (openWindows.length > 0) {
        const lastWindow = openWindows.reduce(
            (highest, win) =>
                Number(win.style.zIndex) >
                Number(highest.style.zIndex)
                    ? win
                    : highest
        );

        activateWindow(lastWindow.id);
    } else {
        activeWindow = null;

        document.querySelectorAll(".task-tab").forEach(tab => {
            tab.classList.remove("active");
        });
    }
}

// CLIC SUR LES ICÔNES DU BUREAU

icons.forEach(icon => {
    icon.addEventListener("click", () => {
        openWindow(icon.dataset.window);
    });
});

// BOUTONS FERMER ET RÉDUIRE

windows.forEach(win => {
    const id = win.id;

    win.querySelector(".close").addEventListener("click", () => {
        closeWindow(id);
    });

    win.querySelector(".minimize").addEventListener("click", () => {
        minimizeWindow(id);
    });

    win.addEventListener("mousedown", () => {
        activateWindow(id);
    });
});

// DÉPLACER LES FENÊTRES À LA SOURIS

windows.forEach(win => {
    const title = win.querySelector(".window-title");

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    title.addEventListener("mousedown", e => {
        if (e.target.closest("button")) return;

        dragging = true;
        activateWindow(win.id);

        const rect = win.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener("mousemove", e => {
        if (!dragging) return;

        const desktop = document.querySelector(".desktop");
        const rect = desktop.getBoundingClientRect();

        let x = e.clientX - offsetX - rect.left;
        let y = e.clientY - offsetY - rect.top;

        x = Math.max(0, Math.min(
            x, rect.width - win.offsetWidth
        ));

        y = Math.max(0, Math.min(
            y, rect.height - win.offsetHeight
        ));

        win.style.left = x + "px";
        win.style.top = y + "px";
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
    });
});

// HORLOGE ET DATE

function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
}

updateClock();
setInterval(updateClock, 1000);

// MENU DÉMARRER

const startButton = document.querySelector(".start-button");
const startMenu = document.querySelector("#startMenu");

startButton.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("visible");
});

// Fermer le menu en cliquant ailleurs

document.addEventListener("click", (e) => {
    if (
        !startMenu.contains(e.target) &&
        !startButton.contains(e.target)
    ) {
        startMenu.classList.remove("visible");
    }
});

// Fermer le menu après avoir choisi un programme

document.querySelectorAll(".start-menu-left button")
    .forEach(button => {
        button.addEventListener("click", () => {
            startMenu.classList.remove("visible");
        });
    });

// Arrêter

document.querySelector("#shutdownButton")
    .addEventListener("click", () => {
        startMenu.classList.remove("visible");
        alert("Merci d'avoir visioner ma candiadature !");
    });

    // BOUTON A BON ?

const btnRappel = document.getElementById("btn-rappel");
const popup = document.getElementById("popup-question");

const popupOK = document.getElementById("popup-ok");
const popupNon = document.getElementById("popup-non");

// Afficher le pop-up
btnRappel.addEventListener("click", () => {
    popup.style.display = "flex";
});

// Réponse NON
popupNon.addEventListener("click", () => {
    popup.style.display = "none";
});

