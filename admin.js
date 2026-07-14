// This is a front-end file, dedicated for admin.html
console.log('connected')

function showTable() {
    document.getElementById("table-container").innerHTML = "";

    fetch("/show")
        .then(res => res.json())
        .then((data) => {
            data.forEach((index) => {
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