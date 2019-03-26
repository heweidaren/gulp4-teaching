# gulp4入门指南

注：非gulp.task的形式，以下皆由箭头函数方式填写。

[Gulp](http://gulpjs.com/)是一个工具，可以帮助您完成Web开发的几项任务。它经常用于执行前端任务，例如：

Web服务器

保存文件时自动重新加载浏览器

使用Sass或LESS等预处理器

优化CSS，JavaScript和图像等资源

这是本文的用途,可以帮你使用学习gulp的基础知识

##全局安装gulp-cli
```
  npm install --global gulp-cli
```
进入自己项目根目录 创建package.json文件
```
  npm init
```
安装gulp
```
  npm initall --save-dev gulp
```
![gulp -v确认版本和截图匹配](https://upload-images.jianshu.io/upload_images/13236059-b4c7790e6dd33c34.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


##确定文件夹结构

Gulp足够灵活，可以处理任何文件夹结构。在为项目调整之前，您只需了解内部工作原理。

对于本文，我们将使用通用webapp的结构：
```
 - app/ 
     scss/ 
     images/  
     js/  
     index.html
     index.scss 
  dist/  
  gulpfile.js  
  node_modules/ 
  package.json
  tmp
```
在此结构中，我们将使用该app文件夹进行开发,dist用于包含生产站点的优化文件,.tmp用于浏览器预览开发。

##编写第一个gulp任务

使用Gulp的第一步是require在gulpfile中使用它
```
 gulpfile.js
     const gulp=require('gulp');
```
require语句告诉Node查看node_modules名为的包的文件夹gulp。找到包后，我们将其内容分配给变量gulp

现在可以开始编写gulp任务了 在这里你会学到gulp src() pipe() dest()等api的作用

##编译sass

src下创建index.scss

src/scss下创建home.scss以及globals.scss

home用来写页面所需的样式 globals用来导入home以及未来创建的scss,利用sass带的@import导入
```
 home.scss
     body{
           h1{
                  background: #ccc; 
              } 
          }
```
```
 globals.scss
         @import 'home';
```
index.scss导入globals
```
 index.scss
         @import "scss/globals"
```
![目前src的文件结构](https://upload-images.jianshu.io/upload_images/13236059-63552dc1ae1163a0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

我们可以在一个名为[gulp-sass](https://www.npmjs.com/package/gulp-sass)的插件的帮助下将Sass编译为Gulp中的CSS 。
```
 bash
     npm install gulp-sass --save-dev
```
require从node_modules文件夹中获取gulp-sass,从gulp中导入 src,dest;

src创建流,从文件中读取对象,dest创建src导入的对象写入文件系统中
```
 gulpfile.js 
     const {src,dest}=require('gulp');
     const sass=require('gulp-sass');
```
编写编译sass 
```
 gulpfile.js
 
         const scss = () =>src('src/index.scss')
                                   .pipe(sass())
                                   .pipe(dest('.tmp/'));
         exports.scss = scss;
```
运行gulp scss
```
 bash 
    gulp scss
```
![编译成功 如图所示](https://upload-images.jianshu.io/upload_images/13236059-6b0759a3991fabdc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##编译js  es6 7转es5

src/js下创建文件home.js,和page.js
```
 home.js 
 //随便写句es6
 let x = () => alert('成功');
     x();
```
需要安装gulp-babel 以及babel-preset-env
```
 bash
     npm install gulp-babel --save-dev
     npm install babel-preset-env --save-dev
```
和scss同理 require找到gulp-babel模块
    这里我们了解一下\*和!
    js/*.js代表js下所有后辍名为.js的文件
    匹配所有的js的文件后,如果有某个文件不想src取到,文件前加!
```
gulpfile.js
     const babel=require('gulp-babel'); 
     const js = () =>
          src(['src/js/*.js', '!src/js/page.js'])
           .pipe(babel({ 
            "presets": ['env'] 
              }))
            .pipe(dest('.tmp/js'))
      exports.js = js
```

```
 bash
     gulp js
```
![如图所示home.js编译成功 page.js成功的没有编译](https://upload-images.jianshu.io/upload_images/13236059-4ae36fc4f0913d75.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##图片转移进.tmp临时文件

![img文件结构](https://upload-images.jianshu.io/upload_images/13236059-dc0e320b2923a83e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

同上,只需要src和dest
```
 gulpfile.js
 const images = () =>
   src('src/images/*.+(png| jpg | jpeg | gif | svg)', 'src/images/*/*.+(png| jpg | jpeg | gif | svg)')
   .pipe(dest('.tmp/images')); 
 exports.images = images
```
终端输入gulp images
```
 bash 
     gulp images
```
![如图,转移成功](https://upload-images.jianshu.io/upload_images/13236059-31f87e8c848fd261.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##html动态插入js文件

安装插件gulp-inject
```
 bash
     npm install gulp-inject --save-dev
```
  <!-- inject:js --><!-- endinject -->负责告诉gulp js文件从何处插入

![html代码如图所示](https://upload-images.jianshu.io/upload_images/13236059-9a9ad44134f90beb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

编写gulpfile.js
```
 gulpfile.js 
 const inject = require('gulp-inject'); 
     const html=()=> 
         src('./src/index.html') 
         .pipe(inject(src(['.tmp/js/*.js'], { read: false, }), {
             ignorePath: ['.tmp'], //去除tmp
             addRootSlash: false, //去除/
           }))
         .pipe(dest('.tmp/'))
 exports.html=html;
```
```
 bash 
     gulp html
```
![tmp下html文件如图,成功引入](https://upload-images.jianshu.io/upload_images/13236059-52bc5e5629896b64.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

至此,tmp临时文件搭建完毕

##搭建本地服务器环境

需要插件browser-sync
```
 bash
     npm install borwser-sync --save-dev
```
运行文件根目录为临时文件.tmp
```
 gulpfile.js 
 const browserSync = require('browser-sync').create(); 
     const watchs = () => 
       browserSync.init({
           server: { 
             baseDir: '.tmp' 
           }
         }) 
 exports.watchs = watchs
```
![如图搭建完成](https://upload-images.jianshu.io/upload_images/13236059-e939f4d04b5a09ae.gif?imageMogr2/auto-orient/strip)

##watch监听文件

gulp自带的watch监听功能,每当文件修改,运行某函数
```
 gulpfile.js 
 const { src, dest,watch } = require('gulp'); 
 const watchs = () => { 
         watch('src/js/*.js', js) 
         watch('src/scss/*.scss', scss) 
         watch('src/index.html', html)
         watch(['src/images/*.*','src/images/*/*.*'],images) 
         browserSync.init({ 
             server: { baseDir: '.tmp' } 
             }) 
             }
 exports.watchs = watchs
```
![修改后刷新](https://upload-images.jianshu.io/upload_images/13236059-fcae31584d737c6b.gif?imageMogr2/auto-orient/strip)

f5手动刷新很麻烦,更改之前的scss,js等函数,利用browser-sync实现更改自动刷新
```
 gulpfile.js 
 let scss = () => 
     src('./src/index.scss') 
     .pipe(sass()) 
     .pipe(dest('./.tmp/')) 
     .pipe(browserSync.reload({
      stream: true 
     })); 
 const images = () => 
     src(['src/images/*.+(png| jpg | jpeg | gif | svg)', 'src/images/*/*.+(png| jpg | jpeg | gif | svg)']) 
     .pipe(dest('.tmp/images'));         
     .pipe(browserSync.reload({ 
      stream: true }) 
            ) 
 const html = () => 
     src('./src/index.html') 
     .pipe(inject(src(['.tmp/js/*.js'], { read: false, }),{ 
     ignorePath: ['.tmp'],        //去除tmp 
     addRootSlash: false        / /去除/ 
     })) 
     .pipe(dest('.tmp/')) 
     .pipe(browserSync.reload({ 
     stream: true 
     }))
```
运行之前的wathcs函数
```
 bash 
     gulp watchs
```
更改app下的文件,你会发现浏览器已经成功自动刷新了

推荐把众多函数expots成一句
    series()顺序执行
    parallel()并发运行
```
 gulpfile.js 
         const { src, dest, watch, series,parallel } = require('gulp'); 
         exports.serve = series(parallel(js, scss, images), html, watchs);
```
```
 bash 
     gulp serve
```
至此,本教程已经完成了一半,一个单页面项目的基本构建完成

##打包压缩发布

    线上项目为了提高访问速度,我们需要压缩以及合并文件
    安装gulp-cssnano        gulp-imagemin           gulp-concat         gulp-uglify

```
 bash 
     npm install gulp-cssnano  --save-dev 
     npm install gulp-imagemin  --save-dev 
     npm install  gulp-concat   --save-dev 
     npm install  gulp-uglify --save-dev
```
```
 gulpfile.js 
 const cssnano = require('gulp-cssnano') //压缩css 
 const imagemin = require('gulp-imagemin'); //图片压缩
 const concat = require('gulp-concat') //合并js 
 const uglify = require('gulp-uglify') //压缩js
 
 const baleJs = () => 
   src('src/js/*.js') 
   .pipe(concat('index.js')) 
   .pipe(babel({
    "presets": ["env"] 
   })) 
   .pipe(uglify())//压缩js 
   .pipe(dest('dist/')) 
 const baleScss = () => 
   src('./src/index.scss') 
   .pipe(sass()) 
   .pipe(cssnano())//压缩css 
   .pipe(dest('./dist/'))
 const baleImages = () => 
   src(['src/images/*', 'src/images/*/*']) 
   .pipe(imagemin())//压缩图片 
   .pipe(dest('dist/images')) 
 const baleHtml = () => 
   src('src/index.html') 
   .pipe(inject(src(['dist/index.js']), { 
    ignorePath: ['dist'], //去除dist 
    addRootSlash: false, //去除/ 
   })) 
   .pipe(dest('dist/'))
```
打包之前要删除原先的dist文件 安装npm的del
```
 bash 
    npm install del --save-dev
```
```
 gulpfile.js 
    const del=requirt('del'); 
    const naleDelete=()=>del(['dist'])
```
将打包逻辑组合
```
 gulpfile.js 
    exports.bale = series(naleDelete, parallel(baleJs, baleScss, baleImages), baleHtml)
```
```
 bash 
    gulp bale
```
![打包成功](https://upload-images.jianshu.io/upload_images/13236059-09357fbb0c7feae5.gif?imageMogr2/auto-orient/strip)


