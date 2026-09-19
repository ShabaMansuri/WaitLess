const API_URL = "http://127.0.0.1:8000";

let selectedLanguage = "en";
let currentCitizenToken = null;
let currentCitizenName = null;
let currentServingToken = null;
let queueRefreshInterval = null;
let turnNotificationShown = false;
let nearTurnNotificationShown = false;


// =====================================================
// LANGUAGE
// =====================================================

function selectLanguage(language) {

    selectedLanguage = language;

    const languageButtons =
        document.querySelectorAll(".language-option");

    languageButtons.forEach(button => {
        button.classList.remove("active");
    });

    if (language === "en") {
        languageButtons[0].classList.add("active");
    } else {
        languageButtons[1].classList.add("active");
    }

    setTimeout(() => {
        showScreen("homeScreen");
        updateLanguageText();
    }, 200);
}


function changeLanguage() {
    showScreen("languageScreen");
}


function updateLanguageText() {

    const homeTitle =
        document.getElementById("homeTitle");

    const homeDescription =
        document.getElementById("homeDescription");

    const citizenButton =
        document.getElementById("citizenButton");

    const staffButton =
        document.getElementById("staffButton");

    const languageButton =
        document.getElementById("languageButton");


    if (selectedLanguage === "hi") {

        homeTitle.innerHTML =
            "इंतज़ार मत करें।<br>अपनी बारी जानें।";

        homeDescription.innerText =
            "डिजिटल टोकन लें, अपनी कतार ट्रैक करें और जानें कि आपकी बारी कब आएगी।";

        citizenButton.innerHTML =
            '<span class="button-icon">●</span> मैं नागरिक हूँ <span>→</span>';

        staffButton.innerHTML =
            '<span class="button-icon">◉</span> मैं स्टाफ हूँ <span>→</span>';

        languageButton.innerHTML =
            "⇄ &nbsp; भाषा बदलें";

    } else {

        homeTitle.innerHTML =
            "Don't wait.<br>Know your turn.";

        homeDescription.innerText =
            "Get a digital token, track your queue, and know when it's your turn.";

        citizenButton.innerHTML =
            '<span class="button-icon">●</span> I\'m a Citizen <span>→</span>';

        staffButton.innerHTML =
            '<span class="button-icon">◉</span> I\'m Staff <span>→</span>';

        languageButton.innerHTML =
            "⇄ &nbsp; Change Language";
    }
}


// =====================================================
// SCREEN MANAGEMENT
// =====================================================

function showScreen(screenId) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.classList.add("hidden");
    });

    const selectedScreen =
        document.getElementById(screenId);

    if (selectedScreen) {
        selectedScreen.classList.remove("hidden");
    }


    if (screenId === "queueScreen") {

        startQueueAutoRefresh();

    } else {

        stopQueueAutoRefresh();
    }
}


function showCitizenScreen() {

    sessionStorage.setItem(
        "waitlessRole",
        "citizen"
    );

    localStorage.setItem(
        "waitlessRole",
        "citizen"
    );

    showScreen("citizenScreen");
}


function showStaffScreen() {

    sessionStorage.setItem(
        "waitlessRole",
        "staff"
    );

    localStorage.setItem(
        "waitlessRole",
        "staff"
    );

    showScreen("staffLoginScreen");
}


function goHome() {

    stopQueueAutoRefresh();

    sessionStorage.removeItem(
        "waitlessRole"
    );

    localStorage.removeItem(
        "waitlessRole"
    );

    showScreen("homeScreen");
}


// =====================================================
// SERVICES
// =====================================================

function updateServices() {

    const location =
        document.getElementById("locationSelect").value;

    const serviceSelect =
        document.getElementById("serviceSelect");

    serviceSelect.innerHTML = "";


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent =
        "Select service";

    serviceSelect.appendChild(defaultOption);


    if (location === "office") {

        addServiceOption(
            serviceSelect,
            "certificate",
            "Certificate Services"
        );

        addServiceOption(
            serviceSelect,
            "aadhaar",
            "Aadhaar Services"
        );

        addServiceOption(
            serviceSelect,
            "pension",
            "Pension Services"
        );

        addServiceOption(
            serviceSelect,
            "documents",
            "Document Verification"
        );
    }


    else if (location === "hospital") {

        addServiceOption(
            serviceSelect,
            "opd",
            "OPD Registration"
        );

        addServiceOption(
            serviceSelect,
            "appointment",
            "Doctor Appointment"
        );

        addServiceOption(
            serviceSelect,
            "lab",
            "Lab Test"
        );

        addServiceOption(
            serviceSelect,
            "pharmacy",
            "Pharmacy"
        );
    }
}


