var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));
var minify = require('gulp-minify');
var babel = require('gulp-babel');
var pug = require('gulp-pug');
var webserver = require('gulp-webserver');

gulp.task('babel', function(done) {
  return gulp.src(['./src/JS/*.js'])
    .pipe(babel({
        presets: [['minify', {
          builtIns: false,
        }]]
    }))
    .on('error', console.error.bind(console))
    .pipe(gulp.dest('./dist/JS/'));
});

gulp.task('views', function buildHTML() {
  return gulp.src('src/views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('.'));
});

gulp.task('sass', function () {
  return gulp.src('src/SCSS/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/CSS'));
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('watch', function() {
  gulp.watch('./src/SCSS/*.scss', gulp.series('sass'));
  gulp.watch('./src/views/*.pug', gulp.series('views'));
  gulp.watch('./src/JS/*.js', gulp.series('babel'));
});

gulp.task('default', gulp.series('babel', 'views', 'sass', gulp.parallel('watch', 'webserver')));
