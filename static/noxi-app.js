// ==================== FIREBASE AUTH PROTECTION ====================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ==================== FIREBASE CONFIG ====================

const firebaseConfig = {

    apiKey: "AIzaSyBJwpmz-jhUIjhGtppjMr5lpoHPPb3YAHI",

    authDomain: "noxi-fd090.firebaseapp.com",

    projectId: "noxi-fd090",

    storageBucket: "noxi-fd090.firebasestorage.app",

    messagingSenderId: "417528220149",

    appId: "1:417528220149:web:21125c4001b7a5257438bc",

    measurementId: "G-970WVZZ8GC"
};


// ==================== INITIALIZE FIREBASE ====================

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);


// ==================== CHECK LOGIN ====================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "/noxi-login";

        return;
    }

    // ==================== SET USER STORAGE ====================

currentUser = user;

userStoragePrefix =
    "noxi_" + user.uid + "_";


// ==================== LOAD CURRENT CHAT ID ====================

currentChatId =
    localStorage.getItem(
        userStoragePrefix + "currentChatId"
    ) || null;

    loadChatHistory();

    // ==================== LOAD USER SAVED CHATS ====================

normalizeSavedChats();
loadRecentChats();

    // ==================== SET USER STORAGE ====================

currentUser = user;

userStoragePrefix =
    "noxi_" + user.uid + "_";


// ==================== LOAD CURRENT CHAT ID ====================

currentChatId =
    localStorage.getItem(
        userStoragePrefix + "currentChatId"
    ) || null;

    // ==================== SHOW USER EMAIL ====================

    const userEmail =
        document.getElementById("userEmail");

    if (userEmail) {

        userEmail.textContent =
            user.email || "User";

    }

});

// ==================== NOXI START ====================

console.log("Noxi AI started");


// ==================== CHAT INPUT ====================

const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");


// ==================== CURRENT USER ====================

let currentUser = null;
let userStoragePrefix = "";


// ==================== CURRENT CHAT ID ====================

let currentChatId = null;

// ==================== LOAD CHAT HISTORY ====================

function loadChatHistory() {

    if (!userStoragePrefix) {
        return;
    }

    const savedChatHistory =
        localStorage.getItem(
            userStoragePrefix + "chatHistory"
        );

    if (savedChatHistory) {
        chatMessages.innerHTML = savedChatHistory;
    }

}


// ==================== SAVE CHAT HISTORY ====================

function saveChatHistory() {

    if (!userStoragePrefix) {
        return;
    }

    localStorage.setItem(
        userStoragePrefix + "chatHistory",
        chatMessages.innerHTML
    );
}


// ==================== SAVED CHATS STORAGE ====================

function getSavedChats() {

    if (!userStoragePrefix) {
        return [];
    }

    return JSON.parse(
        localStorage.getItem(
            userStoragePrefix + "savedChats"
        ) || "[]"
    );
}


function setSavedChats(savedChats) {

    if (!userStoragePrefix) {
        return;
    }

    localStorage.setItem(
        userStoragePrefix + "savedChats",
        JSON.stringify(savedChats)
    );
}


// ==================== CREATE UNIQUE CHAT ID ====================

