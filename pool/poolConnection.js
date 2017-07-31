var express = require("express");
var mysql = require("mysql");
var app = express();
var fs = require('fs'),
path = require('path'),    
filePath = path.join("./config", 'db.conf');
var util = require("../util/Util");

var connectionLimitStr, hostStr, userStr, passwordStr, databaseStr, debugStr;
var arrPool;

var dataPool = fs.readFileSync(filePath, {encoding: 'utf-8'});
var arr = dataPool.split("\n");
//console.log("----- ar: "+arr);
for(var i = 0; i< arr.length; i++){
	if(arr[i].startsWith("#")){
		continue;
	}else{
		console.log("----- arr["+i+"]: "+arr[i]);
		if(arr[i].startsWith("connectParams")){
			var arrPoolStr = arr[i].split(":")[1];
			console.log("---arrPoolStr: "+arrPoolStr);
			arrPool = arrPoolStr.split(",");
			hostStr = arrPool[0];
			console.log("---hostStr: "+arrPool[0]);
			userStr = arrPool[1];
			console.log("---userStr: "+arrPool[1]);
			passwordStr = arrPool[2];
			console.log("---passwordStr: "+arrPool[2]);
			databaseStr = arrPool[3];
			console.log("---databaseStr: "+arrPool[3]);
		}else{
			console.log("Connection string does not exist");
		}
	}
}	


//create for basic connection
/*var connection = mysql.createConnection({
	host: 		hostStr,
	user: 		userStr,
	password:	passwordStr,
	database: 	databaseStr
});

//console.log("---- pool: "+connection);

connection.connect(function(err) {
	if (err){
		console.log("---- not connected");
		console.log(err);
	}else{
		console.log("---- connected");
	}
});*/


//create for pool connection
var pool = mysql.createPool({
	connectionLimit: 10,
	host: 		hostStr,
	user: 		userStr,
	password:	passwordStr,
	database: 	databaseStr
});

pool.getConnection(function(err, connection) {
	if(err){
		console.log("not connected");
	}else{
		console.log("connected");
	}
});

pool.on('release', function (connection) {
	// console.log('Connection %d released', connection.threadId);
});

function caseOriginalToObject(objectModelOriginal, objectModel){
	Object.getOwnPropertyNames(objectModelOriginal).forEach(
		function(val, index, arr){
			objectModel[val] = objectModelOriginal[val];
		});
	return objectModel;
}

function caseObjectToOriginal(objectModelOriginal, objectModel){
	Object.getOwnPropertyNames(objectModel).forEach(
		function(val, index, arr){
			objectModelOriginal[val] = objectModel[val];
		});
	return objectModelOriginal;
}


function caseObject(objectModel, results){
	var objJson = JSON.parse(results);
	var objectModelOriginal = objectModel;

	objectModelOriginal = caseObjectToOriginal(objectModelOriginal, objectModel);

	var lstObject = [];

	for(var i = 0; i < objJson.length; i++){

		// console.log("||||||||||||||||||||||||||||||||||||||||");
		// console.log("|----------------- objJson["+i+"]: -----------------|");
		// console.log(objJson[i]);
		// console.log("||||||||||||||||||||||||||||||||||||||||");
		// console.log("||||||||||||||||||||||||||||||||||||||||");

		objectModel = {};
		// console.log("=====================================================");
		// console.log("objectModel: ");
		// console.log(objectModel);
		// console.log("=====================================================");
		Object.getOwnPropertyNames(objectModelOriginal).forEach(
			function(val, index, arr){
				//console.log("----------------> "+val +": "+ index);
				// console.log("----------------> "+val+": " + objJson[i][val]);
				//console.log("----------------> Type of "+val+": " + util.getTypeName(objectModel[val]));
				if(util.getTypeName(objectModel[val]) !== 'AnonymousFunction'){
					//console.log("-----> not AnonymousFunction: " + objectModel[val]);
					objectModel[val] = objJson[i][val];
				}else{
					//console.log("-----> AnonymousFunction: " + objectModel[val]);
				}
				//propertiesString += ""+val+": "+objJson[i][val]+",";
			});
		lstObject.push(objectModel);

		// console.log("|---------------------------------------------------|");
		// console.log(objectModel);
		// console.log("|---------------------------------------------------|");
		// lstObject123.forEach(function(objectModel, i){
		// 	lstObject123[i] = objectModel;
		// });

		// console.log("|---------------------------------------------------|");
		// console.log("lstObject["+i+"]: ");
		// console.log(lstObject[i]);
		// console.log("|---------------------------------------------------|");
		
		// console.log("|||||---------------------------------------------------|||||");
		// console.log(objectModel);
		// console.log("|||||---------------------------------------------------||||||");
	}
	
	// console.log("|---------------------------------------------------|");
	// console.log(lstObject[0]);
	// console.log(lstObject[1]);
	// console.log("|---------------------------------------------------|");
	
	return lstObject;
}

