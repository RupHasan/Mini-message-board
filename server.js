require("dotenv").config();
const express = require("express");
const pool = require("./db");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(__dirname));


app.post("/admin", (req, res) => {
    if (req.body.pass == process.env.ADMIN_PASSWORD) {
        res.json({ success: true, redirect: "/admin.html" });
    } else {
        res.status(401).json({ success: false, message: "Wrong password" });
    }
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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
