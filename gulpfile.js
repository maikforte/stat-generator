var gulp = require("gulp");
var inject = require("gulp-inject");
var shell = require("gulp-shell");
var uglify = require("gulp-uglify");
var git = require('gulp-git');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

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
    return gulp.src('./*').pipe(git.add()).pipe(git.commit('ALPHA v1.0.0')).pipe(git.push('origin', function (err) {
        if (err) throw err;
    }));
});

gulp.task("obfuscate", function () {
    var appPromise = new Promise(function (resolve, reject) {
        resolve(gulp.src("src/app/*.js")
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest("build/app/")));
    });

    var footerPromise = new Promise(function (resolve, reject) {
        resolve(gulp.src("src/app/*.js")
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest("build/app/")));
    });

    return appPromise.then(function (success) {
        gulp.src("src/app/stat-generator/*.js")
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest("build/app/stat-generator"));
        return footerPromise;
    }).then(function (success) {
        gulp.src("src/app/footer/*.js")
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest("build/app/footer"));
        return footerPromise;
    });
});

gulp.task("start", function () {
    var appPromise = new Promise(function (resolve, reject) {
        resolve(gulp.src("src/app/*.js")
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest("build/app/")));
    });

    return appPromise.then(function (success) {
        gulp.src("src/app/stat-generator/*.js")
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest("build/app/stat-generator"));
        return footerPromise;
    }).then(function (success) {
        gulp.src("src/app/footer/*.js")
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(gulp.dest("build/app/footer"))
            .pipe(shell("npm start"));
        return footerPromise;
    });
});
