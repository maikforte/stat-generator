var gulp = require("gulp");
var inject = require("gulp-inject");
var shell = require("gulp-shell");
var uglify = require("gulp-uglify");

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
