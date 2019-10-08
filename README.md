# vue-demo

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

# 关于移动端使用position:fixed问题
由于移动端webview的限制，在使用fixed定位时会出现意想不到的bug，若一定要用fixed，尽量将组建放在靠近最外层的地方！！！
# 关于iphone X 系列UI适配问题
如：(https://aotu.io/notes/2017/11/27/iphonex/index.html可供参考)
1.height: 60px;
  height: calc(60px + constant(safe-area-inset-bottom));
  height: calc(60px + env(safe-area-inset-bottom));
2.padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).....