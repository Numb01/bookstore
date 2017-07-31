var express = require("express");
var app = express();
var db = require("../pool/poolConnection");
var mysql = require("mysql");
var Util = require('../util/Util');

var User = {
	id			:	Number,
	userName	:	String,
	pass		:	String,
	fullName	: 	String,
	roleId		: 	Number,
	role		: 	Number,
	roleName	: 	String,
	
	getId			: 	function(){ return this.id; },
	getUserName		: 	function(){ return this.userName; },
	getPass			: 	function(){ return this.pass; },
	getFullname		: 	function(){ return this.fullName; },
	getRoleId		: 	function(){ return this.roleId; },
	getRole			: 	function(){ return this.role; },
	getRoleName		: 	function(){ return this.roleName; },
	
	
	setId			: 	function(id){ this.id = id; },
	setUserName		: 	function(userName){ this.userName = userName; },
	setPass			: 	function(pass){ this.pass = pass; },
	setFullname		: 	function(fullName){ this.fullName = fullName; },
	setRoleId		: 	function(roleId){ this.roleId = roleId; },
	getRole			: 	function(role){ this.role = role; },
	getRoleName		: 	function(roleName){ this.roleName = roleName; },
}

//console.log(User.getId());

module.exports.login = function(username, pass, callback){
	var post  = [username, pass];
	var sql = "select u.*, r.roleId, r.role, r.roleName from user u "
			+ "left join role r on u.roleId = r.roleId "
			+ "where username = ? and pass = md5(?)";
	sql = mysql.format(sql, post);
	//console.log(sql);

	db.execSelect(sql, post, User, doneFn);
	
	function doneFn(err, user){
		// console.log("user[0]id of querry login: "+ user[0].id);
		callback(err, user[0]);
	}

}

module.exports.getUserById = function(id, callback){
	var post  = {"u.id": id};
	var sql = "select u.*, r.roleId, r.role, r.roleName from user u "
			+ "left join role r on u.roleId = r.roleId "
			+ "where ?";
	sql = mysql.format(sql, post);
	//console.log(sql);

	
	function doneFn(err, user){
		// console.log("user[0]id of querry get by id: "+ user[0].id);
		callback(err, user[0]);
	}
	
	db.execSelect(sql, post, User, doneFn);

}

module.exports.getUserByUserName = function(username, callback){
	var post  = {"u.username": username};
	var sql = "select u.*, r.roleId, r.role, r.roleName from user u "
			+ "left join role r on u.roleId = r.roleId "
			+ "where ?";
	sql = mysql.format(sql, post);
	//console.log(sql);

	
	function doneFn(err, user){
		// console.log("user[0]id of querry get by id: "+ user[0].id);
		callback(err, user[0]);
	}
	
	db.execSelect(sql, post, User, doneFn);

}

module.exports.findAll = function(callback){
	var post = {};
	var sql = "select u.*, r.roleId, r.role, r.roleName from user u "
			+ "left join role r on u.roleId = r.roleId "
			+ "where 1 = 1 order by u.id desc";
	sql = mysql.format(sql, post);
	console.log(sql);

	db.execSelect(sql, post, User, doneFn);
	
	function doneFn(err, user){
		// console.log("user[0]id of querry login: "+ user[0].id);
		callback(err, user);
	}

}

module.exports.addAdmin = function(username, pass, fullname, roleid, callback){
	var post = {userName: username, pass: Util.hash(pass), fullName: fullname, roleId: roleid};
	var sql = "insert into user set ?";
	sql = mysql.format(sql, post);
	console.log(sql);

	db.execInsert(sql, post, User, doneFn);
	
	function doneFn(err, result){
		// console.log("user[0]id of querry login: "+ user[0].id);
		callback(err, result);
	}

}

module.exports.editAdmin = function(user, pass, callback){
	var post  = [];
	console.log("-- userPass: "+ user.pass +" --oldPass: "+ pass);
	if(pass === user.pass){
		post = [{userName:user.userName, fullName: user.fullName, roleId: user.roleId}, user.id];
	}else{
		post = [{userName:user.userName, pass:Util.hash(user.pass), fullName: user.fullName, roleId: user.roleId}, user.id];
	}
	var sql = "update user set ? where id = ?";
	//var post = {userName: username, pass: Util.hash(pass), fullName: fullname, roleId: roleid};
	sql = mysql.format(sql, post);
	console.log(sql);

	db.execUpdateDelete(sql, post, 1, doneFn);
	
	function doneFn(err, result){
		// console.log("user[0]id of querry login: "+ user[0].id);
		callback(err, result);
	}

}

module.exports.resetPass = function(id, callback){
	var post  = [{pass:Util.hash('123456')}, id];
	var sql = "update user set ? where id = ?";
	//var post = {userName: username, pass: Util.hash(pass), fullName: fullname, roleId: roleid};
	sql = mysql.format(sql, post);
	console.log(sql);

	db.execUpdateDelete(sql, post, 1, doneFn);
	
	function doneFn(err, result){
		// console.log("user[0]id of querry login: "+ user[0].id);
		callback(err, result);
	}

}

module.exports.deleteAdmin = function(id, callback){
	var post  = {id:id};
	var sql = "delete from user where ?";
	//var post = {userName: username, pass: Util.hash(pass), fullName: fullname, roleId: roleid};
	sql = mysql.format(sql, post);
	console.log(sql);

	db.execUpdateDelete(sql, post, 2, doneFn);
	
	function doneFn(err, result){
		// console.log("user[0]id of querry login: "+ user[0].id);
		callback(err, result);
	}

}
// module.exports.findAll = function(username, role, callback){
// 	var post  = [];
// 	if(username !== "" && username !== null){
// 		post.push(username);
// 	}
// 	if(role !== "" && role !== null){
// 		post.push(role);
// 	}

// 	var sqlBonus = "";
// 	if((username !== "" && username !== null)){
// 		sqlBonus += "and u.username = ? ";
// 	}

// 	if((role !== "" && role !== null)){
// 		sqlBonus += "and r.role = ? ";
// 	}

// 	var sql = "select u.*, r.role, r.name from user u "
// 			+ "left join role r on u.roleId = r.id "
// 			+ "where 1 = 1 "+sqlBonus;
// 	sql = mysql.format(sql, post);
// 	console.log(sql);

// 	db.execSelect(sql, post, User, done);
	
// 	function done(err, user){
// 		// console.log("user[0]id of querry login: "+ user[0].id);
// 		callback(err, user[0]);
// 	}

// }

module.exports.User = User;