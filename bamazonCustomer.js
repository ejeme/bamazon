
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
	connection.query (query, function (err, res) {
		if (err) throw (err);
		resString = JSON.stringify(res,null,2)
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
		promptCustomerForItem(res);
	})
}


// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
	// Prompts user for what they would like to purchase
	inquirer
	  .prompt([
		{
		  type: "input",
		  name: "choice",
		  message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
		  validate: function(val) {
			return !isNaN(val) || val.toLowerCase() === "q";
		  }
		}
	  ])
	  .then(function(val) {
		// Check if the user wants to quit the program
		checkIfShouldExit(val.choice);
		var choiceId = parseInt(val.choice);
		var product = checkInventory(choiceId, inventory);
  
		// If there is a product with the id the user chose, prompt the customer for a desired quantity
		if (product) {
		  // Pass the chosen product to promptCustomerForQuantity
		  promptCustomerForQuantity(product);
		}
		else {
		  // Otherwise let them know the item is not in the inventory, re-run loadProducts
		  console.log("\nThat item is not in the inventory.");
		  displayProducts();
		}
	  });
  }
  
  // Prompt the customer for a product quantity
  function promptCustomerForQuantity(product) {
	inquirer
	  .prompt([
		{
		  type: "input",
		  name: "quantity",
		  message: "How many would you like? [Quit with Q]",
		  validate: function(val) {
			return val > 0 || val.toLowerCase() === "q";
		  }
		}
	  ])
	  .then(function(val) {
		// Check if the user wants to quit the program
		checkIfShouldExit(val.quantity);
		var quantity = parseInt(val.quantity);
  
		// If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
		if (quantity > product.stock_quantity) {
		  console.log("\nInsufficient quantity!");
		  displayProducts();
		}
		else {
		  // Otherwise run makePurchase, give it the product information and desired quantity to purchase
		  makePurchase(product, quantity);
		}
	  });
  }
  
  // Purchase the desired quantity of the desired item
  function makePurchase(product, quantity) {
	connection.query(
	  "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
	  [quantity, product.item_id],
	  function(err, res) {
		// Let the user know the purchase was successful, re-run loadProducts
		console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
		displayProducts();
	  }
	);
  }
  
  // Check to see if the product the user chose exists in the inventory
  function checkInventory(choiceId, inventory) {
	for (var i = 0; i < inventory.length; i++) {
	  if (inventory[i].item_id === choiceId) {
		// If a matching product is found, return the product
		return inventory[i];
	  }
	}
	// Otherwise return null
	return null;
  }
  
  // Check to see if the user wants to quit the program
  function checkIfShouldExit(choice) {
	if (choice.toLowerCase() === "q") {
	  // Log a message and exit the current node process
	  console.log("Goodbye!");
	  process.exit(0);
	}
  }
  