function createChatId() {

    return (
        Date.now().toString() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


// ==================== NORMALIZE OLD CHATS ====================

function normalizeSavedChats() {

    const savedChats = getSavedChats();

    let changed = false;


    savedChats.forEach(function (chat) {

        // ==================== ADD ID TO OLD CHAT ====================

        if (!chat.id) {

            chat.id = createChatId();

            changed = true;

        }


        // ==================== FIX OLD ACTIVE VALUE ====================

        if (typeof chat.active !== "boolean") {

            chat.active = false;

            changed = true;

        }

    });


    // ==================== RECOVER OLD ACTIVE CHAT ====================

    if (!currentChatId) {

        const activeChat =
            savedChats.find(function (chat) {

                return chat.active === true;

            });


        if (activeChat) {

            currentChatId =
                activeChat.id;

                localStorage.setItem(
                    userStoragePrefix + "currentChatId",
                    currentChatId
                );
        }

    }


    // ==================== SAVE CHANGES ====================

    if (changed) {

        setSavedChats(savedChats);

    }

}


// ==================== SAVE CURRENT CHAT TO SIDEBAR ====================

function saveCurrentChatToSidebar() {

    const currentChat =
        chatMessages.innerHTML.trim();

    if (currentChat === "") return;


    let savedChats =
        getSavedChats();


    // ==================== CREATE CHAT ID IF NEEDED ====================

    if (!currentChatId) {

        currentChatId =
            createChatId();

            localStorage.setItem(
                userStoragePrefix + "currentChatId",
                currentChatId
            );
    }


    // ==================== CHAT TITLE ====================

    const firstUserMessage =
        chatMessages.querySelector(".user-message");

    let chatTitle = "New Chat";


    if (firstUserMessage) {

        chatTitle =
            firstUserMessage.textContent
                .replace("You: ", "")
                .trim()
                .slice(0, 35);

    }


    // ==================== FIND CURRENT CHAT BY ID ====================

    let currentChatIndex =
        savedChats.findIndex(function (chat) {

            return chat.id === currentChatId;

        });


    // ==================== MAKE ONLY CURRENT CHAT ACTIVE ====================

    savedChats.forEach(function (chat) {

        chat.active =
            chat.id === currentChatId;

    });


    // ==================== UPDATE EXISTING CHAT ====================

    if (currentChatIndex !== -1) {

        savedChats[currentChatIndex].messages =
            currentChat;

        savedChats[currentChatIndex].title =
            chatTitle;

        savedChats[currentChatIndex].date =
            new Date().toLocaleString();

        savedChats[currentChatIndex].active =
            true;

    }


    // ==================== CREATE NEW CHAT ====================

    else {

        savedChats.unshift({

            id: currentChatId,

            title: chatTitle,

            messages: currentChat,

            date: new Date().toLocaleString(),

            active: true

        });

    }


    // ==================== SAVE ====================

    setSavedChats(savedChats);


    // ==================== REFRESH SIDEBAR ====================

    loadRecentChats();

}


// ==================== SEND MESSAGE ====================

sendBtn.addEventListener("click", function () {

    const message =
        userInput.value.trim();

    if (message === "") return;


    // ==================== SHOW USER MESSAGE ====================

    const messageElement =
        document.createElement("p");

    messageElement.classList.add(
        "user-message"
    );

    messageElement.textContent =
        "You: " + message;

    chatMessages.appendChild(
        messageElement
    );

    scrollChatToBottom();

    saveChatHistory();


    // ==================== NOXI TYPING INDICATOR ====================

    const typingElement =
        document.createElement("p");

    typingElement.classList.add(
        "noxi-message",
        "typing-message"
    );

    typingElement.innerHTML = `
        <span class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;

    chatMessages.appendChild(
        typingElement
    );


    // ==================== SEND TO BACKEND ====================

    fetch(
        "http://127.0.0.1:5001/ask",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        }
    )


    // ==================== GET NOXI REPLY ====================

    .then(response => response.json())

    .then(data => {

        typingElement.remove();


        // ==================== CREATE NOXI REPLY ====================

        const noxiReply =
            document.createElement("p");

        noxiReply.classList.add(
            "noxi-message"
        );

        noxiReply.innerHTML =
            "Noxi: " +
            formatNoxiReply(data.reply);


        // ==================== ADD REPLY ====================

        chatMessages.appendChild(
            noxiReply
        );


    // ==================== EXPLAIN UNTIL IT CLICKS ====================

const clickButton =
document.createElement("button");

clickButton.textContent =
"🧠 I didn't get it";

clickButton.classList.add(
"click-understand-btn"
);

clickButton.type =
"button";


// ==================== EXPLANATION MODE ====================

let explanationMode = 0;

const explanationModes = [

{
    prompt:
        "Re-explain the same concept in extremely simple language for a beginner student. Do not repeat the previous explanation word-for-word. Make it easier to understand.",

    button:
        "💡 Give me an example"
},

{
    prompt:
        "Explain the same concept using a very simple real-life example. Clearly connect the example to the concept.",

    button:
        "🧠 Give me an analogy"
},

{
    prompt:
        "Explain the same concept using an easy analogy that a student can remember.",

    button:
        "📌 Explain step by step"
},

{
    prompt:
        "Explain the same concept step by step. Keep every step short, clear and easy for a student.",

    button:
        "🔄 Explain simply again"
}

];


// ==================== BUTTON CLICK ====================

clickButton.addEventListener(
"click",
function () {

    const mode =
        explanationModes[
            explanationMode %
            explanationModes.length
        ];

    explanationMode++;


    // ==================== SHOW TYPING ====================

    const typingElement =
        document.createElement("p");

    typingElement.classList.add(
        "noxi-message",
        "typing-message"
    );

    typingElement.innerHTML = `
        <span class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;

    chatMessages.appendChild(
        typingElement
    );

    scrollChatToBottom();


    // ==================== SEND RE-EXPLANATION ====================

    fetch(
        "http://127.0.0.1:5001/ask",
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                message:
                    mode.prompt +
                    "\n\nThe student originally asked:\n" +
                    message

            })

        }
    )


    // ==================== GET NEW EXPLANATION ====================

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Backend response error"
            );
        }

        return response.json();

    })


    .then(data => {

        typingElement.remove();


        // ==================== NEW NOXI REPLY ====================

        const newReply =
            document.createElement("p");

        newReply.classList.add(
            "noxi-message"
        );

        newReply.innerHTML =
            "Noxi: " +
            formatNoxiReply(
                data.reply
            );

        chatMessages.appendChild(
            newReply
        );


        // ==================== UPDATE BUTTON TEXT ====================

        clickButton.textContent =
            mode.button;


        // ==================== SCROLL ====================

        scrollChatToBottom();


        // ==================== SAVE ====================

        saveChatHistory();

        saveCurrentChatToSidebar();

    })


    // ==================== ERROR ====================

    .catch(error => {

        console.error(
            "Explain Until It Clicks Error:",
            error
        );

        typingElement.remove();

        const errorReply =
            document.createElement("p");

        errorReply.classList.add(
            "noxi-message"
        );

        errorReply.textContent =
            "Noxi: Explanation load nahi ho payi.";

        chatMessages.appendChild(
            errorReply
        );

        scrollChatToBottom();

        saveChatHistory();

    });

}
);


