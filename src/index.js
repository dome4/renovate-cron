const { CronJob } = require('cron');
const { spawn } = require('child_process');

const SCHEDULE = process.env.SCHEDULE || '0 0 * * *';
const TIME_ZONE = process.env.TIME_ZONE || 'Europe/London';

function executeRenovate(job) {
  // prevent cron job overlap
  if (!job.taskRunning) {
    job.taskRunning = true;

    const renovate = spawn('docker-entrypoint.sh', ['renovate'], {
      cwd: '/usr/src/app',
      stdio: 'inherit',
      stderr: 'inherit',
    });
    renovate.on('close', (code) => {
      if (code !== 0) {
        job.stop();
        console.error('Failed in renovate. Return code', code);
        job.taskRunning = false;
        process.exit(code);
      }
      job.taskRunning = false;
      console.log(`Renovate exited with code ${code}`);
    });
    renovate.on('error', (err) => {
      job.stop();
      console.error('Failed in renovate. Return code');
      console.error(err);
      job.taskRunning = false;
      process.exit(1);
    });
  } else {
    console.log(`Renovate is already running`);
  }
}

// see https://crontab.guru/
var job = new CronJob(
  SCHEDULE,
  () => {
    console.log('--- CRON JOB CALL ---');
    executeRenovate(job);
  },
  () => {},
  false,
  TIME_ZONE
);
console.log('--- CRON JOB START ---');
console.log(`--- SCHEDULE: ${SCHEDULE} ---`);
job.start();
executeRenovate(job);
