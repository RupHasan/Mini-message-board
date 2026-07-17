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
      // User sees the bottom – hide the down button
      downBtnContainer.style.opacity = '0';
      downBtnContainer.style.pointerEvents = 'none'; // prevent clicks
    } else {
      // Not at bottom – show the down button
      downBtnContainer.style.opacity = '1';
      downBtnContainer.style.pointerEvents = 'auto';
    }
  });
}, { threshold: 0.1 }); // 0.1 = 10% visible is enough

observer.observe(endElement);

function addMsg() {
    document.getElementById("add-dialog").showModal();
}

async function submit() {
    const username = document.getElementById("username").value;
    const getMsg = document.getElementById("msg").value;
    const postMsg = {
        userName: username,
        msg: getMsg
    };

    await fetch("/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postMsg)
    });
    document.getElementById("add-dialog").close();

    document.getElementById("username").value = "";
    document.getElementById("msg").value = "";
    render();
}

function render() {
    document.getElementById("msg-container").innerHTML = "";

    fetch("/show")
        .then(res => res.json())
        .then(data => {
            data.forEach(index => {
                document.getElementById("msg-container").innerHTML += `
            <div class='msg-sub-container'>
              <p class="user-name">${index.username}</p>
              <p class="actual-msg">${index.msg}</p>
            </div>
            `;
            });
        });
}

render();

window.addEventListener('load', function() {
    window.scrollTo({ top: 0, behavior: 'instant' });
});


// Delete it after connecting to web socket.
setInterval(()=>{
    render();
},10000)