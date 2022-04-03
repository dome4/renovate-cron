const { CronJob } = require("cron");
const { spawn } = require("child_process");

const SCHEDULE = process.env.SCHEDULE || "0 0 * * *";
const TIME_ZONE = process.env.TIME_ZONE || "Europe/London";

function executeRenovate() {
    const renovate = spawn("docker-entrypoint.sh", {
        cwd: '/usr/src/app',
        stdio: "inherit",
        stderr: "inherit",
    });
    renovate.on('close', (code) => {
        if (code !== 0) {
            job.stop();
            console.error('Failed in renovate. Return code', code);
            process.exit(code);
        }
        console.log(`Renovate exited with code ${code}`);
    });
    renovate.on('error', (err) => {
        job.stop();
        console.error('Failed in renovate. Return code');
        console.error(err);
        process.exit(1);
    });
}

// see https://crontab.guru/
var job = new CronJob(SCHEDULE, () => {
    console.log('--- CRON JOB CALL ---');
    executeRenovate();
},() => {},false, TIME_ZONE);
console.log('--- CRON JOB START ---');
console.log(`--- SCHEDULE: ${SCHEDULE} ---`);
job.start();
executeRenovate();