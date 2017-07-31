var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var flash = require("connect-flash");
var session = require("express-session");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var Handlebars = require('handlebars');

var router = require("./router/router");
var admin = require("./router/admin");
var qlAdmin = require("./router/qlAdmin");


//set static folder
app.use(express.static(path.join(__dirname, "public")));

//view engine
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({
  defaultLayout: "layout",
  helpers:{
    compare: function(v1, op, v2, options) {

      var c = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
      }

      if( Object.prototype.hasOwnProperty.call( c, op ) ) {
        return c[op].call( this, v1, v2 ) ? options.fn( this ) : options.inverse( this );
      }
      return options.inverse( this );
      
    },
    options: function(value, label, selectedValue) {
      // console.log("-- value: "+ value+" -- selectedValue: "+ selectedValue +" --isSame: "+ (value == selectedValue));
      // if(value === selectedValue){
      //   console.log("-----------------------------");
      // }
      var selectedProperty = value === selectedValue ? 'selected="selected"' : '';
      // console.log(typeof selectedValue);
      if(typeof selectedValue === "object"){
        return new Handlebars.SafeString('<option value="' + value + '">' + label + "</option>");
      }else{
        return new Handlebars.SafeString('<option value="' + value + '" ' +  selectedProperty + '>' + label + "</option>");
      }
    }
  }}));

app.set("view engine", "handlebars");


//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


//express session
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false
}));



//passport init
app.use(passport.initialize());
app.use(passport.session());




//express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect flash
app.use(flash());

//global vars
app.use(function(req, res, next){
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use("/", admin);
app.use(qlAdmin);

//set port
app.set("port", (process.env.PORT || 8080));
app.listen(app.get("port"), function(){
	console.log("Server started on port "+app.get("port"));
});



