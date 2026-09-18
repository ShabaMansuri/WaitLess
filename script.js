
// =====================================================
// WAITLESS - FRONTEND DEMO
// =====================================================


// =====================================================
// DEMO QUEUE DATA
// =====================================================

// Citizens who have taken a token
let waitlessQueue = [
    {
        token: "A-018",
        name: "Neha Verma",
        mobile: "97XXXXXX45",
        service: "OPD Registration"
    },

    {
        token: "A-019",
        name: "Suresh Patel",
        mobile: "99XXXXXX12",
        service: "OPD Registration"
    },

    {
        token: "A-020",
        name: "Anjali Singh",
        mobile: "98XXXXXX67",
        service: "OPD Registration"
    },

    {
        token: "A-021",
        name: "Rahul Sharma",
        mobile: "96XXXXXX89",
        service: "OPD Registration"
    }
];


// Current citizen being served
let currentServing = {
    token: "A-017",
    name: "Rohan Mehta",
    mobile: "98XXXXXX21",
    service: "OPD Registration"
};


// Next token number
let nextTokenNumber = 22;


// =====================================================
// LANGUAGE MESSAGE HELPER
// =====================================================

function showMessage(english, hindi) {

    const language =
        localStorage.getItem("waitlessLanguage") || "en";

    if (language === "hi") {
        alert(hindi);
    } else {
        alert(english);
    }

}


// =====================================================
// CHANGE LANGUAGE
// =====================================================

function changeLanguage() {

    document.getElementById("homeScreen")
        .classList.add("hidden");

    document.getElementById("languageScreen")
        .classList.remove("hidden");

}


// =====================================================
// SELECT LANGUAGE
// =====================================================

function selectLanguage(language) {

    localStorage.setItem(
        "waitlessLanguage",
        language
    );

    document.getElementById("languageScreen")
        .classList.add("hidden");

    document.getElementById("homeScreen")
        .classList.remove("hidden");

    updateLanguage();

}


// =====================================================
// UPDATE LANGUAGE
// =====================================================

function updateLanguage() {

    const language =
        localStorage.getItem("waitlessLanguage") || "en";


    // =================================================
    // HINDI
    // =================================================

    if (language === "hi") {

        document.getElementById("nameLabel").textContent =
            "पूरा नाम";

        document.getElementById("nameInput").placeholder =
            "अपना नाम दर्ज करें";

        document.getElementById("mobileLabel").textContent =
            "मोबाइल नंबर";

        document.getElementById("mobileInput").placeholder =
            "10 अंकों का मोबाइल नंबर दर्ज करें";

        document.getElementById("tokenTitle").textContent =
            "अपना टोकन लें";

        document.getElementById("tokenDescription").textContent =
            "जहाँ आपको सेवा चाहिए, उसे चुनें और सही कतार में शामिल हों।";

        document.getElementById("locationLabel").textContent =
            "सेवा स्थान";

        document.getElementById("serviceLabel").textContent =
            "सेवा";

        document.getElementById("getTokenButton").textContent =
            "टोकन लें 🎟️";

        document.getElementById("backButton").textContent =
            "← वापस";

        document.getElementById("homeTitle").innerHTML =
            "इंतज़ार न करें।<br>अपनी बारी जानें।";

        document.getElementById("homeDescription").textContent =
            "डिजिटल टोकन लें, अपनी कतार देखें और जानें कि आपकी बारी कब आएगी।";

        document.getElementById("citizenButton").textContent =
            "मैं नागरिक हूँ";

        document.getElementById("staffButton").textContent =
            "मैं स्टाफ हूँ";

        document.getElementById("languageButton").textContent =
            "🌐 भाषा बदलें";

        document.getElementById("yourTokenLabel").textContent =
            "आपका टोकन";

        document.getElementById("queueStatus").textContent =
            "आप कतार में हैं ✓";

        document.getElementById("nowServingLabel").textContent =
            "अभी चल रहा है";

        document.getElementById("peopleAheadLabel").textContent =
            "आपसे आगे";

        document.getElementById("waitTimeLabel").textContent =
            "अनुमानित प्रतीक्षा समय";

        document.getElementById("queueProgressLabel").textContent =
            "कतार की प्रगति";

        document.getElementById("notificationInfo").textContent =
            "🔔 आपकी बारी आने से पहले हम आपको सूचित करेंगे।";

        document.getElementById("leaveQueueButton").textContent =
            "कतार छोड़ें";

    }


    // =================================================
    // ENGLISH
    // =================================================

    else {

        document.getElementById("nameLabel").textContent =
            "Full Name";

        document.getElementById("nameInput").placeholder =
            "Enter your name";

        document.getElementById("mobileLabel").textContent =
            "Mobile Number";

        document.getElementById("mobileInput").placeholder =
            "Enter 10 digit mobile number";

        document.getElementById("tokenTitle").textContent =
            "Get Your Token";

        document.getElementById("tokenDescription").textContent =
            "Select where you need service and we'll help you join the right queue.";

        document.getElementById("locationLabel").textContent =
            "Service Location";

        document.getElementById("serviceLabel").textContent =
            "Service";

        document.getElementById("getTokenButton").textContent =
            "Get Token 🎟️";

        document.getElementById("backButton").textContent =
            "← Back";

        document.getElementById("homeTitle").innerHTML =
            "Don't wait.<br>Know your turn.";

        document.getElementById("homeDescription").textContent =
            "Get a digital token, track your queue, and know when it's your turn.";

        document.getElementById("citizenButton").textContent =
            "I'm a Citizen";

        document.getElementById("staffButton").textContent =
            "I'm Staff";

        document.getElementById("languageButton").textContent =
            "🌐 Change Language";

        document.getElementById("yourTokenLabel").textContent =
            "Your Token";

        document.getElementById("queueStatus").textContent =
            "You're in the queue ✓";

        document.getElementById("nowServingLabel").textContent =
            "Now Serving";

        document.getElementById("peopleAheadLabel").textContent =
            "People Ahead";

        document.getElementById("waitTimeLabel").textContent =
            "Estimated Waiting Time";

        document.getElementById("queueProgressLabel").textContent =
            "Queue Progress";

        document.getElementById("notificationInfo").textContent =
            "🔔 We'll notify you before your turn.";

        document.getElementById("leaveQueueButton").textContent =
            "Leave Queue";

    }


    updateServices();

    renderStaffQueue();

}


