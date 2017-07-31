var express = require("express");
var app = express();
var qlAdmin = express.Router();
var User = require("../entity/User");
var Role = require("../entity/Role");
var flash = require('connect-flash');
var passport = require("passport");
var flash = require('connect-flash');
var session = require("express-session");

qlAdmin.get("/admin", function(req, res){

	if(req.isUnauthenticated()){
		res.redirect("/login");
		// res.render("login",{layout: "../login.handlebars"});
	}else{
		var userName = req.body.username;
		var role = req.body.role;

		User.findAll(function(err, user){
			if(err){
				console.log(err);
				return;
			}

			// console.log(user);
			if(typeof user !== "undefined"){
				// console.log("--- user: "+ user);
				var stringHtml = "";
				var id = "";
				for(var i=0; i<user.length;i++){
					// console.log("--user["+i+"]: "+user[i].username);
					id = user[i].id;
					// console.log(user[i].id);
					stringHtml += "<tr class=\"gradeX\">";
					
					stringHtml += "<td>"+(i+1)+"</td>";
					stringHtml += "<td>"+user[i].userName+"</td>";
					stringHtml += "<td>"+user[i].fullName+"</td>";
					stringHtml += "<td>"+user[i].roleName+"</td>";
					stringHtml += "<td>";

					if(user[i].role > req.user.role){
						stringHtml += "<i class=\"icon-edit\" style=\"margin-left: 10px;\" title=\"Edit\" value=\""+id+"\"></i>";
						

						if(user[i].role != req.user.role){
							stringHtml +="<i class=\"icon-remove\" style=\"margin-left: 10px;\" title=\"Delete\" value=\""+id+"\"></i>";
							stringHtml +="<i class=\"icon-refresh\" style=\"margin-left: 10px;\" title=\"Reset Pass\" value=\""+id+"\"></i>";
						}
					}
					stringHtml += "</td>";

					stringHtml += "</tr>";
				}

				// console.log(stringHtml);

				// var json = {objects : user}

				Role.getRole(function(err, role){
					if(err){
						console.log(err);
						return;
					}else{
						// console.log(role);
						res.render("admin", {
							data: stringHtml,
							roles: role
						});
					}
				});

			}else{
				console.log("Error when get data");
			}
		});
	}

	
});

qlAdmin.post("/admin/add", function(req, res){
	var username = req.body.username;
	var pass = req.body.pass;
	var fullName = req.body.fullname;
	var roleId = req.body.role;

	// console.log("-------username: "+username);
	// console.log("-------pass: "+pass);
	// console.log("-------fullName: "+fullName);
	// console.log("-------roleId: "+roleId);

	User.getUserByUserName(username, function(err, user){
		if(err){
			console.log(err);
			return;
		}

		if(typeof user !== 'undefined'){
			res.json({code: 0, desc: "This username is exist!"});
		}else{
			User.addAdmin(username, pass, fullName, roleId, function(err, result){
				if(err){
					console(err);
					return;
				}else{
					if(result != -1){
						User.findAll(function(err, user){
							if(err){
								console.log(err);
								return;
							}

							if(typeof user !== "undefined"){
								res.json({userLogin: req.user, user: user});
							}
						});
					}
				}
			});
		}
	})
	
	// res.redirect("/admin");
});

qlAdmin.post("/admin/get-user/", function(req, res){
	var id = req.body.id;

	// console.log("-------username: "+username);
	// console.log("-------pass: "+pass);
	// console.log("-------fullName: "+fullName);
	// console.log("-------roleId: "+roleId);

	User.getUserById(id, function(err, user){
		if(err){
			console.log(err);
			return;
		}
		//console.log(user);
		if(typeof user === 'undefined'){
			res.json({code: 0, desc: "This id is not exist!"});
		}else{
			if(typeof user !== "undefined"){
				Role.getRole(function(err, role){
					if(err){
						console.log(err);
						return;
					}else{
						// console.log(role);
						req.rolesEdit = role;
						//session.set("roles", role);
						var objs = {user: user, roles: role};
						res.json(objs);
					}
				});
				// res.json(user);
			}
		}
	})
	
	// res.redirect("/admin");
});

qlAdmin.post("/admin/edit", function(req, res){
	var username = req.body.username;
	var pass = req.body.pass;
	var fullName = req.body.fullname;
	var roleId = req.body.role;
	var passOld = req.body.passOld;
	var userId = req.body.userId;

	var user = {
		id 				: userId,
		userName 		: username,
		pass 			: pass,
		fullName 		: fullName,
		roleId 			: roleId
	}
	
	User.editAdmin(user, passOld, function(err, result){
		if(err){
			console(err);
			return;
		}else{
			if(result != -1){
				User.findAll(function(err, user){
					if(err){
						console.log(err);
						return;
					}

					if(typeof user !== "undefined"){
						res.json({userLogin: req.user, user: user});
					}
				});
			}
		}
	});

	
	// res.redirect("/admin");
});

qlAdmin.post("/admin/delete", function(req, res){
	var id = req.body.id;

	console.log("---- id delete: "+ id);
	User.deleteAdmin(id, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		console.log("--- resule: "+ result);
		if(result !== 1){
			res.json({code: 0, desc: "This id is not exist!"});
		}else{
			User.findAll(function(err, user){
				if(err){
					console.log(err);
					return;
				}

				if(typeof user !== "undefined"){
					res.json({userLogin: req.user, user: user});
				}
			});
		}
	})
	
	// res.redirect("/admin");
});

qlAdmin.post("/admin/reset-pass", function(req, res){
	var id = req.body.id;

	console.log("---- id reset pass: "+ id);
	User.resetPass(id, function(err, result){
		if(err){
			console.log(err);
			return;
		}
		console.log("--- resule: "+ result);
		if(result !== 1){
			res.json({code: 0, desc: "This id is not exist!"});
		}else{
			res.json(result);
		}
	})
	
	// res.redirect("/admin");
});


module.exports = qlAdmin;