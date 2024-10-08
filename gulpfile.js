const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

/**
 * paths to your source file
 */
const paths = {
    js: 'src/javascript-notifications.js',
    css: 'src/javascript-confirm.css',
    dest: 'dist'
};

/**
 * Task to minify JS and save to two locations
 */
function minifyJs() {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest))
        // .pipe(gulp.dest('docs/dist'));
}



/**
 * task to minify css
 */
function minifyCss() {
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest))
        // .pipe(gulp.dest('docs/dist'));
}

/**
 * watch file changes
 */
function watchFiles() {
    gulp.watch(paths.js, minifyJs);
    gulp.watch(paths.css, minifyCss);
}

/**
 * delete dist directory during clean
 */
// function clean() {
//     return del([paths.dest]);
// }

/**
 * Default task to run both JS and CSS minification
 */
// exports.default = gulp.series(clean, gulp.parallel(minifyJs, minifyCss));
exports.default = gulp.series(minifyJs, minifyCss);

/**
 * watch task
 */
exports.watch = watchFiles;