// =====================================================
// SHOW CITIZEN SCREEN
// =====================================================

function showCitizenScreen() {

    document.getElementById("homeScreen")
        .classList.add("hidden");

    document.getElementById("staffLoginScreen")
        .classList.add("hidden");

    document.getElementById("staffScreen")
        .classList.add("hidden");

    document.getElementById("citizenScreen")
        .classList.remove("hidden");

}


// =====================================================
// SHOW STAFF LOGIN
// =====================================================

function showStaffScreen() {

    document.getElementById("homeScreen")
        .classList.add("hidden");

    document.getElementById("citizenScreen")
        .classList.add("hidden");

    document.getElementById("staffScreen")
        .classList.add("hidden");

    document.getElementById("staffLoginScreen")
        .classList.remove("hidden");

}


// =====================================================
// UPDATE SERVICES
// =====================================================

function updateServices() {

    const location =
        document.getElementById("locationSelect");

    const service =
        document.getElementById("serviceSelect");

    if (!location || !service) {
        return;
    }

    const language =
        localStorage.getItem("waitlessLanguage") || "en";


    // Reset service list

    service.innerHTML = "";


    // =================================================
    // HINDI SERVICES
    // =================================================

    if (language === "hi") {

        service.innerHTML =
            '<option value="">सेवा चुनें</option>';

        if (location.value === "office") {

            service.innerHTML +=
                '<option value="birth">जन्म प्रमाण पत्र</option>' +
                '<option value="income">आय प्रमाण पत्र</option>' +
                '<option value="property">संपत्ति / कर सेवा</option>' +
                '<option value="help">सामान्य सहायता केंद्र</option>';

        }

        else if (location.value === "hospital") {

            service.innerHTML +=
                '<option value="opd">ओपीडी पंजीकरण</option>' +
                '<option value="doctor">डॉक्टर से परामर्श</option>' +
                '<option value="lab">प्रयोगशाला / रक्त जाँच</option>' +
                '<option value="pharmacy">दवा काउंटर</option>' +
                '<option value="scan">एक्स-रे / स्कैन पंजीकरण</option>';

        }

    }


    // =================================================
    // ENGLISH SERVICES
    // =================================================

    else {

        service.innerHTML =
            '<option value="">Select service</option>';

        if (location.value === "office") {

            service.innerHTML +=
                '<option value="birth">Birth Certificate</option>' +
                '<option value="income">Income Certificate</option>' +
                '<option value="property">Property / Tax Service</option>' +
                '<option value="help">General Help Desk</option>';

        }

        else if (location.value === "hospital") {

            service.innerHTML +=
                '<option value="opd">OPD Registration</option>' +
                '<option value="doctor">Doctor Consultation</option>' +
                '<option value="lab">Laboratory / Blood Test</option>' +
                '<option value="pharmacy">Pharmacy Counter</option>' +
                '<option value="scan">X-Ray / Scan Registration</option>';

        }

    }

}