function addServiceOption(
    selectElement,
    value,
    text
) {

    const option =
        document.createElement("option");

    option.value = value;
    option.textContent = text;

    selectElement.appendChild(option);
}


// =====================================================
// SERVICE NAME
// =====================================================

function getServiceName(service) {

    const services = {

        certificate:
            "Certificate Services",

        aadhaar:
            "Aadhaar Services",

        pension:
            "Pension Services",

        documents:
            "Document Verification",

        opd:
            "OPD Registration",

        appointment:
            "Doctor Appointment",

        lab:
            "Lab Test",

        pharmacy:
            "Pharmacy"

    };

    return services[service] || service;
}


// =====================================================
// TOKEN FORMAT
// =====================================================

function formatToken(token) {

    return `A-${String(token).padStart(3, "0")}`;

}


// =====================================================
// SAVE CITIZEN TOKEN
// =====================================================

function saveCitizenToken(token, name) {

    localStorage.setItem(
        "waitlessCitizenToken",
        String(token)
    );

    localStorage.setItem(
        "waitlessCitizenName",
        name || ""
    );
}


// =====================================================
// LOAD CITIZEN TOKEN
// =====================================================

function loadSavedCitizenToken() {

    const savedToken =
        localStorage.getItem(
            "waitlessCitizenToken"
        );

    const savedName =
        localStorage.getItem(
            "waitlessCitizenName"
        );


    if (!savedToken) {
        return false;
    }


    currentCitizenToken =
        Number(savedToken);

    currentCitizenName =
        savedName || "";


    const tokenNumber =
        document.getElementById(
            "tokenNumber"
        );

    const citizenName =
        document.getElementById(
            "citizenName"
        );


    if (tokenNumber) {

        tokenNumber.innerText =
            formatToken(currentCitizenToken);
    }


    if (citizenName) {

        citizenName.innerText =
            currentCitizenName;
    }


    showScreen("queueScreen");

    updateCitizenQueueInfo();

    return true;
}


// =====================================================
// CLEAR CITIZEN TOKEN
// =====================================================

function clearCitizenToken() {

    localStorage.removeItem(
        "waitlessCitizenToken"
    );

    localStorage.removeItem(
        "waitlessCitizenName"
    );

    currentCitizenToken = null;
    currentCitizenName = null;

    turnNotificationShown = false;
    nearTurnNotificationShown = false;
}


// =====================================================
// CREATE TOKEN
// =====================================================

