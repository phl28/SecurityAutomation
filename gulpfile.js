const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('run-daily', shell.task([
    'npm run build',
    'npm start'
]));
  
// Schedule the task to run once every day at 9:00 AM
gulp.task('default', gulp.series('run-daily', function(done) {
    setInterval(() => {
        const currentHour = new Date().getHours();
        if (currentHour === 9) {
            gulp.task('run-daily')();
        }
    }, 60000); // Check every minute
  
    done();
  }));
  