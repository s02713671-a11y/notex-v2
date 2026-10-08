const layoutToggleBtn = document.getElementById("layoutToggleBtn");
const deletedBtn = document.getElementById("deletedBtn");
const searchInput = document.getElementById("searchInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.querySelector(".notes-container");
const tagFilter = document.getElementById("tagFilter");

let notes = JSON.parse(localStorage.getItem("notexNotes")) || [];
let twoColumns = localStorage.getItem("notexTwoColumns") === "true";
let deletedNote = null;

let recentlyDeleted =
    JSON.parse(localStorage.getItem("notexRecentlyDeleted")) || [];

let undoTimeout = null;

const colors = [
    "yellow",
    "blue",
    "green",
    "pink",
    "purple"
];


// ==================== SAVE NOTES ====================

function saveNotes() {

    localStorage.setItem(
        "notexNotes",
        JSON.stringify(notes)
    );

}


// ==================== TAG FILTER ====================

function updateTagFilter() {

    if (!tagFilter) return;

    const currentTag = tagFilter.value;

    tagFilter.innerHTML = `
        <option value="all">🏷️ All Tags</option>
    `;

    const tags = [];

    notes.forEach(function (note) {

        const tag = (note.tag || "").trim();

        if (tag && !tags.includes(tag)) {
            tags.push(tag);
        }

    });

    tags.sort();

    tags.forEach(function (tag) {

        const option = document.createElement("option");

        option.value = tag;
        option.textContent = "🏷️ " + tag;

        tagFilter.appendChild(option);

    });

    if (tags.includes(currentTag)) {
        tagFilter.value = currentTag;
    }

}


// ==================== UNDO DELETE ====================

function showUndo() {

    let undoBar =
        document.getElementById("undoBar");

    if (!undoBar) {

        undoBar =
            document.createElement("div");

        undoBar.id = "undoBar";

        undoBar.innerHTML = `
            <span>Note deleted</span>
            <button id="undoBtn" type="button">
                Undo
            </button>
        `;

        document.body.appendChild(undoBar);

        document
            .getElementById("undoBtn")
            .addEventListener("click", function () {

                if (deletedNote) {

                    notes.splice(
                        deletedNote.index,
                        0,
                        deletedNote.note
                    );

                    saveNotes();

                    renderNotes();

                    deletedNote = null;

                    undoBar.remove();

                    clearTimeout(undoTimeout);

                }

            });

    }

    clearTimeout(undoTimeout);

    undoTimeout = setTimeout(function () {

        deletedNote = null;

        if (undoBar) {
            undoBar.remove();
        }

    }, 5000);

}


// ==================== CREATE NOTE ====================

function createNoteElement(note) {

    const noteBox =
        document.createElement("div");

    noteBox.className =
        `note ${note.color || "yellow"}`;

    noteBox.innerHTML = `

        <button
            class="pin-note"
            title="Pin note"
            type="button"
        >
            <span class="pin-icon">
                ${note.pinned ? "📌" : "📍"}
            </span>
        </button>

        <button
            class="delete-note"
            title="Delete note"
            type="button"
        >
            <span class="trash-icon"></span>
        </button>

        <button
    class="copy-note"
    title="Copy note"
    type="button"
>
    📋
</button>

        

        <div class="color-picker">

            <button
                type="button"
                class="color-btn yellow-btn"
                data-color="yellow"
                title="Yellow"
            ></button>

            <button
                type="button"
                class="color-btn blue-btn"
                data-color="blue"
                title="Blue"
            ></button>

            <button
                type="button"
                class="color-btn green-btn"
                data-color="green"
                title="Green"
            ></button>

            <button
                type="button"
                class="color-btn pink-btn"
                data-color="pink"
                title="Pink"
            ></button>

            <button
                type="button"
                class="color-btn purple-btn"
                data-color="purple"
                title="Purple"
            ></button>


    </div>

        </div>

        <input
            type="text"
            class="note-title"
            placeholder="Note title..."
            value="${note.title || ""}"
        >

        <textarea
            class="note-text"
            placeholder="Write your note..."
        >${note.text || ""}</textarea>

        <input
            type="text"
            class="note-tag"
            placeholder="🏷️ Tag (e.g. Physics)"
            value="${note.tag || ""}"
        >

    `;

    const pinBtn =
        noteBox.querySelector(".pin-note");

    const deleteBtn =
        noteBox.querySelector(".delete-note");

        // ==================== COPY NOTE ====================

const copyBtn =
noteBox.querySelector(".copy-note");

copyBtn.addEventListener("click", async function (event) {

event.stopPropagation();

const copyText =
    `${title.value}\n\n${text.value}` +
    `${tag.value ? `\n\nTag: ${tag.value}` : ""}`;

try {

    await navigator.clipboard.writeText(copyText);

    copyBtn.textContent = "✓";
    copyBtn.title = "Copied!";

    setTimeout(() => {

        copyBtn.textContent = "📋";
        copyBtn.title = "Copy note";

    }, 1200);

} catch (error) {

    console.error("Copy failed:", error);

}

});

    const title =
        noteBox.querySelector(".note-title");

    const text =
        noteBox.querySelector(".note-text");

    const colorButtons =
        noteBox.querySelectorAll(".color-btn");

    const tag =
        noteBox.querySelector(".note-tag");


    // ==================== PIN ====================

    pinBtn.addEventListener("click", function () {

        note.pinned =
            !note.pinned;

        saveNotes();

        renderNotes();

    });


    // ==================== DELETE ====================

    deleteBtn.addEventListener("click", function () {

        const index =
            notes.indexOf(note);

        if (index !== -1) {

            deletedNote = {
                note: note,
                index: index
            };

            recentlyDeleted.push(note);

            notes.splice(index, 1);

            saveNotes();

            localStorage.setItem(
                "notexRecentlyDeleted",
                JSON.stringify(recentlyDeleted)
            );

            renderNotes();

            showUndo();

        }

    });


    // ==================== COLOR ====================

    colorButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                note.color =
                    button.dataset.color;

                noteBox.className =
                    `note ${note.color}`;

                saveNotes();

            }
        );

    });


    // ==================== TITLE ====================

    title.addEventListener(
        "input",
        function () {

            note.title =
                title.value;

            saveNotes();

        }
    );


    // ==================== TEXT ====================

    text.addEventListener(
        "input",
        function () {

            note.text =
                text.value;

            saveNotes();

        }
    );


    // ==================== TAG ====================

    tag.addEventListener(
        "input",
        function () {

            note.tag =
                tag.value;

            saveNotes();

            updateTagFilter();

        }
    );


    notesContainer.appendChild(noteBox);

}


