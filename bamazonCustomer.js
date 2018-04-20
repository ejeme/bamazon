
var mysql = require("mysql");
var inquirer = require("inquirer");




// Settings to connect to the Bamazon database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});





// Check to see if connection is successful
connection.connect(function (err) {
	if (err) throw err;
	console.log('connection id', connection.threadId);
	displayProducts();


});
//Query the database
function displayProducts() {
	connection.query("SELECT * FROM products", function (err, res) {
		if (err)
			console.log(err);




		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + "|" + res[i].product_name + "|" + res[i].price);
		}
		promptCustomer(res);
	})
}



//working on displaying prompt

inquirer.prompt([{
	type: "input",
	name: "itemID",
	message: "What is the ID of the product you would like to purchase?",

	type: "input",
	name: "quantity",
	message: "Please enter the quantity would you like to purchase?",

}]).then(function (answers) {
	var selectedProduct;

	for (var i = 0; i < res.length; i += 1) {
		if (res[i].item_id === parseInt(answers.itemID)) {
			selectedProduct = res[i];
			console.log(res[i]);



		}
	}




})

var userQuantity = parseInt(answers.quantity);

if (selectedProduct.stock_quantity < userQuantity) {
	console.log("Insufficient Quantity");
} else {
	//selectedProduct.price is coming from the database
	var cost = userQuantity * selectedProduct.price
	//.toFixed limits decimal value to 2 spots.
	console.log("Your total cost is: $ " + cost.toFixed(2));

	//To update database
	connection.query("UPDATE products SET ? WHERE ?", [{ "stock_quantity": selectedProduct.stock_quantity - userQuantity }, { "item_id": answers.itemID }], function (err, res) {
		if (err) {
			console.log("There was an error. Purchase not made.");
			throw err;
		}
		console.log("Thanks for your purchase!");

	})
};
        
    

