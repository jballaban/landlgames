module.exports = function (grunt) {
	grunt.loadNpmTasks("grunt-aws");
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		aws: grunt.file.readJSON("../aws-credentials.json"),
		connect: {
			server: {
				options: {
					port: 8080,
					base: './src'
				}
			}
		},
		open: {
			default: {
				path: 'http://localhost:8080/index.html'
			}
		},
		s3: {
			options: {
				accessKeyId: "<%= aws.accessKeyId %>",
				secretAccessKey: "<%= aws.secretAccessKey %>",
				bucket: "www.landlgames.com"
			},
			build: {
				cwd: "./src/",
				src: "**"
			}
		},
		watch: {
			default: {
				files: ['./src/**'],
				tasks: ['s3']
			}
		},
	});
	grunt.registerTask('default', ['connect', 'open', 'watch']);
}