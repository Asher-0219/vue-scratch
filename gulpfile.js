var gulp = require('gulp'),
	path = require('path'),
	run = require('run-sequence'),
	connect = require('gulp-connect'),
	mkdirp = require('mkdirp'),
	cheerio = require('gulp-cheerio'),
	clean = require('gulp-clean'),
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector');

var dirs = ['./src/','./dist/','./src/js/','./src/css/','./src/less/','./src/img/']
   ,destination = 'D:/html/'+path.basename(__dirname)
   ,jsfile = ['wScratchPad.min']
   ,cssfile = ['index'];

gulp.task('dir',function(){
	dirs.forEach(dir => {
	    mkdirp.sync(dir);
	});
});

gulp.task('html',function(){
	return gulp.src('src/*.html')
		.pipe(cheerio({
			run:function($){
				$('link').map(function(){
					var href = this.attribs.href
					   ,link = this;
					cssfile.forEach(function(e){
						if(href.indexOf(e)!=-1){
							$(link).remove();
						}
					})
				})
				$('script').map(function(){
					var src = this.attribs.src
					   ,script = this;
					jsfile.forEach(function(e){
						if(src.indexOf(e)!=-1){
							$(script).remove();
						}
					})
				})
				$('script[src="js/index.js"]').attr('src','index.js');
			},
			parserOptions:{
				decodeEntities: false
			}
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('cleanRev',function(){
	return gulp.src('dist/index-*.js')
			   .pipe(clean({force:true}));
})

gulp.task('jsrev',['cleanRev'],function(){
	return gulp.src('dist/index.js')
			   .pipe(rev())
			   .pipe(gulp.dest('dist'))
			   .pipe(rev.manifest())
			   .pipe(gulp.dest('dist/rev/'))
})

gulp.task('replace',function(){
	return gulp.src(['dist/rev/**/*.json','dist/*.html'])
			   .pipe(revCollector({
					replaceReved:true
				}))
			   .pipe(gulp.dest('dist'));
})

gulp.task('cleanJs',function(){
	return gulp.src(['dist/index.js','dist/rev'])
			   .pipe(clean({force:true}));
})

gulp.task('removeImg',function(){
	return gulp.src('src/img/*')
			   .pipe(gulp.dest('dist/img'));
});

gulp.task('distClean',function(){
	gulp.src('dist/*')
		.pipe(clean({force:true}));
});

gulp.task('svnClean',function(){
	return gulp.src(destination)
			   .pipe(clean({force:true}))
})

gulp.task('connect',['watch'],function(){
	connect.server({
		port:8001,
		livereload:true
	});
})

gulp.task('reload',function(){
	gulp.src('src/*')
		.pipe(connect.reload());
})

gulp.task('watch',function(){
	gulp.watch('src/{*.html,css/*.css,js/*.js}',['reload']);
})

gulp.task('end',function(){
	run(['jsrev','html','removeImg'],'replace');
})

gulp.task('removeFile',function(cb){
	return gulp.src('dist/**/*')
			   .pipe(gulp.dest(destination))
})

gulp.task('commit',function(){
	run(['svnClean','cleanJs'],'removeFile');
})