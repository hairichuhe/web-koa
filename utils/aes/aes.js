var crypto = require('crypto');
var bcrypt = require('bcrypt')

var aes = module.exports = {};
var key = "!1E@2Q#3E$D4%6C5^7v8&9f0*r4T^H7J4K%Y#F!1DF";
var model="aes-128-cfb"
if (key.length<16) {
    throw new Error("您的密钥太短！");
}
if (key.length>=32) {
    key=key.slice(0,32);
    model="aes-256-cfb"
}
if (key.length>=24&&key.length<32) {
    key=key.slice(0,24);
    model="aes-192-cfb"
}
if (key.length>=16&&key.length<24) {
    key=key.slice(0,16)
}

   /**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aes.encrypt = function (data) {
    iv = key.slice(0,16);
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv(model, key, iv);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}
/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aes.decrypt = function (data) {
    if (!data) {
        return ""
    }
    iv =key.slice(0,16);
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv(model, key, iv);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
}
/**
 * bcrypt 哈希+盐
 * @param data 待加密内容
 * @returns {string}
 */
aes.hashsalt = async (data)=> {
    var result;
    await bcrypt.hash(data, 10, function(err, hash) {
        if (err){
            throw new Error("获取hash出错！");
        }
        console.log(hash)
        result= hash
    });
    return result
}