async function getToken() {

    const name =
        document.getElementById("nameInput")
            .value.trim();

    const mobile =
        document.getElementById("mobileInput")
            .value.trim();

    const location =
        document.getElementById("locationSelect")
            .value;

    const service =
        document.getElementById("serviceSelect")
            .value;


    if (!name) {

        alert("Please enter your name.");
        return;
    }


    if (!/^\d{10}$/.test(mobile)) {

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        return;
    }


    if (!location) {

        alert(
            "Please select a service location."
        );

        return;
    }


    if (!service) {

        alert("Please select a service.");
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/token`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        mobile: mobile,
                        location: location,
                        service: service
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.detail ||
                data.error ||
                "Unable to create token."
            );

            return;
        }


        currentCitizenToken =
            data.token;

        currentCitizenName =
            data.name;

        turnNotificationShown = false;
        nearTurnNotificationShown = false;


        saveCitizenToken(
            data.token,
            data.name
        );


        sessionStorage.setItem(
            "waitlessRole",
            "citizen"
        );

        localStorage.setItem(
            "waitlessRole",
            "citizen"
        );


        prepareNotifications();


        showScreen("queueScreen");


        document.getElementById("tokenNumber")
            .innerText =
            formatToken(data.token);


        document.getElementById("citizenName")
            .innerText =
            data.name;


        await updateCitizenQueueInfo();


    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to WaitLess backend. " +
            "Please make sure the backend is running."
        );
    }
}


// =====================================================
// QUEUE INFORMATION
// =====================================================

async function loadQueue() {

    try {

        const response =
            await fetch(
                `${API_URL}/queue`
            );


        const data =
            await response.json();


        return data;


    } catch (error) {

        console.error(
            "Queue loading error:",
            error
        );

        return null;
    }
}


// =====================================================
// UPDATE NOW SERVING
// =====================================================

function updateNowServing(currentServing) {

    const nowServing =
        document.getElementById("nowServing");


    if (!nowServing) {
        return;
    }


    if (currentServing) {

        nowServing.innerText =
            formatToken(
                currentServing.token
            );

        currentServingToken =
            currentServing.token;

    } else {

        nowServing.innerText =
            "—";

        currentServingToken =
            null;
    }
}


// =====================================================
// ETA + CITIZEN STATUS
// =====================================================

async function updateCitizenQueueInfo() {

    if (!currentCitizenToken) {
        return;
    }


    try {

        const queueData =
            await loadQueue();


        if (queueData) {

            updateNowServing(
                queueData.current_serving
            );
        }


        const response =
            await fetch(
                `${API_URL}/eta/${currentCitizenToken}`
            );


        const data =
            await response.json();


        if (data.error) {
            return;
        }


        const peopleAhead =
            document.getElementById(
                "peopleAhead"
            );


        const peopleAheadText =
            document.getElementById(
                "peopleAheadText"
            );


        const waitTime =
            document.getElementById(
                "waitTime"
            );


        const queueSuccess =
            document.getElementById(
                "queueSuccess"
            );


        const queueStatus =
            document.getElementById(
                "queueStatus"
            );


        const notificationInfo =
            document.getElementById(
                "notificationInfo"
            );


        const isMyTurn =
            data.status === "serving";


        if (peopleAhead) {

            peopleAhead.innerText =
                data.people_ahead;
        }


        if (peopleAheadText) {

            peopleAheadText.innerText =
                `${data.people_ahead} people ahead`;
        }


        if (waitTime) {

            waitTime.innerText =
                `${data.eta_minutes} min`;
        }


        // =============================================
        // MY TURN
        // =============================================

        if (isMyTurn) {

            if (queueSuccess) {

                queueSuccess.innerText =
                    "It's your turn!";
            }


            if (queueStatus) {

                queueStatus.innerText =
                    "It's your turn ✓";
            }


            if (notificationInfo) {

                const strong =
                    notificationInfo.querySelector(
                        "strong"
                    );

                const small =
                    notificationInfo.querySelector(
                        "small"
                    );


                if (strong) {

                    strong.innerText =
                        "Your turn has arrived.";
                }


                if (small) {

                    small.innerText =
                        "Please proceed to the service counter.";
                }
            }


            sendTurnNotification();


        } else {

            // =========================================
            // STILL WAITING
            // =========================================

            if (queueSuccess) {

                queueSuccess.innerText =
                    "You're in the queue!";
            }


            if (queueStatus) {

                queueStatus.innerText =
                    "You're in the queue ✓";
            }


            if (notificationInfo) {

                const strong =
                    notificationInfo.querySelector(
                        "strong"
                    );

                const small =
                    notificationInfo.querySelector(
                        "small"
                    );


                if (strong) {

                    strong.innerText =
                        "We'll notify you before your turn.";
                }


                if (small) {

                    small.innerText =
                        "You can wait comfortably until your queue is near.";
                }
            }


            if (
                data.people_ahead === 1 &&
                !nearTurnNotificationShown
            ) {

                sendNearTurnNotification();
            }
        }


    } catch (error) {

        console.error(
            "ETA error:",
            error
        );
    }
}


// =====================================================
// BROWSER NOTIFICATIONS
// =====================================================

function prepareNotifications() {

    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission()
            .catch(error => {

                console.error(
                    "Notification permission error:",
                    error
                );

            });
    }
}


function sendNearTurnNotification() {

    nearTurnNotificationShown = true;


    if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) {
        return;
    }


    new Notification(
        "WaitLess — Your turn is coming soon",
        {
            body:
                `Token ${formatToken(currentCitizenToken)} is next. Please get ready.`
        }
    );
}


function sendTurnNotification() {

    if (turnNotificationShown) {
        return;
    }


    turnNotificationShown = true;


    if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) {
        return;
    }


    new Notification(
        "WaitLess — It's your turn!",
        {
            body:
                `Token ${formatToken(currentCitizenToken)} is now being served. Please proceed to the service counter.`
        }
    );
}


// =====================================================
// CITIZEN AUTO REFRESH
// =====================================================

function startQueueAutoRefresh() {

    stopQueueAutoRefresh();

    updateCitizenQueueInfo();


    queueRefreshInterval =
        setInterval(
            () => {

                updateCitizenQueueInfo();

            },
            2000
        );
}


function stopQueueAutoRefresh() {

    if (queueRefreshInterval) {

        clearInterval(
            queueRefreshInterval
        );

        queueRefreshInterval = null;
    }
}


// =====================================================
// LEAVE QUEUE
// =====================================================

async function leaveQueue() {

    if (!currentCitizenToken) {

        goHome();
        return;
    }


    const confirmLeave =
        confirm(
            "Are you sure you want to leave the queue?"
        );


    if (!confirmLeave) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/queue/leave?token=${currentCitizenToken}`,
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        if (data.error) {

            alert(data.error);
            return;
        }


        alert(
            "You have left the queue."
        );


        clearCitizenToken();


        goHome();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the backend."
        );
    }
}