// =====================================================
// GET TOKEN
// =====================================================

function getToken() {

    const name =
        document.getElementById("nameInput")
            .value
            .trim();

    const mobile =
        document.getElementById("mobileInput")
            .value
            .trim();

    const serviceSelect =
        document.getElementById("serviceSelect");

    const locationSelect =
        document.getElementById("locationSelect");

    const service =
        serviceSelect.value;


    // =================================================
    // VALIDATE NAME
    // =================================================

    if (name === "") {

        showMessage(
            "Please enter your name.",
            "कृपया अपना नाम दर्ज करें।"
        );

        return;

    }


    // =================================================
    // VALIDATE MOBILE
    // =================================================

    if (!/^[0-9]{10}$/.test(mobile)) {

        showMessage(
            "Please enter a valid 10-digit mobile number.",
            "कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।"
        );

        return;

    }


    // =================================================
    // VALIDATE SERVICE
    // =================================================

    if (service === "") {

        showMessage(
            "Please select a service first.",
            "कृपया पहले एक सेवा चुनें।"
        );

        return;

    }


    // =================================================
    // GET SERVICE NAME
    // =================================================

    const serviceName =
        serviceSelect.options[
            serviceSelect.selectedIndex
        ].textContent;


    // =================================================
    // CREATE TOKEN
    // =================================================

    const token =
        "A-" +
        String(nextTokenNumber)
            .padStart(3, "0");


    nextTokenNumber++;


    // =================================================
    // CREATE CITIZEN OBJECT
    // =================================================

    const citizen = {

        token: token,

        name: name,

        mobile: mobile,

        service: serviceName

    };


    // =================================================
    // ADD TO QUEUE
    // =================================================

    waitlessQueue.push(citizen);


    // =================================================
    // SHOW CITIZEN TOKEN
    // =================================================

    document.getElementById("tokenNumber")
        .textContent = token;


    document.getElementById("citizenName")
        .textContent = name;


    // =================================================
    // UPDATE QUEUE SCREEN
    // =================================================

    updateCitizenQueueInfo(citizen);


    // =================================================
    // UPDATE STAFF DASHBOARD
    // =================================================

    renderStaffQueue();


    // =================================================
    // OPEN QUEUE SCREEN
    // =================================================

    document.getElementById("citizenScreen")
        .classList.add("hidden");

    document.getElementById("queueScreen")
        .classList.remove("hidden");

}


// =====================================================
// UPDATE CITIZEN QUEUE INFO
// =====================================================

function updateCitizenQueueInfo(citizen) {

    const peopleAhead =
        waitlessQueue.length - 1;


    const peopleAheadText =
        document.getElementById("peopleAheadText");

    if (peopleAheadText) {

        peopleAheadText.textContent =
            peopleAhead +
            (peopleAhead === 1
                ? " person ahead"
                : " people ahead");

    }


    const nowServing =
        document.getElementById("nowServing");

    if (nowServing) {

        nowServing.textContent =
            currentServing.token;

    }

}


// =====================================================
// LEAVE QUEUE
// =====================================================

function leaveQueue() {

    document.getElementById("queueScreen")
        .classList.add("hidden");

    document.getElementById("homeScreen")
        .classList.remove("hidden");

}


// =====================================================
// GO HOME
// =====================================================

