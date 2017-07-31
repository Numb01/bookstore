var express = require("express");
var app = express();
var db = require("../pool/poolConnection");
var User = require("../entity/User");
var mysql = require("mysql");

app.get("/", function(req, res){
	/*var post  = {username:"user1"};
	var sql = "select * from user where ?";
	
    db.query(sql, post, function(err, rows) {
		db.release();
		if(err){
			console.log("---- loi me roi");
			console.log(err);
		}else{
			console.log(rows);
			
		}
    });*/

	
	/*var post  = {username:"user1"};
	var sql = "select * from user where ?";
	db.execSelect(sql, post, User, done);*/
	//var post  = [{username:"user9", pass:"123456", name:"Nguyễn Văn A"},9];
	//var sql = "update user set ? where id = ?";
	var post  = {id:10};
	var sql = "delete from user where ?";
	
	sql = mysql.format(sql, post);
	console.log(sql);
	db.execUpdateDelete(sql, post, 2, done);
	
	function done(data){
		console.log("---- data: "+ data);
		//this.res.json(data[0]);
	}
});

app.listen(8080);
