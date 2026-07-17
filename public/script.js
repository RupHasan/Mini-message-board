// ─── AUTO TYPER ───
let type = new Typed("#autoType", {
    strings: ["Programmer", "Student", "Web Developer", "Front-end Developer", "Back-end Developer", "Full Stack Developer"],
    typeSpeed: 150,
    backSpeed: 150,
    loop: true
});

// ─── FADE OUT "GO DOWN" BUTTON AT BOTTOM ───
const endElement = document.getElementById('the-end');
const downBtnContainer = document.getElementById('go-down-btn-container');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            downBtnContainer.style.opacity = '0';
            downBtnContainer.style.pointerEvents = 'none';
        } else {
            downBtnContainer.style.opacity = '1';
            downBtnContainer.style.pointerEvents = 'auto';
        }
    });
}, { threshold: 0.1 });

observer.observe(endElement);

// ─── SUBMIT MESSAGE ───
async function submit() {
    const getMsg = document.getElementById("msg").value;
    
    if (!getMsg.trim()) {
        alert('Please enter a message first!');
        return;
    }
    
    const postMsg = {
        msg: getMsg
    };

    try {
        const response = await fetch("/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postMsg),
            credentials: "include"  // ← SENDS THE COOKIE
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert("Your session expired. Please log in again.");
                window.location.href = "/login";
                return;
            }
            throw new Error(`Server error: ${response.status}`);
        }

        // Clear input and refresh messages
        document.getElementById("msg").value = "";
        render();
    } catch (error) {
        console.error("Submit error:", error);
        alert("Failed to send message. Please try again.");
    }
}

// ─── RENDER MESSAGES ───
async function render() {
    try {
        const response = await fetch("/show", {
            credentials: "include"  // ← SENDS THE COOKIE
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert("Your session expired. Please log in again.");
                window.location.href = "/login";
                return;
            }
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        const container = document.getElementById("msg-container");
        container.innerHTML = "";

        // Render messages
        data.forEach(msg => {
            container.innerHTML += `
                <div class='msg-sub-container'>
                    <p class="user-name">${escapeHtml(msg.username)}</p>
                    <p class="actual-msg">${escapeHtml(msg.msg)}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Render error:", error);
        document.getElementById("msg-container").innerHTML = 
            `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">
                ⚠️ Could not load messages. Please refresh the page.
            </p>`;
    }
}

// ─── HELPER: Escape HTML to prevent XSS ───
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ─── SCROLL TO TOP ON PAGE LOAD ───
window.addEventListener('load', function() {
    window.scrollTo({ top: 0, behavior: 'instant' });
});

// ─── AUTO-REFRESH (polling) ───
// Remove this after connecting to WebSocket
setInterval(() => {
    render();
}, 10000);

// ─── KEYBOARD SHORTCUT: Enter to send ───
document.addEventListener('DOMContentLoaded', function() {
    const msgInput = document.getElementById('msg');
    if (msgInput) {
        msgInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
            }
        });
    }
});

// ─── INITIAL RENDER ───
render();