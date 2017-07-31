var express = require("express");
var app = express();
var admin = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../entity/User");
var flash = require('connect-flash');


//home
admin.get("/",function(req, res){
	// console.log("---- userLogined: "+res.locals.user);
	if(req.isUnauthenticated()){
		res.redirect("/login");
		// res.render("login",{layout: "../login.handlebars"});
	}else{
		// console.log("---- userLoginedId: "+res.locals.user.id);
		// res.redirect("/");
		res.render("index");
	}
		// res.render("index");
});


// login
admin.get("/login",function(req, res){
	// if(req.isAuthenticated()){
	// 	console.log("---- logined");
	// }else{
	// 	console.log("---- logouted");
	// }
	if(req.isUnauthenticated()){
		res.render('login',  {layout: "../login.handlebars", message: req.flash('loginMessage') });
	}else{
		res.redirect("/");
		// res.render("index");
	}
	// res.render("login",{layout: "../login.handlebars"});
});

// admin.get('/login', function(req, res) {
//   res.render('login',  {layout: "../login.handlebars", message: req.flash('signupMessage') });
// });

passport.use(new LocalStrategy({
	    // by default, local strategy uses username and password, we will override with email
	    usernameField : 'username',
	    passwordField : 'password',
	    passReqToCallback : true // allows us to pass back the entire request to the callback
	}, 
	function(req,username, password, done){
		console.log("--- username: "+ username);
		console.log("--- password: "+ password);
		User.login(username, password, function(err, user){
			if(err){ 
				console.log(err);
				return done(null, err);
			}
			if(!user){
				console.log("---112231");
				// return done(null, false, {message: "Unknown user!"});
				return done(null, false, req.flash('loginMessage', 'This user is not exist!.'));
			}

			return done(null, user);
			
		});
	})
);

passport.serializeUser(function(user, done) {
	// console.log("-- user--: "+ user)
		//console.log("------------ role1: "+user.role);
		//console.log("------------ id: "+user.id);;
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	//console.log("-- id--: "+ id);
	User.getUserById(id, function(err, user) {
		if(err){
			console.log(err);
			return done(null,err);
		}
		//console.log("------------ role: "+user.role);
		done(err, user);
	});
});

admin.post("/login",passport.authenticate("local", {successRedirect: "/", failureRedirect: "/login", failureFlash: true }),
	function(req, res){
		res.redirect("/");
	}
);

//logout
admin.get("/logout",function(req, res){
	console.log("logging out ......");
	req.logout();
	req.session.destroy(function (err) {
	    if (err) { return next(err); }
			// res.redirect("/");
	    // The response should indicate that the user is no longer authenticated.
	    // return res.render("login",{ 
	    // 	url: "/login",
	    // 	layout: "../login.handlebars",
	    // 	authenticated: req.isAuthenticated() });
	    // res.redirect("/");
	    // res.render('/login', {authenticated: req.isAuthenticated()});
	    console.log(req.isAuthenticated());
	    res.redirect("/");
	    
	    return;
	  });
	// res.redirect("/");
});

// admin.post("/login",passport.authenticate("local", {successRedirect: "/", failureRedirect: "/login", failureFlash: true },
// 	function(req, res){
// 		res.redirect("/");
// 		// var username = req.body.username;
// 		// var password = req.body.password;

// 		// req.checkBody("username", "User name is required!").notEmpty();
// 		// req.checkBody("password", "Password is required!").notEmpty();
// 		// //console.log("-- username: "+ username + " -- pass: "+ password);

// 		// var a = req.getValidationResult().then(function(result) {
// 		// 	if (!result.isEmpty()) {
// 		// 		var err = result.array();
// 		// 		var errArr = [];
// 		// 		for(var i=0;i<err.length;i++){
// 		// 			errArr.push(err[i].msg);
// 		// 		}
// 		// 		// console.log(errArr);
// 		// 		// console.log(err[0].msg);
// 		// 		res.render("login",{
// 		// 			layout: "../login.handlebars",
// 		// 			errors: errArr
// 		// 		});
// 		// 		return;
// 		// 	}else{
// 		// 		console.log("Success");
// 		// 		User.login(username, password, function(err, user){
// 		// 			//console.log("--- user id: "+ user.id);
// 		// 			// var admin = user[0];
// 		// 			// console.log("--- admin: "+ admin.id);
// 		// 			if(typeof user === "undefined"){
// 		// 				console.log("-------------------------------");
// 		// 				var errArr = [];
// 		// 				errArr.push("This user is not exist!");
// 		// 				res.render("login",{
// 		// 					layout: "../login.handlebars",
// 		// 					errors: errArr
// 		// 				});
// 		// 			}else{
// 		// 				//console.log(admin);
// 		// 				console.log("++++++++++++++++++++++++++");
// 		// 				//var adminUser = user[0];
// 		// 				//console.log("--- admin: "+user.id);
// 		// 				//req.session.user = admin;
// 		// 				res.render("index",{
// 		// 					errors: user
// 		// 				});
// 		// 				// res.redirect("/");
// 		// 			}
// 		// 		});
// 		// 	}
// 		// });
// 	})
// );



module.exports = admin;