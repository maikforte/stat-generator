var gulp = require("gulp");
var inject = require("gulp-inject");
var shell = require("gulp-shell");
var uglify = require("gulp-uglify");
var git = require('gulp-git');

gulp.task("default", function () {
    var target = gulp.src("./src/views/index.html");
    var sources = gulp.src(["./assets/js/*.js",
            "./node_modules/angular/*min.js",
			"./node_modules/angular-*/*min.js",
			"./node_modules/angular-*/release/angular-*min.js",
			"./node_modules/angular-*/*min.css", "./asset/css/*.css",
			"./src/app/*module.js", "./src/app/*.js",
			"./src/app/**/*module.js", "./src/app/**/*.js", ], {
        read: false
    });
    return target.pipe(inject(sources)).pipe(gulp.dest("./src/views/")).pipe(
        shell("npm start"));
});

gulp.task("inject", function () {
    var target = gulp.src("./src/views/index.html");
    var sources = gulp.src(["./assets/js/*.js",
            "./node_modules/angular/*min.js",
			"./node_modules/angular-*/*min.js",
			"./node_modules/angular-*/release/angular-*min.js",
			"./node_modules/angular-*/*min.css", "./asset/css/*.css",
			"./src/app/*module.js", "./src/app/*.js",
			"./src/app/**/*module.js", "./src/app/**/*.js", ], {
        read: false
    });
    return target.pipe(inject(sources)).pipe(gulp.dest("./src/views/"));
});

gulp.task("deploy", function () {
    return gulp.src('./').pipe(git.add()).pipe(git.commit('ALPHA v1.0.0')).pipe(git.push('origin', function (err) {
        if (err) throw err;
    }));
});