function goHome() {

    document.getElementById("citizenScreen")
        .classList.add("hidden");

    document.getElementById("staffLoginScreen")
        .classList.add("hidden");

    document.getElementById("staffScreen")
        .classList.add("hidden");

    document.getElementById("queueScreen")
        .classList.add("hidden");

    document.getElementById("languageScreen")
        .classList.add("hidden");

    document.getElementById("homeScreen")
        .classList.remove("hidden");

}


// =====================================================
// STAFF LOGIN
// =====================================================

function staffLogin() {

    const username =
        document.getElementById("staffUsername")
            .value
            .trim();

    const password =
        document.getElementById("staffPassword")
            .value
            .trim();


    if (username !== "staff") {

        showMessage(
            "Invalid username.",
            "गलत यूज़रनेम।"
        );

        return;

    }


    if (password === "") {

        showMessage(
            "Please enter your password.",
            "कृपया पासवर्ड दर्ज करें।"
        );

        return;

    }


    // Open dashboard

    document.getElementById("staffLoginScreen")
        .classList.add("hidden");

    document.getElementById("staffScreen")
        .classList.remove("hidden");


    renderStaffQueue();

}


// =====================================================
// STAFF DASHBOARD - RENDER QUEUE
// =====================================================

function renderStaffQueue() {

    const currentToken =
        document.getElementById("currentToken");

    const currentName =
        document.getElementById("currentCitizenName");

    const currentMobile =
        document.getElementById("currentCitizenMobile");

    const counter =
        document.getElementById("counterLabel");


    // =================================================
    // CURRENTLY SERVING
    // =================================================

    if (currentToken) {

        currentToken.textContent =
            currentServing.token;

    }

    if (currentName) {

        currentName.textContent =
            currentServing.name;

    }

    if (currentMobile) {

        currentMobile.textContent =
            "📱 " + currentServing.mobile;

    }

    if (counter) {

        counter.textContent =
            "Counter 1";

    }


    // =================================================
    // WAITING COUNT
    // =================================================

    const waitingCount =
        document.getElementById("waitingCount");

    if (waitingCount) {

        waitingCount.textContent =
            waitlessQueue.length +
            (waitlessQueue.length === 1
                ? " person waiting"
                : " people waiting");

    }


    // =================================================
    // TABLE
    // =================================================

    const table =
        document.querySelector(".queue-table");

    if (!table) {
        return;
    }


    // Keep table header

    table.innerHTML =

        '<div class="queue-table-header">' +

            '<span>Token</span>' +

            '<span>Citizen</span>' +

            '<span>Mobile</span>' +

            '<span>Service</span>' +

        '</div>';


    // =================================================
    // EMPTY QUEUE
    // =================================================

    if (waitlessQueue.length === 0) {

        table.innerHTML +=

            '<div class="queue-table-row">' +

                '<span style="grid-column: 1 / -1; text-align: center;">' +

                    'No citizens waiting' +

                '</span>' +

            '</div>';

        return;

    }


    // =================================================
    // ADD EVERY CITIZEN
    // =================================================

    waitlessQueue.forEach(function(citizen) {

        const row =
            document.createElement("div");

        row.className =
            "queue-table-row";


        const token =
            document.createElement("strong");

        token.textContent =
            citizen.token;


        const name =
            document.createElement("span");

        name.textContent =
            citizen.name;


        const mobile =
            document.createElement("span");

        mobile.textContent =
            citizen.mobile;


        const service =
            document.createElement("span");

        service.textContent =
            citizen.service;


        row.appendChild(token);

        row.appendChild(name);

        row.appendChild(mobile);

        row.appendChild(service);


        table.appendChild(row);

    });

}


// =====================================================
// STAFF - CALL NEXT
// =====================================================

function callNext() {

    // =================================================
    // CHECK QUEUE
    // =================================================

    if (waitlessQueue.length === 0) {

        showMessage(
            "No citizens are waiting in the queue.",
            "कतार में कोई नागरिक प्रतीक्षा नहीं कर रहा है।"
        );

        return;

    }


    // =================================================
    // TAKE FIRST CITIZEN
    // =================================================

    const nextCitizen =
        waitlessQueue.shift();


    // =================================================
    // MAKE THEM CURRENTLY SERVING
    // =================================================

    currentServing = nextCitizen;


    // =================================================
    // UPDATE DASHBOARD
    // =================================================

    renderStaffQueue();

}


// =====================================================
// STARTUP
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateServices();

        renderStaffQueue();

    }
);

