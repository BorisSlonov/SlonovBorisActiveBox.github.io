// подключаем модули галп
const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

// массив с порядком подключения css файлов
const cssFiles = [
    './src/css/main.scss',
    './src/css/mixin.scss',
    './src/css/media.scss'
]
// массив с порядком подключения js
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

// таск на стили css
function styles(){
    //шаблон поиска файлов
    return gulp.src(cssFiles) //массив в конст выше
    //объединение файлов
    .pipe(concat('style.css'))
    //добавляем префиксы
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    //мининификация
    .pipe(cleanCSS({
        level: 2
    }))
    //Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

//таск на скрипты 
function scripts() {
    return gulp.src(jsFiles)

    .pipe(concat('script.js'))
    .pipe(uglify( {
        toplevel: true
    }))
    //Выходная папка для js
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
    
} 
//clean все в указанной папке
function clean(){
    return del(['build/*']);
}
// просмотр файлов 
function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    // следим за css / js
    gulp.watch('./src/css/**/*.css', styles)
    gulp.watch('./src/css/**/*.scss', styles)
    gulp.watch('./src/js/**/*.js', scripts)
    gulp.watch('./*.html').on('change', browserSync.reload);
}
//вызывает функцию styles
gulp.task('styles', styles);

//вызывает функцию scripts
gulp.task('scripts', scripts);

//очищаем билд 
gulp.task('del', clean);

//changes
gulp.task('watch', watch);

//
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));