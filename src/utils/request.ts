import Taro from '@tarojs/taro';

const TIME_OUT = 300000;
// const BASE_URL = 'http://192.168.1.105:8080';//主机有线
// const BASE_URL = 'http://192.168.1.107:8080';//主机无线
const BASE_URL = 'http://127.0.0.1:8080';//本地通用
// const BASE_URL = 'http://150.138.73.70:37229';//服务器通用
// const BASE_URL = 'http://192.168.0.112:8080';//华硕笔记本无线
// const BASE_URL = 'http://192.168.31.228:8080';//本地通用

const request = (options) => {
  // 判断是不是完整的地址，不是的话，拼接上baseUrl
  let urlPath = '';
  if (options.url.indexOf('http') === -1) {
    urlPath = BASE_URL + options.url;
  } else {
    urlPath = options.url;
  }
  console.log('请求的url是:', urlPath);
  return new Promise((resolve, reject) => {
    Taro.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      timeout: TIME_OUT,
      data: options.data || {},
      header: options.header || {},  // 确保 header 被正确传递
      success(res) {
        // 可以根据自己的数据状态处理响应
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      },
    });
  });
};

export default request;
