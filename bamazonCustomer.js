
var mysql = require("mysql");
var table = require("cli-table");
var inquirer = require("inquirer");

var resString = "";
var resJSON = "";

var columns = ["item_id", "product_name", "department_name", "price", "stock_quantity"];


// Settings to connect to the Bamazon database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon_db",
	insecureAuth: "true"
});

//connection.connect();

// Check to see if connection is successful
connection.query('SELECT + 1', function (error, results, fields) {
	if (error) throw error;
	console.log('connection id', connection.threadId);
	displayProducts();
});

//Query the database
function displayProducts() {
	var query = "SELECT * FROM products"; 
	connection.query (query, function (error, results, fields) {
		if (error) throw (error);
		resString = JSON.stringify(results,null,2)
		resJSON = JSON.parse(resString);
		var Table = new table({ 
			head: ["ID", "Product Name", "Department Name", "Price", "Stock Quantity"], colWidths: [5,20,20,10,18]
		});

		for (var i = 0; i < resJSON.length; i++) {
			var newArray = new Array();
			Table.push(newArray);
			for (var j = 0; j < columns.length; j++ ) {
				newArray.push(resJSON[i][columns[j]]);
			}
		}
		console.log(Table.toString());
		customerRequest();
	})
}

//working on customer request

function customerRequest() {

inquirer.prompt([
	{
	type: "input",
	name: "Id",
	message: "What is the ID of the product you would like to purchase?",
	validate: function(value){
		var valid = !isNaN(parseFloat(value));
		return valid || "Please enter a number";
	}
	},
	{
	type: "input",
	name: "quantity",
	message: "Please enter the quantity would you like to purchase?",
	validate: function(value){
		var valid = !isNaN(parseFloat(value));
		return valid || "Please enter a number";
	}
	}

])
	.then(function (answer) {
		checkQuantity(answer.id, answer.quantity)

	});
}

function checkQuantity(id, quantity){
	var query = "SELECT stock_quantity FROM products WHERE?"
	connection.query(query,{
		item_id:id
	},
	function (error, results,fields) {
		if(error) throw error;
		var stockJSON = JSON.stringify (results,null,2);
		var stockParsed = JSON.parse(stockJSON);
		var stockQuantity = stockParsed[0].stock_quantity;

		if(stockQuantity >= quantity){
			var query = "UPDATE products SET ? WHERE ?"

			connection.query(query,[
				{
					stock_quantity:stockQuantity - quantity
				},
				{
					item_id: id

				}], function(error,results,fields){
					promptBool = false;
					displayTable();
				});
		}
		else {
			console.log("Insufficient quantity!")
		}
	});
}
