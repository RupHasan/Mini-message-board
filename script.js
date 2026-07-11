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

    await fetch("http://localhost:3000/new", {
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

    fetch("http://localhost:3000/show")
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