var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var resString = '';
var resJSON = '';

// Settings to connect to the Bamazon database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bamazon'
});
//created a connection with the database so I can work with the data 
connection.connect(function (err) {
    if (err) throw (err);
    console.log('connected as id $ {connection.threadId}');

    connection.query("SELECT*FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
    });

});
// Query Data
function displayTable() {
	
	var query = 'SELECT * FROM products';
		connection.query(query,function(err,res,fields) {
			if(err) throw err;
			//Converts to string
			resString = JSON.stringify(res,null,2);
			//Convert to JSON
			resJSON  = JSON.parse(resString);
			//Testing
			var table = new Table({
			    head: ['item_id', 'product_name','department_name','price','stock_quantity'], 
			    colWidths: [25, 25, 25 ,25 ,25]
			});
			for(var i = 0; i < resJSON.length; i++) {
				//Creates a new array
				var newArray = new Array();
				//adds content to table
				table.push(newArray);
				//Adds content to new array of Nth row
				for(var j = 0; j < columns.length; j++){
					newArray.push(resJSON[i][columns[j]]);
				}
			}
			//Displays Table in terminal
			console.log(table.toString());
			customerRequest();
		});

}
//working on displaying prompt

inquirer.prompt([
    {

        type: "input",
        name: "itemid",
        message: "What is the ID of the product you would like to purchase?",
        validate: function (value) {
            if (isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0) {
                return true;
            } else {
                return false;
            }
        }
    },

    {
        type: "input",
        name: "itemQty",
        message: "Please enter the quantity would you like to purchase?",
        validate: function (value) {
            if (isNaN(value)) {
                return false;
            } else {
                return true;
            }
        }
    }




]).then(function (ans) {
    var whatToBuy = (ans.id) - 1;
    var howMuchToBuy = parseInt(ans.qty);
    var grandTotal = parseFloat(((res[whatToBuy].Price) * howMuchToBuy).toFixed(2));


});

function checkQuantity(id, quantity) {
	var query = "SELECT stock_quantity FROM products WHERE ?"

	connection.query(query,{
		item_id: id
	}, 
	function(err,res,fields) {
		if(err) throw err;
		var stockJSON = JSON.stringify(res,null,2);
		var stockParsed = JSON.parse(stockJSON);
		var stockQuantity = stockParsed[0].stock_quantity;
		
		//If quantity in Database is greater then users quantity request ....
		if(stockQuantity >= quantity) {
			var query = 'UPDATE products SET ? WHERE ?'
			//Update database
			connection.query(query,[
			{
				//Subtract quantity in database from users request quantity
				stock_quantity: stockQuantity - quantity
			},
			{
				//product id
				item_id: id
			
			}], function(err,res,fields){
				promptBool = false;
				displayTable();
			});
		}	
		else {
			console.log('Insufficient quantity!');
		}
	});
}
