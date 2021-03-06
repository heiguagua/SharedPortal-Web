# 共享门户

![](sources/assets/favicon.ico)

## Domain Object
* login`login`
* layout`layout`
  * dashboard`dashboard`
  * demo`demo`

## Installation and deployment
1. git clone https://github.com/heiguagua/aves.git
2. cd flamingo
3. npm i
4. gulp
5. Open browser http://localhost:5001/index.html

## Thirdparty Library
* [Vue 2.3.x](https://vuejs.org/)
* [Webpack 2.6.x](https://webpack.js.org/)
* [NodeJS 6.11.x](https://nodejs.org/)
* [Element-UI 1.3.x](element.eleme.io/)

## Transfer Protocol

> head
* status: (Integer)，Server-side status
  1. 200：Http response success.
  2. 201：Warning infomation.
  3. 202：Login timeout.
  4. 400: Bad request.
  5. 404: No page found.
  6. 405: Request method is not support.
  7. 415: Unsupported media type.
  8. 500：Server-side exceptions.
* token: (String)，Encryption key。
* message: (String)，Server-side infomation for current http request.
* total: (Integer)，Sum of business logic result (if the results as the object then total equals 1, as an array equals length of the array).

> body
* (Object/Array)，Realistic & available datas.

```javascript
  {
    head: {
      status: 200,
      token: "ghco9xdnaco31gmafukxchph",
      message: "Login Success!",
      total: 1
    },
    body: {
      username: "admin",
      password: "admin"
    }
  }
```

## Project Release

1. Update penguin/sources/partials/common/http.js

> Update base url for global ajax connection

2. gulp clean

> remove all of thing within the build & release folder

3. gulp build

> compile source code

4. gulp release --tar/zip

> compress build folder to the release
