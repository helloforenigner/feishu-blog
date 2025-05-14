import CryptoJS from "crypto-js";
//AES加密
/**
 * 加密方法
 * @param {*} word 需要加密的字符串
 * @param {*} keyStr  加密的key值
 * */
const SECRET_KEY = '1234567890123456'
const AES_encrypt = (word, keyStr) => {
    return CryptoJS.AES.encrypt(word, SECRET_KEY).toString()
}

//AES解密
/**
 * 解密方法
 * @param {*} word 需要解密的字符串
 * @param {*} keyStr  解密的key值
 * */
const AES_decrypt = (word, keyStr) => {
    return CryptoJS.AES.decrypt(word, SECRET_KEY).toString(CryptoJS.enc.Utf8)
}

export { AES_encrypt, AES_decrypt }