# wework-js-sdk

企业微信 js-sdk 封装, 用于企业微信二次开发.  
仅将官方企业微信 js-sdk 修改为 `export default window.wx;` 方式.  
方便 ES6 `import` 导入, 方便开发.

安装:

```bash
npm install --save wework-js-sdk
yarn add wework-js-sdk
```

使用:

```JavaScript
import 'wework-js-sdk';

wx.config({
    beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，企业微信的corpID
    timestamp: , // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: [] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
});
```
