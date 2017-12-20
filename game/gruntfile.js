module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks("grunt-aws");
	grunt.loadNpmTasks('grunt-gitinfo');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		aws: grunt.file.readJSON("../aws-credentials.json"),
		gitinfo: {
			options: {
				cwd: "../"
			}
		},
		connect: {
			server: {
				options: {
					port: 8080,
					base: './dist'
				}
			}
		},
		clean: {
			pre: ['./dist'],
			post: ['./.tscache', './src/bin', './*.tmp.txt']
		},
		copy: {
			options: {
				processContentExclude: ['**/*.{png,gif,jpg,ico,psd,ttf,otf,woff,svg}']
			},
			main: {
				options: {
					process: function (content, srcpath) {
						return grunt.template.process(content);
					}
				},
				files: [
					{
						src: './src/Game/CircleChase/index.html.ejs',
						dest: './dist/circlechase/index.html',
					},
					{
						src: './src/Game/CircleChase2/index.html.ejs',
						dest: './dist/circlechase2/index.html',
					},
					{
						src: './src/Game/CircleChase3/index.html.ejs',
						dest: './dist/circlechase3/index.html',
					},
					{
						cwd: './src/Game/CircleChase/asset/',
						dest: './dist/circlechase/asset',
						src: '**',
						expand: true
					},
					{
						cwd: './src/Game/CircleChase2/asset/',
						dest: './dist/circlechase2/asset',
						src: '**',
						expand: true
					},
					{
						cwd: './src/Game/CircleChase3/asset/',
						dest: './dist/circlechase3/asset',
						src: '**',
						expand: true
					},
					{
						expand: true,
						src: [
							'./src/bin/game.js',
							'./node_modules/fpsmeter/dist/fpsmeter.js',
							'./node_modules/requirejs/require.js'
						],
						dest: './dist',
						flatten: true
					}
				]
			}
		},
		ts: {
			default: {
				tsconfig: true
			}
		},
		open: {
			dev: {
				path: 'http://localhost:8080/circlechase/index.html'
			}
		},
		watch: {
			scripts: {
				files: ['./src/**/*.ts', './src/**/*.html.ejs'],
				tasks: ['build'],
			}
		},
		bump: {
			options: {
				commit: false,
				push: false,
				createTag: false
			}
		},
		s3: {
			options: {
				accessKeyId: "<%= aws.accessKeyId %>",
				secretAccessKey: "<%= aws.secretAccessKey %>",
				bucket: "play.landlgames.com",
				access: "public-read",
				cache: false
			},
			build: {
				cwd: "./dist/",
				src: "**",
				dest: '<%= grunt.config.get("targetPrefix") %>'
			}
		}
	});

	grunt.config.set('targetPrefix', grunt.option('prod') ? '' : 'dev/');
	grunt.config.set('environment', grunt.option('prod') ? 'prod' : 'dev');
	grunt.config.set('gameOptions', JSON.stringify(
		{
			version: grunt.config.get('pkg').version,
			compiled: grunt.template.today(),
			debug: grunt.config.get('environment') == 'dev'
		}
	));

	grunt.registerTask('build', ['ts', 'clean:pre', 'copy', 'clean:post', 'beep:*--*']);

	grunt.registerTask('deploy', ['build', 's3']);

	grunt.registerTask('default', ['connect', 'open', 'watch']);

	grunt.registerTask('beep', 'It beeps.', function (what, n) {
		var done = this.async();
		var queue = grunt.util.async.queue(function (note, next) {
			if (note !== '-') {
				grunt.log.write('\x07').write('♪');
			} else {
				grunt.log.write(' ');
			}
			setTimeout(next, 200);
		}, 1);

		queue.drain = function () {
			grunt.log.writeln();
			done();
		};

		function beep(x) {
			for (var i = 0; i < x; i++) queue.push('*');
		}

		what = what || 1;
		var many = parseInt(what);
		if (isNaN(many)) {
			if (what === 'error') {
				if (grunt.fail.errorcount > 0) beep(n || 1);
			} else if (what === 'warn') {
				if (grunt.fail.warncount > 0) beep(n || 1);
			} else {
				queue.push(what.split(''));
			}
		} else {
			beep(many);
		}

		if (queue.length() === 0) {
			done();
		}

	});
}