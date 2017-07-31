
var crypto = require('crypto');

var getObjectClass = function (obj) {
    if (obj && obj.constructor && obj.constructor.toString()) {

        /*
        *  for browsers which have name property in the constructor
        *  of the object,such as chrome 
        */
        if(obj.constructor.name) {
            return obj.constructor.name;
        }
        var str = obj.constructor.toString();
        /*
        * executed if the return of object.constructor.toString() is 
        * "[object objectClass]"
        */

        if(str.charAt(0) == '['){
            var arr = str.match(/\[\w+\s*(\w+)\]/);
        } else {
            /*
            * executed if the return of object.constructor.toString() is 
            * "function objectClass () {}"
            * for IE Firefox
            */
            var arr = str.match(/function\s*(\w+)/);
        }
        if (arr && arr.length == 2) {
            return arr[1];
        }
        }
    return undefined; 
};

function getTypeName(object){
  const objectToString = Object.prototype.toString.call(object).slice(8, -1);
  if (objectToString === "Function"){
    const instanceToString = object.toString();
    if (instanceToString.indexOf(" => ") != -1)
      return "ArrowFunction";
    const getFunctionName = /^function ([^(]+)\(/;
    const match = instanceToString.match(getFunctionName);
    if (match === null)
      return "AnonymousFunction";
    return "Function";
  }
  // Built-in types (e.g. String) or class instances
  return objectToString;
};

function hash(data){
    return crypto.createHash('md5').update(data).digest("hex");
}

module.exports.hash = hash;
module.exports.getTypeName = getTypeName;
module.exports.getObjectClass = getObjectClass;