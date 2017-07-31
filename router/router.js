var app = require("express");
var router = app.Router();

//index
router.get("/",function(req, res){
	res.render("index");
});



module.exports = router;