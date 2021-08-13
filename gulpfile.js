var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var child = require('child_process');
var gutil = require('gulp-util');
var babel = require('gulp-babel');

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

gulp.task('watch', function() {
  gulp.watch('./src/JS/*.js', ['babel']);
});

gulp.task("default", ["babel", "watch"]);