// ==================== SHOW BUTTON BELOW REPLY ====================

chatMessages.appendChild(
clickButton
);

scrollChatToBottom();


// ==================== SAVE ====================

saveChatHistory();
saveCurrentChatToSidebar();

    })


    // ==================== BACKEND ERROR ====================

    .catch(error => {

        console.error(
            "Backend Error:",
            error
        );

        typingElement.remove();


        const noxiReply =
            document.createElement("p");

        noxiReply.classList.add(
            "noxi-message"
        );

        noxiReply.textContent =
            "Noxi: Backend se connection nahi ho paya.";

        chatMessages.appendChild(
            noxiReply
        );

        scrollChatToBottom();

        saveChatHistory();

    });


    // ==================== CLEAR INPUT ====================

    userInput.value = "";

});



// ==================== ENTER KEY SUPPORT ====================

userInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            sendBtn.click();

        }

    }
);


// ==================== SHORT NOTES POPUP ====================

const shortNotesBtn =
    document.getElementById(
        "shortNotesBtn"
    );

const shortNotesModal =
    document.getElementById(
        "shortNotesModal"
    );

const shortNotesInput =
    document.getElementById(
        "shortNotesInput"
    );

const cancelShortNotesBtn =
    document.getElementById(
        "cancelShortNotesBtn"
    );

const generateShortNotesBtn =
    document.getElementById(
        "generateShortNotesBtn"
    );


// ==================== OPEN SHORT NOTES POPUP ====================

function openShortNotesPopup() {

    shortNotesModal.style.display =
        "flex";

    shortNotesInput.focus();

}


// ==================== OLD SHORT NOTES BUTTON ====================

if (shortNotesBtn) {

    shortNotesBtn.addEventListener(
        "click",
        openShortNotesPopup
    );

}


// ==================== SIDEBAR SHORT NOTES BUTTON ====================

const sidebarShortNotesBtn =
    document.getElementById(
        "sidebarShortNotesBtn"
    );

if (sidebarShortNotesBtn) {

    sidebarShortNotesBtn.addEventListener(
        "click",
        function () {

            openShortNotesPopup();

            closeSidebar();

        }
    );

}


// ==================== CLOSE POPUP ====================

if (cancelShortNotesBtn) {

    cancelShortNotesBtn.addEventListener(
        "click",
        function () {

            shortNotesModal.style.display =
                "none";

        }
    );

}


// ==================== MAKE SHORT NOTES ====================

