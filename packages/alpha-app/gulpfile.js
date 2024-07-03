const gulp = require("gulp");
const watch = require("gulp-watch");
const browserSync = require("browser-sync").create();

// Watch HTML, CSS, JS files
gulp.task("watch", () => {
  browserSync.init({
    proxy: "http://localhost:3000",
  });

  watch("src/views/*.njk", () => {
    browserSync.reload();
  });

  watch("src/views/*.js", () => {
    browserSync.reload();
  });

  watch("src/views/*.html", () => {
    browserSync.reload();
  });

  watch("public/*.css", () => {
    browserSync.reload();
  });

  watch("public/*.scss", () => {
    browserSync.reload();
  });
});
