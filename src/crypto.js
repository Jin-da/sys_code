var CryptoJS = require("crypto-js");
var secretKey = 'Mx1Pa019.';
export default {
    // json加密
    cryptoEncrypt_json(data) {
        var cipherJson = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        return cipherJson
    },
    // json解密
    cryptoDecrypt_json(data) {
        var bytes  = CryptoJS.AES.decrypt(data, secretKey);
        var decryptedJson = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedJson
    },
    // 字符串加密
    cryptoEncrypt_string(data) {
        var ciphertext = CryptoJS.AES.encrypt(data, secretKey).toString();
        return ciphertext
    },
    // 字符串解密
    cryptoDecrypt_string(data) {
        var bytes  = CryptoJS.AES.decrypt(data, secretKey);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText
    },
}