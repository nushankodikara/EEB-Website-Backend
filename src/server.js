const express = require("express");
const app = express();
var cors = require("cors");
let bodyParser = require("body-parser");
let multer = require("multer");
let forms = multer();

require("dotenv").config();

// apply them

var allowedOrigins = [
    "http://localhost:5173",
    "https://euroeximbank.com",
    "https://www.euroeximbank.com",
    "https://eeb-website.vercel.app",
];
app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    })
);

app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const port = process.env.PORT || 3000;
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

try {
    connection.connect();
    console.log("Database Connected");
} catch (error) {
    console.log("Database Connection Failed", error);
}

// connection.connect();

// connection.query(
// 	"SELECT * FROM demo limit 10",
// 	function (error, results, fields) {
// 		if (error) throw error;
// 		console.log("Out: ", results);
// 	}
// );

// connection.end();

app.get("/", (req, res) => res.send("Server Is Running."));

// get email from post request
app.post("/check", (req, res) => {
    let check = req.body.check || "";

    // search database
    if (check == "" || check == null) {
        res.send({ id: -99, message: "Enter email or mobile number" });
    } else {
        try {
            let sql = `SELECT * FROM demo WHERE email="${check}" OR empnumber="${check}" OR mobile="${check}"`;

            connection.query(sql, function (err, result) {
                if (err) throw err;
                if (result.length == 0) {
                    console.log("No Result Found");
                    res.send({ id: -99, message: "No record found" });
                } else {
                    console.log(result[0]);
                    res.send(result[0]);
                }
            });
        } catch (error) {
            console.log(error);
            res.send({ id: -99, message: "Something went wrong" });
        }
    }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
