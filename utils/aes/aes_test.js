var aes=require("./aes");
var str="{id:6693,ip:127.0.0.1,over:1694907662}"
console.log(aes.encrypt(str))
console.log(aes.decrypt(aes.encrypt(str)))
var hash=aes.hashsalt("!@#EDCvfr4")
console.log(hash)