if (generateShortNotesBtn) {

    generateShortNotesBtn.addEventListener(
        "click",
        function () {

            const text =
                shortNotesInput.value.trim();

            if (text === "") return;


            // ==================== CLOSE POPUP ====================

            shortNotesModal.style.display =
                "none";


            // ==================== SHOW USER MESSAGE ====================

            const userMessage =
                document.createElement("p");

            userMessage.classList.add(
                "user-message"
            );

            userMessage.textContent =
                "You: Make short notes";

            chatMessages.appendChild(
                userMessage
            );


            // ==================== TYPING INDICATOR ====================

            const typingElement =
                document.createElement("p");

            typingElement.classList.add(
                "noxi-message",
                "typing-message"
            );

            typingElement.innerHTML = `
                <span class="typing-label">
                    Making short notes
                </span>

                <span class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            `;

            chatMessages.appendChild(
                typingElement
            );

            scrollChatToBottom();


            // ==================== SEND TO BACKEND ====================

            fetch(
                "http://127.0.0.1:5001/short-notes",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        text: text
                    })

                }
            )


            // ==================== GET SHORT NOTES ====================

            .then(response =>
                response.json()
            )

            .then(data => {

                typingElement.remove();


                const noxiReply =
                    document.createElement("p");

                noxiReply.classList.add(
                    "noxi-message"
                );

                noxiReply.innerHTML =
                    "Noxi: " +
                    formatNoxiReply(
                        data.reply
                    );

                chatMessages.appendChild(
                    noxiReply
                );

                scrollChatToBottom();

                saveChatHistory();

            })


            // ==================== ERROR ====================

            .catch(error => {

                console.error(
                    "Short Notes Error:",
                    error
                );

                typingElement.remove();


                const noxiReply =
                    document.createElement("p");

                noxiReply.classList.add(
                    "noxi-message"
                );

                noxiReply.textContent =
                    "Noxi: Short notes banane me problem hui.";

                chatMessages.appendChild(
                    noxiReply
                );

                scrollChatToBottom();

                saveChatHistory();

            });

        }
    );

}

// ==================== RECENT CHATS ====================

const recentChatsList =
    document.getElementById(
        "recentChatsList"
    );


// ==================== CHAT ACTION POPUP ====================

const chatActionOverlay =
    document.getElementById(
        "chatActionOverlay"
    );

const chatActionIcon =
    document.getElementById(
        "chatActionIcon"
    );

const chatActionTitle =
    document.getElementById(
        "chatActionTitle"
    );

const chatActionText =
    document.getElementById(
        "chatActionText"
    );

const chatActionInput =
    document.getElementById(
        "chatActionInput"
    );

const chatActionCancel =
    document.getElementById(
        "chatActionCancel"
    );

const chatActionConfirm =
    document.getElementById(
        "chatActionConfirm"
    );

let chatActionMode = null;
let chatActionChatId = null;


// ==================== OPEN POPUP ====================

function openChatActionPopup(
    mode,
    chat
) {

    chatActionMode = mode;
    chatActionChatId = chat.id;

    if (mode === "rename") {

        chatActionIcon.textContent = "✏️";

        chatActionTitle.textContent =
            "Rename Chat";

        chatActionText.textContent =
            "Enter a new name for this chat.";

        chatActionInput.value =
            chat.title || "New Chat";

        chatActionInput.style.display =
            "block";

        chatActionConfirm.textContent =
            "Rename";

        chatActionConfirm.classList.remove(
            "delete-action"
        );

    }

    if (mode === "delete") {

        chatActionIcon.textContent = "🗑️";

        chatActionTitle.textContent =
            "Delete Chat";

        chatActionText.textContent =
            "Are you sure you want to delete this chat?";

        chatActionInput.value = "";

        chatActionInput.style.display =
            "none";

        chatActionConfirm.textContent =
            "Delete";

        chatActionConfirm.classList.add(
            "delete-action"
        );

    }

    chatActionOverlay.style.display =
        "flex";

    if (mode === "rename") {

        setTimeout(function () {

            chatActionInput.focus();
            chatActionInput.select();

        }, 50);

    }

}


// ==================== CLOSE POPUP ====================

function closeChatActionPopup() {

    chatActionOverlay.style.display =
        "none";

    chatActionMode = null;

    chatActionChatId = null;

}


// ==================== CANCEL POPUP ====================

if (chatActionCancel) {

    chatActionCancel.addEventListener(
        "click",
        function () {

            closeChatActionPopup();

        }
    );

}


