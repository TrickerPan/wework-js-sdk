# wework-js-sdk

Build a Wework js-sdk package, use for econd development of Wework.
Just modify Wework's official js-sdk to `export default window.wx`.  
Easy to use and develop with ES6.

Install:

```bash
npm install --save wework-js-sdk
yarn add wework-js-sdk
```

Usage:

```JavaScript
import 'wework-js-sdk';

wx.config({
    beta: true,// Must  be written like this, otherwise when you use jsapi to call wx.invoke will have some problems.
    debug: true, // turn on debug mode, call all return value of api, which will be in alert in client's end. To view the incoming parameters, this cane be opened on a pc, the parameter information will be displayed through a log, only to be printed on a pc.
    appId: '', // Required, the corpID of Wework.
    timestamp: , // Required, generate a signed timestamp
    nonceStr: '', // Required, generate a signed nonceStr
    signature: '',// Required, signature. See Appendix 1
    jsApiList: [] // Required, required JA interface list, all JS interface list, see Appendix 2
});
```
