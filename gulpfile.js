const { src, dest, watch, series,parallel } = require('gulp');
const sass = require('gulp-sass'); //编译sass
const babel = require('gulp-babel'); //编译成es5
const inject = require('gulp-inject'); //动态插入js
const browserSync = require('browser-sync').create(); //静态服务器

const cssnano = require('gulp-cssnano') //压缩css
const imagemin = require('gulp-imagemin'); //图片压缩
const concat = require('gulp-concat') //合并js
const uglify = require('gulp-uglify') //压缩js
const del = require('del');//删除文件

//--serve-->
const scss = () =>
  src('src/index.scss')
  .pipe(sass())
  .pipe(dest('.tmp'))
  .pipe(browserSync.reload({
    stream: true
  }))

const js = () =>
  src(['src/js/*.js', '!src/js/page.js'])
  .pipe(babel({
    "presets": ['env']
  }))
  .pipe(dest('.tmp/js'))
  .pipe(browserSync.reload({
    stream: true
  }))

const images = () =>
  src(['src/images/*.+(png| jpg | jpeg | gif | svg)', 'src/images/*/*.+(png| jpg | jpeg | gif | svg)'])
  .pipe(dest('.tmp/images'))
  .pipe(browserSync.reload({
    stream: true
  }));

const html = () =>
  src('./src/index.html')
  .pipe(inject(src(['.tmp/js/*.js'], { read: false, }), {
    ignorePath: ['.tmp'], //去除tmp
    addRootSlash: false, //去除/
  }))
  .pipe(dest('.tmp/'))
  .pipe(browserSync.reload({
    stream: true
  }));

const watchs = () => {
  watch('src/js/*.js', js)
  watch('src/scss/*.scss', scss)
  watch('src/index.html', html)
  browserSync.init({
    server: {
      baseDir: '.tmp'
    }
  })
}
//--end-->

//--bale-->
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
const naleDelete=()=>del(['dist'])
//--end-->

exports.serve = series(parallel(js, scss, images), html, watchs);
exports.bale = series(naleDelete, parallel(baleJs, baleScss, baleImages), baleHtml)