// ==================== CONFIRM POPUP ====================

if (chatActionConfirm) {

    chatActionConfirm.addEventListener(
        "click",
        function () {

            const savedChats =
                getSavedChats();

            const targetChat =
                savedChats.find(
                    function (chat) {

                        return (
                            chat.id ===
                            chatActionChatId
                        );

                    }
                );


            // ==================== TARGET NOT FOUND ====================

            if (!targetChat) {

                closeChatActionPopup();

                return;

            }


            // ==================== RENAME ====================

            if (
                chatActionMode ===
                "rename"
            ) {

                const newTitle =
                    chatActionInput.value.trim();

                if (!newTitle) {

                    chatActionInput.focus();

                    return;

                }

                targetChat.title =
                    newTitle;

            }


            // ==================== DELETE ====================

            if (
                chatActionMode ===
                "delete"
            ) {

                const targetIndex =
                    savedChats.findIndex(
                        function (chat) {

                            return (
                                chat.id ===
                                chatActionChatId
                            );

                        }
                    );

                if (targetIndex !== -1) {

                    savedChats.splice(
                        targetIndex,
                        1
                    );

                }


                // ==================== CURRENT CHAT ====================

                if (
                    chatActionChatId ===
                    currentChatId
                ) {

                    currentChatId = null;

                    localStorage.removeItem(
                        userStoragePrefix +
                        "currentChatId"
                    );

                    chatMessages.innerHTML =
                        "";

                    localStorage.removeItem(
                        userStoragePrefix +
                        "chatHistory"
                    );

                }

            }


            // ==================== FIX ACTIVE STATES ====================

            savedChats.forEach(
                function (chat) {

                    chat.active =
                        chat.id ===
                        currentChatId;

                }
            );


            setSavedChats(
                savedChats
            );

            closeChatActionPopup();

            loadRecentChats();

        }
    );

}


// ==================== INPUT KEYBOARD ====================

if (chatActionInput) {

    chatActionInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                if (
                    chatActionMode ===
                    "rename"
                ) {

                    chatActionConfirm.click();

                }

            }

            if (
                event.key ===
                "Escape"
            ) {

                closeChatActionPopup();

            }

        }
    );

}


// ==================== OVERLAY CLICK ====================

if (chatActionOverlay) {

    chatActionOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                chatActionOverlay
            ) {

                closeChatActionPopup();

            }

        }
    );

}


// ==================== LOAD RECENT CHATS ====================