module.exports.execSelect = function(sql, post, obj, doneFn){
	var result;
	//sql: is sql query
	//post: array of params in sql condition.
	pool.getConnection(function(err, connection) {
		connection.query(sql, post, function(err, results){
			try{
				if(err){
					console.log(err);
					result = {code: 0, desc: "Error when execute sql"};
					//resultStr = JSON.stringify(resultObject);
					// console.log("--- resultStr: "+resultStr);
					return result;
				}else{
					var resultStr = JSON.stringify(results);
					//console.log(resultStr);
					newObj = caseObject(obj, resultStr);
					//console.log("--- new obj: "+ newObj.id);
					result = newObj;
					//console.log("--- new obj: "+ newObj[0].id);
					//console.log("--- resultStr: "+resultStr);
					//res.json(results);
					doneFn(err, result);
					return result;
				}
			}catch(err){
				console.log(err);
			}finally{
				connection.release();
			}
		});
	});
}

module.exports.execInsert = function(sql, post, obj, doneFn){
	var result;
	//sql: is sql query
	//post: array of params in sql condition.
	pool.getConnection(function(err, connection) {
		connection.query(sql, post, function(err, results){
			try{
				if(err){
					console.log(err);
					result = {code: 0, desc: "Error when execute sql"};
					//resultStr = JSON.stringify(resultObject);
					// console.log("--- resultStr: "+resultStr);
					return result;
				}else{
					console.log("results.insertId: "+results.insertId);
					// if(results.insertId !== 'undefined' || results.insertId)
					result = results.insertId;
					doneFn(err, result);
					return result;
				}
			}catch(err){
				console.log(err);
			}finally{
				connection.release();
			}
		});
	});
}

module.exports.execUpdateDelete = function(sql, post, choose, doneFn){
	var result;
	//sql: is sql query
	//post: array of params in sql condition.
	//choose: 1-update, 2-delete
	
	//console.log("--- sql lowercase: "+sql.toLowerCase());
	//console.log("--- sql lowercase indexOf: "+sql.toLowerCase().indexOf("update"));
	//console.log(sql.toLowerCase());
	pool.getConnection(function(err, connection) {
		if((choose == 1 && sql.toLowerCase().indexOf("update") !== -1)
			|| (choose == 2 && sql.toLowerCase().indexOf("delete") !== -1)){
			connection.query(sql, post, function(err, results){
				try{
					if(err){
						console.log(err);
						result = {code: 0, desc: "Error when execute sql"};
						//resultStr = JSON.stringify(resultObject);
						// console.log("--- resultStr: "+resultStr);
						return result;
					}else{
						if(choose == 2){
							result = {code: 1, desc: "Delete complete!"};
							// console.log('deleted ' + results.affectedRows + ' rows');
						}else if(choose == 1){
							result = {code: 1, desc: "Update complete!"};
							// console.log('update ' + results.affectedRows + ' rows');
						}
						result = results.affectedRows;
						doneFn(err, result);
					}
				}catch(err){
					console.log(err);
				}finally{
					connection.release();
				}
			});
	}else{
		doneFn("Choose code and sql query not match!");
	}
});
}

module.exports.pool = pool;