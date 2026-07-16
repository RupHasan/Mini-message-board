// This is a front-end file, dedicated for admin.html
function showTable() {
    document.getElementById("table-container").innerHTML = "";

    fetch("/show")
        .then(res => res.json())
        .then(data => {
            data.forEach(index => {
                document.getElementById("table-container").innerHTML += `
                    <div class='msg-sub-container'>
                      <h3>Id number is ${index.id}</h3>
                      <p class="user-name">${index.username}</p>
                      <p class="actual-msg">${index.msg}</p>
                    </div>
            `;
            });
        });
}

showTable();

async function changeMsg() {
    const changeId = Number(document.getElementById("givenId").value);
    const newUsername = document.getElementById("username").value;
    const newMsg = document.getElementById("msg").value;

    const response = await fetch(`/admin/${changeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            password: window.adminPass,
            username: newUsername,
            msg: newMsg
        })
    });
    const data = await response.json();

    if (data.success == false) {
        document.write(data.messege);
    } else {
        showTable();
    }
}

async function deleteRow() {
    const delId = Number(document.getElementById("msg-to-del").value);

    const response = await fetch(`/admin/${delId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            password: window.adminPass
        })
    });
    const data = await response.json();

    if (data.success == false) {
        document.write(data.messege);
    } else {
        showTable();
    }
}