function loadRecentChats() {

    if (!recentChatsList) return;

    recentChatsList.innerHTML =
        "";

    const savedChats =
        getSavedChats();


    // ==================== NO CHATS ====================

    if (
        savedChats.length ===
        0
    ) {

        recentChatsList.innerHTML =
            "<p style='color:#718092;font-size:12px;'>No recent chats</p>";

        return;

    }


    // ==================== CREATE CHAT ITEMS ====================

    savedChats.forEach(
        function (chat) {

            const chatItem =
                document.createElement(
                    "div"
                );

            chatItem.classList.add(
                "recent-chat-item"
            );


            // ==================== ACTIVE CHAT ====================

            if (
                chat.id &&
                chat.id ===
                currentChatId
            ) {

                chatItem.classList.add(
                    "active-chat"
                );

            }


            // ==================== TITLE ====================

            const title =
                document.createElement(
                    "div"
                );

            title.classList.add(
                "recent-chat-title"
            );

            title.textContent =
                chat.title ||
                "New Chat";


            // ==================== DATE ====================

            const date =
                document.createElement(
                    "div"
                );

            date.classList.add(
                "recent-chat-date"
            );

            date.textContent =
                chat.date ||
                "";


            chatItem.appendChild(
                title
            );

            chatItem.appendChild(
                date
            );


            // ==================== OPTIONS WRAPPER ====================

            const optionsWrapper =
                document.createElement(
                    "div"
                );

            optionsWrapper.classList.add(
                "chat-options-wrapper"
            );


            // ==================== THREE DOT BUTTON ====================

            const optionsBtn =
                document.createElement(
                    "button"
                );

            optionsBtn.type =
                "button";

            optionsBtn.classList.add(
                "chat-options-btn"
            );

            optionsBtn.innerHTML =
                "⋮";


            // ==================== OPTIONS MENU ====================

            const optionsMenu =
                document.createElement(
                    "div"
                );

            optionsMenu.classList.add(
                "chat-options-menu"
            );

            optionsMenu.style.display =
                "none";


            // ==================== RENAME BUTTON ====================

            const renameBtn =
                document.createElement(
                    "button"
                );

            renameBtn.type =
                "button";

            renameBtn.classList.add(
                "chat-option-btn"
            );

            renameBtn.innerHTML =
                "✏️ Rename";


            // ==================== DELETE BUTTON ====================

            const deleteBtn =
                document.createElement(
                    "button"
                );

            deleteBtn.type =
                "button";

            deleteBtn.classList.add(
                "chat-option-btn",
                "delete-option"
            );

            deleteBtn.innerHTML =
                "🗑️ Delete";


            // ==================== RENAME CLICK ====================

            renameBtn.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    optionsMenu.style.display =
                        "none";

                    openChatActionPopup(
                        "rename",
                        chat
                    );

                }
            );


            // ==================== DELETE CLICK ====================

            deleteBtn.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    optionsMenu.style.display =
                        "none";

                    openChatActionPopup(
                        "delete",
                        chat
                    );

                }
            );


            // ==================== THREE DOT CLICK ====================

            optionsBtn.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    document
                        .querySelectorAll(
                            ".chat-options-menu"
                        )
                        .forEach(
                            function (menu) {

                                if (
                                    menu !==
                                    optionsMenu
                                ) {

                                    menu.style.display =
                                        "none";

                                }

                            }
                        );

                    const isOpen =
                        optionsMenu.style.display ===
                        "block";

                    optionsMenu.style.display =
                        isOpen
                            ? "none"
                            : "block";

                }
            );


            // ==================== BUILD MENU ====================

            optionsMenu.appendChild(
                renameBtn
            );

            optionsMenu.appendChild(
                deleteBtn
            );

            optionsWrapper.appendChild(
                optionsBtn
            );

            optionsWrapper.appendChild(
                optionsMenu
            );

            chatItem.appendChild(
                optionsWrapper
            );


            // ==================== OPEN CHAT ====================

            chatItem.addEventListener(
                "click",
                function () {

                    currentChatId =
                        chat.id;

                    localStorage.setItem(
                        userStoragePrefix +
                        "currentChatId",
                        currentChatId
                    );


                    // ==================== ACTIVE FLAGS ====================

                    const allChats =
                        getSavedChats();

                    allChats.forEach(
                        function (savedChat) {

                            savedChat.active =
                                savedChat.id ===
                                currentChatId;

                        }
                    );

                    setSavedChats(
                        allChats
                    );


                    // ==================== LOAD CHAT ====================

                    chatMessages.innerHTML =
                        chat.messages || "";

                    saveChatHistory();

                    scrollChatToBottom();


                    // ==================== LOAD BACKEND MEMORY ====================

                    const chatElements =
                        chatMessages.querySelectorAll(
                            "p"
                        );

                    const backendMessages =
                        [];


                    chatElements.forEach(
                        function (element) {

                            const text =
                                element.textContent.trim();


                            if (
                                text.startsWith(
                                    "You: "
                                )
                            ) {

                                backendMessages.push({
                                    role: "user",
                                    text: text.replace(
                                        "You: ",
                                        ""
                                    )
                                });

                            }

                            else if (
                                text.startsWith(
                                    "Noxi: "
                                )
                            ) {

                                backendMessages.push({
                                    role: "model",
                                    text: text.replace(
                                        "Noxi: ",
                                        ""
                                    )
                                });

                            }

                        }
                    );


                    fetch(
                        "http://127.0.0.1:5001/load-chat",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                messages:
                                    backendMessages
                            })

                        }
                    )

                    .then(
                        response =>
                            response.json()
                    )

                    .then(
                        data => {

                            console.log(
                                "Chat memory loaded:",
                                data.reply
                            );

                        }
                    )

                    .catch(
                        error => {

                            console.error(
                                "Load Chat Error:",
                                error
                            );

                        }
                    );


                    // ==================== REFRESH SIDEBAR ====================

                    loadRecentChats();

                }
            );


            recentChatsList.appendChild(
                chatItem
            );

        }
    );

}


// ==================== CLOSE OPTIONS WHEN CLICKING OUTSIDE ====================

document.addEventListener(
    "click",
    function () {

        document
            .querySelectorAll(
                ".chat-options-menu"
            )
            .forEach(
                function (menu) {

                    menu.style.display =
                        "none";

                }
            );

    }
);


