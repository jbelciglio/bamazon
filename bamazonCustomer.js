var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
    //connection.end();
  });

  var mainMenu = function() {
      console.log("==========================");
      console.log("Welcome to Bamazon(get it?)!! Here is the list of all our products in stock:");
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (let i=0; i < res.length; i++) {
            console.log("ID#: " + res[i].id + ", " + res[i].product_name + ", $" + res[i].price); 
        }
      inquirer.prompt ([
          {
          name: "chooseItem",
          type: "input",
          message: "Please enter your product ID#"
      }, {
        name: "howMany",
        type: "input",
        message: "Excellent! How many would you like?"
      
      }]).then (function(answer) {
          var item = answer.chooseItem - 1;
        console.log(res[item].stock_quantity);
        if (answer.howMany > res[item].stock_quantity) {
            console.log("insufficient quantity!");
            mainMenu();
        } else if (answer.howMany <= res[item].stock_quantity) {
            console.log("sufficient quantity!");
            var update = res[item].stock_quantity - answer.howMany;
            var query1 = "UPDATE products SET ? WHERE ?";
                connection.query(query1, [{ stock_quantity: update}, {id: answer.chooseItem }], function(err, res1) {
                    console.log("Package will be delivered! Your total comes to: $" + (res[item].price * answer.howMany));
                    mainMenu();
                })
    }
      })
    })
}
      


            
       