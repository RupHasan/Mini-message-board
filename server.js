require("dotenv").config();
const express = require("express");
const pool = require("./db");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(__dirname));

app.get("/show", async (req, res) => {
    const conn = await pool.getConnection();
    const [results] = await conn.query("SELECT * FROM miniMsgBoard");

    conn.release();
    res.json(results);
});

app.post("/new", async (req, res) => {
    const userName = req.body.userName;
    const msg = req.body.msg;
    const conn = await pool.getConnection();
    const results = await conn.query(
        "INSERT INTO miniMsgBoard (username,msg) VALUES (?,?)",
        [userName, msg]
    );
    conn.release();
    res.json({ success: true, username: userName, msg: msg });
});

// The admin authentication system stands hee

app.post("/admin", (req, res) => {
    const givenPassword = req.body.givenPass;

    if (givenPassword == process.env.ADMIN_PASSWORD.trim()) {
        res.send(`
            <main>
                <h1>4 oparations. Your control boss!</h1>
                <h3>
                    <ol>
                        <li>Get: See the full table!</li>
                        <li>Post: Add anything you want!</li>
                        <li>Put: Change any msg as anything!</li>
                        <li>Delete: Delete any msg you want!</li>
                    </ol>
                </h3>
                
                <section id="getReq-container">
                    <h2>Get: See the full table</h2>
                    
                    <section id="table-container"></section>
                </section>
                
                <section id="postReq-container">
                    <h2>Bruh, just do it from the main page, Im just too lazy to develop this again.</h2>
                </section>
                
                <section id="putReq-container">
                    <h2>Change any msg of any user including their username</h2>
                    <input type="number" id="givenId" placeholder="id number">
                    <input type="text" id="username" placeholder="edit username">
                    <input type="text" id="msg" placeholder="edit msg">
                    <button onclick="changeMsg()">Change!</button>
                </section>
                
                <section id="deleteReq-container">
                    <h2>Delete any msg just by the id number</h2>
                    <input type="number" id="msg-to-del" placeholder="id number to Delete">
                    <button onclick="deleteRow()">Delete</button>
                </section>
            </main>
        
            <script>
                window.adminPass = "${givenPassword}";
            </script>
            <script src="admin.js"></script>
            `);
    } else {
        res.status(401).send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body { font-family: Arial; text-align: center; padding: 50px; background: lightcoral }
                        .error { color: red; font-size: 24px; }
                    </style>
                </head>
                <body>
                    <div class="error">❌ Wrong password!</div>
                    <p>Redirecting in 2 seconds...</p>
                    <script>
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);
                    </script>
                </body>
            </html>
    `);
    }
});

// The admins power

app.put("/admin/:id", async (req, res) => {
    const changeId = parseInt(req.params.id);
    const givenUsername = req.body.username;
    const givenMsg = req.body.msg;
    
    if (req.body.password == process.env.ADMIN_PASSWORD.trim()) {
        const conn = await pool.getConnection();
        const results = await conn.query(
                "UPDATE miniMsgBoard SET username = ?, msg = ? WHERE id = ?",
                [givenUsername,givenMsg,changeId]
            );

        conn.release();
        res.json({success:true,messege:"Database updated!"})
    } else {
        // will update very soon
    }
});

app.delete("/admin/:id", async (req,res)=>{
    const delId = parseInt(req.params.id);
    
    if (req.body.password == process.env.ADMIN_PASSWORD.trim()) {
        const conn = await pool.getConnection()
        const results = await conn.query("DELETE FROM miniMsgBoard WHERE id = ?",[delId])
        conn.release();
        res.json({success:true,messege:`Delete successful. ID ${delId}`})
    } else {
        // will update very soon
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});