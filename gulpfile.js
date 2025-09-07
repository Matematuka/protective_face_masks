import gulp from "gulp";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import browserSyncLib from "browser-sync";
import svgSprite from "gulp-svg-sprite";

const { src, dest, watch, series } = gulp;
const sassCompiler = gulpSass(sass);
const browserSync = browserSyncLib.create();


const files = {
  scssPath: "src/scss/**/*.scss",
  svgIcons: "src/images/icons/*.svg",
};


const svgConfig = {
  mode: {
    symbol: {
      dest: ".", 
      sprite: "sprite.svg", 
    },
  },
};


export const svgTask = () => {
  return src(files.svgIcons)
    .pipe(svgSprite(svgConfig))
    .pipe(dest("dist/images/"));
};


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


export const browserSyncServe = (cb) => {
  browserSync.init({
    server: { baseDir: "./" },
    notify: false,
  });
  cb();
};


export const watchTask = () => {
  watch("*.html").on("change", browserSync.reload); 
  watch([files.scssPath], scssTask); 
  watch(files.svgIcons, svgTask).on("change", browserSync.reload); 
};


export default series(svgTask, scssTask, browserSyncServe, watchTask);
