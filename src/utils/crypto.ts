// utils/crypto.js
import CryptoJS from 'crypto-js';

// 请确保 SECRET_KEY 与后端使用的密钥一致，并使用 Base64 编码
const SECRET_KEY = '9aCAG+VKLl4aimDFbS7z7Q==';

// 解密方法
export function decryptData(encryptedData) {
  try {
    // 将密钥转为 WordArray
    const key = CryptoJS.enc.Base64.parse(SECRET_KEY);
    const bytes = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,  // 使用 ECB 模式，如果后端使用其他模式，请修改此处
      padding: CryptoJS.pad.Pkcs7  // 填充方式
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('解密错误:', error);
    return null;
  }
}

// 加密方法
export function encryptData(data) {
  try {
    // 将密钥转为 WordArray
    const key = CryptoJS.enc.Base64.parse(SECRET_KEY);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      mode: CryptoJS.mode.ECB,  // 使用 ECB 模式，如果后端使用其他模式，请修改此处
      padding: CryptoJS.pad.Pkcs7  // 填充方式
    });
    return encrypted.toString();
  } catch (error) {
    console.error('加密错误:', error);
    return null;
  }
}


