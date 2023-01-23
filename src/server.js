const express = require("express");
const app = express();

let bodyParser = require("body-parser");
let multer = require("multer");
let forms = multer();

require("dotenv").config();

// apply them

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

connection.connect();

// connection.connect();

// connection.query(
// 	"SELECT * FROM demo limit 10",
// 	function (error, results, fields) {
// 		if (error) throw error;
// 		console.log("Out: ", results);
// 	}
// );

// connection.end();

app.get("/", (req, res) => res.send("Hello World!"));

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