// =====================================================
// STAFF LOGIN
// =====================================================

function staffLogin() {

    const password =
        document.getElementById(
            "staffPassword"
        ).value;


    if (!password) {

        alert(
            "Please enter password."
        );

        return;
    }


    if (password === "staff123") {

        sessionStorage.setItem(
            "waitlessRole",
            "staff"
        );

        localStorage.setItem(
            "waitlessRole",
            "staff"
        );


        showScreen(
            "staffScreen"
        );


        renderStaffQueue();

    } else {

        alert(
            "Invalid password."
        );
    }
}


// =====================================================
// STAFF QUEUE
// =====================================================

async function renderStaffQueue() {

    try {

        const data =
            await loadQueue();


        if (!data) {
            return;
        }


        const waitingCount =
            document.getElementById(
                "waitingCount"
            );


        const queueTableBody =
            document.getElementById(
                "queueTableBody"
            );


        if (waitingCount) {

            waitingCount.innerText =
                `${data.people_waiting} people waiting`;
        }


        if (data.current_serving) {

            const currentToken =
                document.getElementById(
                    "currentToken"
                );

            const currentCitizenName =
                document.getElementById(
                    "currentCitizenName"
                );

            const currentCitizenMobile =
                document.getElementById(
                    "currentCitizenMobile"
                );


            if (currentToken) {

                currentToken.innerText =
                    formatToken(
                        data.current_serving.token
                    );
            }


            if (currentCitizenName) {

                currentCitizenName.innerText =
                    data.current_serving.name;
            }


            if (currentCitizenMobile) {

                currentCitizenMobile.innerText =
                    `📱 ${data.current_serving.mobile}`;
            }


            currentServingToken =
                data.current_serving.token;

        } else {

            resetStaffButtons();
        }


        if (!queueTableBody) {
            return;
        }


        queueTableBody.innerHTML = "";


        if (
            !data.waiting_tokens ||
            data.waiting_tokens.length === 0
        ) {

            const emptyRow =
                document.createElement(
                    "div"
                );


            emptyRow.className =
                "queue-table-row";


            emptyRow.innerHTML = `
                <span>—</span>
                <span>No citizens are currently waiting.</span>
                <span>—</span>
                <span>—</span>
            `;


            queueTableBody.appendChild(
                emptyRow
            );


            return;
        }


        data.waiting_tokens.forEach(
            token => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "queue-table-row";


                row.innerHTML = `
                    <span>
                        ${formatToken(token.token)}
                    </span>

                    <span>
                        ${escapeHTML(token.name)}
                    </span>

                    <span>
                        ${escapeHTML(token.mobile)}
                    </span>

                    <span>
                        ${escapeHTML(
                            getServiceName(
                                token.service
                            )
                        )}
                    </span>
                `;


                queueTableBody.appendChild(
                    row
                );
            }
        );


    } catch (error) {

        console.error(
            "Staff queue error:",
            error
        );
    }
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// =====================================================
// CALL NEXT
// =====================================================

async function callNext() {

    try {

        const response =
            await fetch(
                `${API_URL}/queue/next`,
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        if (
            data.message ===
            "No waiting tokens"
        ) {

            alert(
                "No waiting tokens."
            );

            return;
        }


        if (data.error) {

            alert(data.error);
            return;
        }


        currentServingToken =
            data.token;


        const currentToken =
            document.getElementById(
                "currentToken"
            );


        const currentCitizenName =
            document.getElementById(
                "currentCitizenName"
            );


        const currentCitizenMobile =
            document.getElementById(
                "currentCitizenMobile"
            );


        if (currentToken) {

            currentToken.innerText =
                formatToken(
                    data.token
                );
        }


        if (currentCitizenName) {

            currentCitizenName.innerText =
                data.name;
        }


        if (currentCitizenMobile) {

            currentCitizenMobile.innerText =
                `📱 ${data.mobile}`;
        }


        const nextButton =
            document.getElementById(
                "nextButton"
            );


        const completeButton =
            document.getElementById(
                "completeButton"
            );


        const skipButton =
            document.getElementById(
                "skipButton"
            );


        if (nextButton) {

            nextButton.style.display =
                "none";
        }


        if (completeButton) {

            completeButton.style.display =
                "flex";
        }


        if (skipButton) {

            skipButton.style.display =
                "flex";
        }


        await renderStaffQueue();

        await updateCitizenQueueInfo();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to call next token."
        );
    }
}