// ==================== END RECENT CHATS ====================


// ==================== NEW CHAT ====================

const newChatBtn =
    document.getElementById(
        "sidebarNewChatBtn"
    );


if (newChatBtn) {

    newChatBtn.addEventListener(
        "click",
        function () {

            const confirmNewChat =
                confirm(
                    "Start a new chat? Current conversation will be cleared."
                );

            if (!confirmNewChat) return;


            // ==================== SAVE CURRENT CHAT ====================

            if (
                chatMessages.innerHTML.trim() !== ""
            ) {

                saveCurrentChatToSidebar();

            }


            // ==================== CLEAR CURRENT CHAT ID ====================

            currentChatId =
                null;

                localStorage.removeItem(
                    userStoragePrefix + "currentChatId"
                );


            // ==================== REMOVE ACTIVE STATE FROM ALL CHATS ====================

            const savedChats =
                getSavedChats();

            savedChats.forEach(
                function (chat) {

                    chat.active =
                        false;

                }
            );

            setSavedChats(
                savedChats
            );


            // ==================== CLEAR FRONTEND CHAT ====================

            chatMessages.innerHTML =
                "";

            localStorage.removeItem(
                "noxiChatHistory"
            );


            // ==================== CLEAR BACKEND MEMORY ====================

            fetch(
                "http://127.0.0.1:5001/new-chat",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }

                }
            )

            .catch(error => {

                console.error(
                    "New Chat Error:",
                    error
                );

            });


            // ==================== REFRESH SIDEBAR ====================

            loadRecentChats();


            // ==================== CLOSE SIDEBAR ====================

            closeSidebar();

        }
    );

}


// ==================== NOXI MARKDOWN ====================

function formatNoxiReply(text) {

    // ==================== ESCAPE HTML ====================

    text = text
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );


    // ==================== HEADINGS ====================

    text = text.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );

    text = text.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );


    // ==================== BOLD ====================

    text = text.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // ==================== BULLETS ====================

    text = text.replace(
        /^[-•] (.*)$/gm,
        "<li>$1</li>"
    );


    text = text.replace(
        /(<li>.*<\/li>)/gs,
        "<ul>$1</ul>"
    );


    // ==================== NEW LINES ====================

    text = text.replace(
        /\n/g,
        "<br>"
    );


    return text;

}


// ==================== AUTO SCROLL CHAT ====================

function scrollChatToBottom() {

    requestAnimationFrame(
        function () {

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }
    );

}


// ==================== SIDEBAR ====================

const noxiSidebar =
    document.getElementById(
        "noxiSidebar"
    );

const openSidebarBtn =
    document.getElementById(
        "openSidebarBtn"
    );

const closeSidebarBtn =
    document.getElementById(
        "closeSidebarBtn"
    );

const sidebarOverlay =
    document.getElementById(
        "sidebarOverlay"
    );


// ==================== OPEN SIDEBAR ====================

function openSidebar() {

    if (noxiSidebar) {

        noxiSidebar.classList.add(
            "open"
        );

    }

    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "open"
        );

    }

}


// ==================== CLOSE SIDEBAR ====================

function closeSidebar() {

    if (noxiSidebar) {

        noxiSidebar.classList.remove(
            "open"
        );

    }

    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "open"
        );

    }

}


// ==================== OPEN BUTTON ====================

if (openSidebarBtn) {

    openSidebarBtn.addEventListener(
        "click",
        openSidebar
    );

}


// ==================== CLOSE BUTTON ====================

if (closeSidebarBtn) {

    closeSidebarBtn.addEventListener(
        "click",
        closeSidebar
    );

}


// ==================== OVERLAY CLICK ====================

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


// ==================== ESCAPE KEY ====================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeSidebar();

        }

    }
);

// ==================== LOGOUT ====================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            // ==================== CLEAR CURRENT USER DATA ====================

if (userStoragePrefix) {

    localStorage.removeItem(
        userStoragePrefix + "currentChatId"
    );

    localStorage.removeItem(
        userStoragePrefix + "chatHistory"
    );
}

            window.location.href = "/noxi-login";

        } catch (error) {

            console.error("Logout Error:", error);

            alert("Logout nahi ho paya. Dobara try karo.");

        }

    });

}


// ==================== END ====================
