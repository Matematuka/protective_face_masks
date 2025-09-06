// gulpfile.js
import gulp from "gulp";
import * as sass from "sass"; // правильний сучасний імпорт
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import browserSyncLib from "browser-sync";

const { src, dest, watch, series } = gulp;
const sassCompiler = gulpSass(sass); // створюємо компілятор SCSS
const browserSync = browserSyncLib.create();

const files = {
  scssPath: "src/scss/**/*.scss", // шлях до SCSS файлів
};

// Завдання: SCSS → CSS
function scssTask() {
  return src(files.scssPath)
    .pipe(sassCompiler().on("error", sassCompiler.logError)) // компілюємо SCSS
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    ) // додаємо префікси
    .pipe(cleanCSS()) // мінімізуємо CSS
    .pipe(dest("dist/css")) // зберігаємо в dist/css
    .pipe(browserSync.stream()); // оновлюємо браузер
}

// Локальний сервер з live-reload
function browserSyncServe(cb) {
  browserSync.init({
    server: { baseDir: "./" },
    notify: false,
  });
  cb();
}

// Слідкування за змінами
function watchTask() {
  watch("*.html").on("change", browserSync.reload); // оновлення HTML
  watch([files.scssPath], scssTask); // оновлення SCSS
}

// Експортуємо завдання
export default series(scssTask, browserSyncServe, watchTask);
