'use strict'


var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    cssnano = require('gulp-cssnano'),
    babel = require('gulp-babel'),
    notify = require("gulp-notify"),
    htmlmin = require('gulp-htmlmin'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps')



//Javascript tasks
gulp.task('javascript', () => {
    return gulp.src([
        './Client/src/js/*.js'
        ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('Client/dist/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Javascript build done' }))
})





// Sass tasks
gulp.task('sass', () => {     
    return gulp.src("Client/src/sass/*.s*ss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        style: 'compressed'
    }))
    .pipe(concat('style.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('Client/dist/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Sass build done.' }))
})




// HTML tasks
gulp.task('html', () => {
    return gulp.src('Client/src/*.html')
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('Client/dist/'))
    .pipe(browserSync.reload({stream:true})) 
    .pipe(notify({ message: 'html build done.' }))                          
})


// image tasks
gulp.task('images', () => {
    return gulp.src('Client/src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('Client/dist/img/'))
    .pipe(browserSync.reload({stream:true})) 
    .pipe(notify({ message: 'images build done.' }))   
})





// Node-sync task
gulp.task('nodemon', () => {
    nodemon({
        script: 'Server/server.js',
        ignore: ['./gulpfile.js', './node_modules', './Client']
    })
    .on('restart', () => {
        setTimeout(() =>  {
            browserSync.reload({ stream: false })
        }, 1000)
    })
})

// Browser-sync task
gulp.task('browser-sync', ['nodemon'], () => {
    browserSync.init({
        proxy: "localhost:3000",
        port: 5000,
        notify: true
    })
})




// Watch tasks
gulp.task('watch', () => {
    gulp.watch('Client/src/*.html', ['html'])
    gulp.watch('Client/src/js/*.js', ['javascript'])
    gulp.watch('Client/src/sass/*.s*ss', ['sass'])
    gulp.watch('Client/src/img/*.*', ['images'])

})

// Default task
gulp.task('default', ['browser-sync', 'watch', 'sass', 'javascript', 'html', 'images'])


