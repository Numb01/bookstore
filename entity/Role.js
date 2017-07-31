var express = require("express");
var app = express();
var db = require("../pool/poolConnection");
var mysql = require("mysql");

var Role = {
	roleId				: Number,
	roleName			: String,
	role 				: Number,

	getRoleId			: function(){return this.roleId},
	getRoleName			: function(){return this.roleName},
	getRole				: function(){return this.role},

	setRoleId			: function(id){this.id = id},
	setRoleName			: function(roleName){this.roleName = roleName},
	setRole				: function(role){this.role = role},
}

module.exports.getRole = function(callback) {
	var post = {};
	var sql = "select * from role order by role asc";
	sql = mysql.format(sql, post);
	console.log(sql);

	db.execSelect(sql, post, Role, doneFn);
	
	function doneFn(err, user){
		// console.log("user[0]id of querry login: "+ user[0].id);
		callback(err, user);
	}
}

module.exports.Role = Role;