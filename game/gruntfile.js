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
			dev: ['./src/dist', './src/bin'],
			cleanup: ['./.tscache', './src/bin', './*.tmp.txt']
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
						cwd: './src/Game/CircleChase/asset/',
						dest: './dist/circlechase/asset',
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
			remote: {
				files: ['./src/**/*.ts', './src/**/*.html.ejs'],
				tasks: ['readpkg', 'clean:dev', 'ts', 'copy', 'clean:cleanup', 'deploy']
			},
			local: {
				files: ['./src/**/*.ts', './src/**/*.html.ejs'],
				tasks: ['readpkg', 'clean:dev', 'ts', 'copy', 'clean:cleanup'],
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
				bucket: "play.landlgames.com"
			},
			build: {
				cwd: "./dist/",
				src: "**"
			}
		}
	});
	grunt.registerTask('readpkg', 'Read in the package.json file', function () {
		grunt.config.set('pkg', grunt.file.readJSON('./package.json'));
	});
	grunt.registerTask('deploy', ['gitinfo', 's3']);
	grunt.registerTask('default', ['connect', 'open', 'watch']);
	grunt.registerTask('local', ['connect', 'open', 'watch:local']);
}