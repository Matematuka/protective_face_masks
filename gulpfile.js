// gulpfile.js
import gulp from "gulp";
import * as sass from "sass"; // сучасний імпорт
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import browserSyncLib from "browser-sync";
import svgSprite from "gulp-svg-sprite";

const { src, dest, watch, series } = gulp;
const sassCompiler = gulpSass(sass);
const browserSync = browserSyncLib.create();

// Шляхи до файлів
const files = {
  scssPath: "src/scss/**/*.scss",
  svgIcons: "src/images/icons/*.svg",
};

// Конфігурація для SVG спрайту
const svgConfig = {
  mode: {
    symbol: {
      dest: ".", // вихідна папка для спрайту
      sprite: "sprite.svg", // ім’я файлу спрайту
    },
  },
};

// Завдання: генерація SVG спрайту
export const svgTask = () => {
  return src(files.svgIcons)
    .pipe(svgSprite(svgConfig))
    .pipe(dest("dist/images/"));
};

// Завдання: SCSS → CSS
export const scssTask = () => {
  return src(files.scssPath)
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(cleanCSS())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
};

// Локальний сервер з live-reload
export const browserSyncServe = (cb) => {
  browserSync.init({
    server: { baseDir: "./" },
    notify: false,
  });
  cb();
};

// Слідкування за змінами
export const watchTask = () => {
  watch("*.html").on("change", browserSync.reload); // оновлення HTML
  watch([files.scssPath], scssTask); // оновлення SCSS
  watch(files.svgIcons, svgTask).on("change", browserSync.reload); // оновлення SVG спрайту
};

// Експорт завдання по замовчуванню
export default series(svgTask, scssTask, browserSyncServe, watchTask);
