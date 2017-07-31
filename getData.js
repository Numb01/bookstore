var express = require("express");
var app = express();
var orm = require("orm");

/*function getData(connectionString, objectModel, tableName){
	app.use(orm.express(connectionString, {
		define: function(db, models, next){
			models.tableName = db.define(tableName, {
				function(){
					return showProperties(objectModel);
				}
			});
			next();
		}
	}));
}


function getType(obj){
    return Object.prototype.toString.call(obj).slice(8, -1);
}

function showProperties(objectModel){
	var propertiesString = "";
	Object.getOwnPropertyNames(objectModel).forEach(
		function(val, index, arr){
			//console.log(val +": "+ getType(val));
			propertiesString += ""+val+": "+getType(val)+",";
		}
	);
	
	return propertiesString;
}

//app.listen(8080);
*/

app.use(orm.express("mysql://admin-nodejs:01234563210@localhost/nodejs-test", {
	define: function (db, models) {
		models.user = db.define("user", { id: Number, username: String, pass: String, name: String });
	}
}));
app.listen(8080);

app.get("/", function (req, res) {
	// req.models is a reference to models used above in define()
	//console.log(showProperties(User));
	//getData("mysql://admin-nodejs:01234563210@localhost/nodejs-test", User, "User");
	//req.models.person.find();
	req.models.user.find({ 1: "1" }, function (err, user) {
		console.log(user[0].id);
	});
	//res.json(req.models.user);
	//req.models.find();
});