// =====================================================
// COMPLETE TOKEN
// =====================================================

async function completeToken() {

    if (!currentServingToken) {

        alert(
            "No token is currently being served."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/queue/complete?token=${currentServingToken}`,
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        if (data.error) {

            alert(data.error);
            return;
        }


        alert(
            `Token ${formatToken(
                currentServingToken
            )} completed.`
        );


        resetStaffButtons();


        currentServingToken =
            null;


        await renderStaffQueue();

        await updateCitizenQueueInfo();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to complete token."
        );
    }
}


// =====================================================
// SKIP TOKEN
// =====================================================

async function skipToken() {

    if (!currentServingToken) {

        alert(
            "No token is currently being served."
        );

        return;
    }


    const confirmSkip =
        confirm(
            `Skip token ${formatToken(
                currentServingToken
            )}?`
        );


    if (!confirmSkip) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/queue/skip?token=${currentServingToken}`,
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        if (data.error) {

            alert(data.error);
            return;
        }


        alert(
            `Token ${formatToken(
                currentServingToken
            )} skipped.`
        );


        resetStaffButtons();


        currentServingToken =
            null;


        await renderStaffQueue();

        await updateCitizenQueueInfo();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to skip token."
        );
    }
}


// =====================================================
// RESET STAFF BUTTONS
// =====================================================

function resetStaffButtons() {

    const nextButton =
        document.getElementById(
            "nextButton"
        );


    const completeButton =
        document.getElementById(
            "completeButton"
        );


    const skipButton =
        document.getElementById(
            "skipButton"
        );


    if (nextButton) {

        nextButton.style.display =
            "flex";
    }


    if (completeButton) {

        completeButton.style.display =
            "none";
    }


    if (skipButton) {

        skipButton.style.display =
            "none";
    }


    const currentToken =
        document.getElementById(
            "currentToken"
        );


    const currentCitizenName =
        document.getElementById(
            "currentCitizenName"
        );


    const currentCitizenMobile =
        document.getElementById(
            "currentCitizenMobile"
        );


    if (currentToken) {

        currentToken.innerText =
            "—";
    }


    if (currentCitizenName) {

        currentCitizenName.innerText =
            "No citizen currently being served";
    }


    if (currentCitizenMobile) {

        currentCitizenMobile.innerText =
            "";
    }
}


// =====================================================
// REFRESH STAFF QUEUE
// =====================================================

async function refreshStaffQueue() {

    await renderStaffQueue();

}


// =====================================================
// RESTORE PAGE AFTER REFRESH
// =====================================================

function restorePageAfterRefresh() {

    let role =
        sessionStorage.getItem(
            "waitlessRole"
        );


    if (!role) {

        role =
            localStorage.getItem(
                "waitlessRole"
            );

        if (role) {

            sessionStorage.setItem(
                "waitlessRole",
                role
            );
        }
    }


    // Citizen was using the app

    if (role === "citizen") {

        const restored =
            loadSavedCitizenToken();


        if (restored) {

            prepareNotifications();

            return;
        }


        sessionStorage.removeItem(
            "waitlessRole"
        );

        localStorage.removeItem(
            "waitlessRole"
        );

        showScreen("homeScreen");

        return;
    }


    // Staff was using the app

    if (role === "staff") {

        showScreen("staffScreen");

        renderStaffQueue();

        return;
    }


    // No active role

    showScreen("homeScreen");
}


// =====================================================
// INITIAL SETUP
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const completeButton =
            document.getElementById(
                "completeButton"
            );


        const skipButton =
            document.getElementById(
                "skipButton"
            );


        if (completeButton) {

            completeButton.style.display =
                "none";
        }


        if (skipButton) {

            skipButton.style.display =
                "none";
        }


        updateLanguageText();


        // Restore the correct page

        restorePageAfterRefresh();

    }
);