// ==================== RENDER NOTES ====================

function renderNotes() {

    notesContainer.classList.toggle(
        "two-columns",
        twoColumns
    );

    notesContainer.innerHTML = "";

    const sortedNotes =
        [...notes].sort(function (a, b) {

            return (
                Number(b.pinned) -
                Number(a.pinned)
            );

        });

    sortedNotes.forEach(
        createNoteElement
    );

    updateTagFilter();

    const noteCounter =
        document.getElementById(
            "noteCounter"
        );

    if (noteCounter) {

        const totalNotes =
            notes.length;

        const pinnedNotes =
            notes.filter(
                function (note) {
                    return note.pinned;
                }
            ).length;

        noteCounter.textContent =
            `${totalNotes} Notes • ${pinnedNotes} Pinned`;

    }

}


// ==================== SEARCH + TAG FILTER ====================

function renderFilteredNotes() {

    notesContainer.classList.toggle(
        "two-columns",
        twoColumns
    );

    const query =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedTag =
        tagFilter
            ? tagFilter.value
            : "all";

    const filteredNotes =
        notes.filter(function (note) {

            const matchesSearch =

                (note.title || "")
                    .toLowerCase()
                    .includes(query)

                ||

                (note.text || "")
                    .toLowerCase()
                    .includes(query)

                ||

                (note.tag || "")
                    .toLowerCase()
                    .includes(query);


            const matchesTag =

                selectedTag === "all"

                ||

                (note.tag || "").trim() ===
                selectedTag;


            return (
                matchesSearch &&
                matchesTag
            );

        });


    notesContainer.innerHTML = "";


    const sortedFilteredNotes =
        [...filteredNotes].sort(
            function (a, b) {

                return (
                    Number(b.pinned) -
                    Number(a.pinned)
                );

            }
        );


    sortedFilteredNotes.forEach(
        createNoteElement
    );

}


// ==================== SEARCH ====================

searchInput.addEventListener(
    "input",
    function () {

        renderFilteredNotes();

    }
);


// ==================== TAG FILTER ====================

if (tagFilter) {

    tagFilter.addEventListener(
        "change",
        function () {

            renderFilteredNotes();

        }
    );

}


// ==================== ADD NOTE ====================

addNoteBtn.addEventListener(
    "click",
    function () {

        const newNote = {

            title: "",

            text: "",

            tag: "",

            color:
                colors[
                    notes.length %
                    colors.length
                ],

            pinned: false

        };


        notes.push(newNote);

        saveNotes();

        renderNotes();

    }
);


// ==================== DARK MODE ====================

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );

let darkMode =
    localStorage.getItem(
        "notexDarkMode"
    ) === "true";


