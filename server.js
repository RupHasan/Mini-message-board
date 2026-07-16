// Boilerplate code;
require("dotenv").config();
const express = require("express");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extented: true }));
app.use(express.static("public"));

function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.send(`
            <script>
                alert("User is not logged in!");
                window.location.href = "/login"
            </script>
        `);
    } else {
        try {
            const decode = jwt.verify(token, process.env.JWT_PASS);
            req.user = decode;
            next();
        } catch (err) {
            return res.send(`
                <script>
                    alert("Token is not verified! Must log in again.");
                    window.location.href = "/login"
                </script>
            `);
        }
    }
}

app.get("/", authUser, async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

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
            [givenUsername, givenMsg, changeId]
        );

        conn.release();
        res.json({ success: true, messege: "Database updated!" });
    } else {
        res.status(403).json({ success: false, messege: humiliation() });
    }
});

app.delete("/admin/:id", async (req, res) => {
    const delId = parseInt(req.params.id);

    if (req.body.password == process.env.ADMIN_PASSWORD.trim()) {
        const conn = await pool.getConnection();
        const results = await conn.query(
            "DELETE FROM miniMsgBoard WHERE id = ?",
            [delId]
        );
        conn.release();
        res.json({ success: true, messege: `Delete successful. ID ${delId}` });
    } else {
        res.status(403).json({ success: false, messege: humiliation() });
    }
});

function humiliation() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>⚠️ INTRUSION DETECTED ⚠️</title>
            <style>
                body {
                    background-color: #030005;
                    color: #00ff41;
                    font-family: 'Courier New', Courier, monospace;
                    text-align: center;
                    padding: 50px 20px;
                    margin: 0;
                    overflow-x: hidden;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    border: 2px solid #ff0055;
                    box-shadow: 0 0 20px #ff0055, inset 0 0 10px rgba(255, 0, 85, 0.2);
                    background: #000;
                    padding: 40px;
                    border-radius: 8px;
                }
                h1 {
                    color: #ff0055;
                    font-size: 2.8rem;
                    text-shadow: 0 0 15px #ff0055;
                    margin-top: 0;
                    animation: blink 1.5s infinite;
                }
                .roast-header {
                    color: #ffcc00;
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 20px 0;
                    text-shadow: 0 0 5px rgba(255, 204, 0, 0.5);
                }
                .terminal {
                    background: #050505;
                    border: 1px solid #333;
                    padding: 20px;
                    text-align: left;
                    border-radius: 5px;
                    margin: 30px 0;
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                .line {
                    margin: 8px 0;
                }
                .error-text {
                    color: #ff3333;
                }
                .success-text {
                    color: #00ff41;
                }
                #user-ip {
                    color: #ff0055;
                    font-weight: bold;
                    text-shadow: 0 0 5px rgba(255, 0, 85, 0.3);
                }
                .warning-footer {
                    font-size: 1.1rem;
                    color: #888;
                    margin-top: 30px;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>[!] EXPLOIT FAILURE [!]</h1>
                
                <p class="roast-header">"Bro really thought he was in Mr. Robot." 💀</p>
                
                <div class="terminal">
                    <div class="line"><span class="error-text">[!] Warning:</span> Unauthorized execution attempted on restricted database resource.</div>
                    <div class="line">> Analyzing attacker capability...</div>
                    <div class="line">> Exploit Skill Level: <span class="error-text">0.02% (Absolute Amateur)</span></div>
                    <div class="line">> bypass_status: <span class="error-text">FAILED (Lacked basic authorization credentials)</span></div>
                    <div class="line">> Advice: Go back to inspecting elements on Google, buddy. This isn't for kids.</div>
                    <div class="line">> Initiating counter-measures...</div>
                    <div class="line">> Target IP Address: <span id="user-ip">Locating...</span></div>
                    <div class="line" id="coord-line" style="display:none;">> Sending coordinates to closest authorities... <span class="error-text">[COMPLETE]</span></div>
                </div>
        
                <p class="warning-footer">Take a deep breath, close this tab, and go do your homework.</p>
            </div>
        
            <script>
                fetch('https://api.ipify.org?format=json')
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById('user-ip').innerText = data.ip;
                        document.getElementById('coord-line').style.display = 'block';
                    })
                    .catch(() => {
                        document.getElementById('user-ip').innerText = '127.0.0.1 (Scared to reveal)';
                    });
            </script>
        </body>
        </html>
        `;
}

// Routs for login and sign up

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/signup", async (req, res) => {
    const { username, password, phnNumber, email } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.query(
            "INSERT INTO users (username, password, phone_number, email) VALUES (?,?,?,?)",
            [username, hash, phnNumber || null, email || null]
        );

        res.send(`
            <script>
                alert("Youre account has been created. Please log in with your username and password to continue.")
                window.location.href = "/login"
            </script>
    `);
    } catch (err) {
        if (err.code == "ER_DUP_ENTRY") {
        return res.send(`
            <script>
                alert("User with this username already exits! Please try again with another username")
                window.location.href = "/login"
            </script>
        `);} else {
            return res.send(`
                <script>
                    alert("Our database is down. We are working on it, please try again later.")
                    window.location.href = "/login"
                </script>
            `)
        }
    } finally {
        conn.release();
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const conn = await pool.getConnection();
    const [results] = await conn.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    try {
        if (results.length == 0) {
            return res.status(401).send(`
            <script>
                alert("User with this username does not exist in our database. Please sign in first.")
                window.location.href = "/login"
            </script>
        `);
        } else {
            const check = await bcrypt.compare(password, results[0].password);
            if (check) {
                const token = jwt.sign(
                    { userId: results[0].id, username: results[0].username },
                    process.env.JWT_PASS
                );
                res.cookie("token", token, { httpOnly: true });
                return res.send(`
                <script>
                    alert("Login successful!");
                    window.location.href = "/"
                </script>
            `);
            } else {
                return res.status(401).send(`
                    <script>
                        alert("Your password is incorrect!")
                        window.location.href = "/login"
                    </script>
                `);
            }
        }
    } catch (err) {
        res.send("An error occured! Will be fixed soon.");
    } finally {
        conn.release();
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// blah blah blah
//res.status(403).send();