function updateDarkMode() {

    if (darkMode) {

        document.body.classList.add(
            "dark-mode"
        );

        darkModeBtn.textContent =
            "☀️ Light Mode";

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        darkModeBtn.textContent =
            "🌙 Dark Mode";

    }

}


darkModeBtn.addEventListener(
    "click",
    function () {

        darkMode =
            !darkMode;

        localStorage.setItem(
            "notexDarkMode",
            darkMode
        );

        updateDarkMode();

    }
);


// ==================== LAYOUT ====================

function updateLayoutButton() {

    if (twoColumns) {

        layoutToggleBtn.textContent =
            "▦ 1 Column";

    } else {

        layoutToggleBtn.textContent =
            "▦ 2 Columns";

    }

}


layoutToggleBtn.addEventListener(
    "click",
    function () {

        twoColumns =
            !twoColumns;

        localStorage.setItem(
            "notexTwoColumns",
            twoColumns
        );

        updateLayoutButton();

        renderNotes();

    }
);


// ==================== RECENTLY DELETED ====================

deletedBtn.addEventListener(
    "click",
    function () {

        showRecentlyDeleted();

    }
);


function showRecentlyDeleted() {

    let modal =
        document.getElementById(
            "deletedModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "deletedModal";

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <div class="deleted-box">

            <button
                class="close-deleted"
                type="button"
            >
                ✕
            </button>

            <h2>
                🗑️ Recently Deleted
            </h2>

            <div
                class="deleted-notes-list"
            ></div>

        </div>

    `;


    const list =
        modal.querySelector(
            ".deleted-notes-list"
        );


    if (
        recentlyDeleted.length === 0
    ) {

        list.innerHTML =
            "<p>No deleted notes.</p>";

    } else {

        recentlyDeleted.forEach(
            function (note, index) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "deleted-note-item";


                item.innerHTML = `

                    <strong>
                        ${note.title || "Untitled Note"}
                    </strong>

                    <div>

                        <button
                            class="restore-note"
                            data-index="${index}"
                            type="button"
                        >
                            Restore
                        </button>

                        <button
                            class="permanent-delete"
                            data-index="${index}"
                            type="button"
                        >
                            Delete
                        </button>

                    </div>

                `;


                list.appendChild(
                    item
                );

            }
        );

    }


    // ==================== CLOSE ====================

    modal
        .querySelector(
            ".close-deleted"
        )
        .addEventListener(
            "click",
            function () {

                modal.remove();

            }
        );


    // ==================== RESTORE ====================

    modal
        .querySelectorAll(
            ".restore-note"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const restoredNote =
                            recentlyDeleted.splice(
                                index,
                                1
                            )[0];


                        notes.push(
                            restoredNote
                        );

                        saveNotes();


                        localStorage.setItem(
                            "notexRecentlyDeleted",
                            JSON.stringify(
                                recentlyDeleted
                            )
                        );


                        renderNotes();

                        showRecentlyDeleted();

                    }
                );

            }
        );


    // ==================== PERMANENT DELETE ====================

    modal
        .querySelectorAll(
            ".permanent-delete"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        recentlyDeleted.splice(
                            index,
                            1
                        );


                        localStorage.setItem(
                            "notexRecentlyDeleted",
                            JSON.stringify(
                                recentlyDeleted
                            )
                        );


                        showRecentlyDeleted();

                    }
                );

            }
        );

}


// ==================== NOXI AI ====================

const noxiBtn =
    document.getElementById(
        "hoaxdk"
    );


if (noxiBtn) {

    noxiBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "/noxi-login";

        }
    );

}


// ==================== QUICK MENU ====================

const quickMenuBtn =
    document.getElementById(
        "quickMenuBtn"
    );


const quickMenu =
    document.getElementById(
        "quickMenu"
    );


if (quickMenu) {

    quickMenu.style.display =
        "none";

}


if (quickMenuBtn && quickMenu) {

    quickMenuBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            if (
                quickMenu.style.display ===
                "none"
            ) {

                quickMenu.style.display =
                    "block";

            } else {

                quickMenu.style.display =
                    "none";

            }

        }
    );

}


// ==================== ABOUT NOTEX ====================

const aboutNoteBtn =
    document.getElementById(
        "aboutNoteBtn"
    );


const aboutModal =
    document.getElementById(
        "aboutModal"
    );


const closeAbout =
    document.getElementById(
        "closeAbout"
    );


if (
    aboutNoteBtn &&
    aboutModal &&
    quickMenu
) {

    aboutNoteBtn.addEventListener(
        "click",
        function () {

            aboutModal.style.display =
                "flex";

            quickMenu.style.display =
                "none";

        }
    );

}


if (
    closeAbout &&
    aboutModal
) {

    closeAbout.addEventListener(
        "click",
        function () {

            aboutModal.style.display =
                "none";

        }
    );

}


// ==================== SETTINGS ====================

const settingsBtn =
    document.getElementById(
        "settingsBtn"
    );


const settingsModal =
    document.getElementById(
        "settingsModal"
    );


const closeSettings =
    document.getElementById(
        "closeSettings"
    );


if (
    settingsBtn &&
    settingsModal
) {

    settingsBtn.addEventListener(
        "click",
        function () {

            settingsModal.style.display =
                "flex";

            if (quickMenu) {

                quickMenu.style.display =
                    "none";

            }

        }
    );

}


if (
    closeSettings &&
    settingsModal
) {

    closeSettings.addEventListener(
        "click",
        function () {

            settingsModal.style.display =
                "none";

        }
    );

}


// ==================== CLEAR ALL NOTES ====================

const clearAllNotesBtn =
    document.getElementById(
        "clearAllNotesBtn"
    );


if (clearAllNotesBtn) {

    clearAllNotesBtn.addEventListener(
        "click",
        function () {

            const confirmClear =
                confirm(
                    "Are you sure you want to move all notes to Recently Deleted?"
                );


            if (!confirmClear) return;


            recentlyDeleted.push(
                ...notes
            );


            notes = [];


            localStorage.setItem(
                "notexNotes",
                JSON.stringify(notes)
            );


            localStorage.setItem(
                "notexRecentlyDeleted",
                JSON.stringify(
                    recentlyDeleted
                )
            );


            renderNotes();


            if (settingsModal) {

                settingsModal.style.display =
                    "none";

            }

        }
    );

}


// ==================== START APP ====================

updateDarkMode();

updateLayoutButton();

renderNotes();


// ==================== QUICK DELETED ====================

const quickDeletedBtn =
    document.getElementById(
        "quickDeletedBtn"
    );


if (
    quickDeletedBtn &&
    quickMenu
) {

    quickDeletedBtn.addEventListener(
        "click",
        function () {

            showRecentlyDeleted();

            quickMenu.style.display =
                "none";

        }
    );

}


// ==================== QUICK LAYOUT ====================

const quickLayoutBtn =
    document.getElementById(
        "quickLayoutBtn"
    );


if (
    quickLayoutBtn &&
    quickMenu
) {

    quickLayoutBtn.addEventListener(
        "click",
        function () {

            twoColumns =
                !twoColumns;


            localStorage.setItem(
                "notexTwoColumns",
                twoColumns
            );


            updateLayoutButton();

            renderNotes();


            quickMenu.style.display =
                "none";

        }
    );

}


// ==================== CLOSE QUICK MENU ====================

document.addEventListener(
    "click",
    function (event) {

        if (
            quickMenu &&
            quickMenuBtn &&
            quickMenu.style.display ===
                "block" &&
            !quickMenu.contains(
                event.target
            ) &&
            event.target !==
                quickMenuBtn
        ) {

            quickMenu.style.display =
                "none";

        }

    }
);


// ==================== APPEARANCE ====================

const appearanceBtn =
    document.getElementById(
        "appearanceBtn"
    );


const appearanceModal =
    document.getElementById(
        "appearanceModal"
    );


const closeAppearance =
    document.getElementById(
        "closeAppearance"
    );


if (
    appearanceBtn &&
    appearanceModal
) {

    appearanceBtn.addEventListener(
        "click",
        function () {

            appearanceModal.style.display =
                "flex";

            if (quickMenu) {

                quickMenu.style.display =
                    "none";

            }

        }
    );

}


if (
    closeAppearance &&
    appearanceModal
) {

    closeAppearance.addEventListener(
        "click",
        function () {

            appearanceModal.style.display =
                "none";

        }
    );

}


// ==================== APPEARANCE THEME OPTIONS ====================

const darkThemeOption =
    document.getElementById(
        "darkThemeOption"
    );


const lightThemeOption =
    document.getElementById(
        "lightThemeOption"
    );


if (
    darkThemeOption &&
    appearanceModal
) {

    darkThemeOption.addEventListener(
        "click",
        function () {

            darkMode = true;

            localStorage.setItem(
                "notexDarkMode",
                "true"
            );

            updateDarkMode();

            appearanceModal.style.display =
                "none";

        }
    );

}


if (
    lightThemeOption &&
    appearanceModal
) {

    lightThemeOption.addEventListener(
        "click",
        function () {

            darkMode = false;

            localStorage.setItem(
                "notexDarkMode",
                "false"
            );

            updateDarkMode();

            appearanceModal.style.display =
                "none";

        }
    );

}

