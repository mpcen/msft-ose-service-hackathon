import { promisify } from 'util';
import { JobService } from './JobService';

const sleep = promisify(setTimeout);

export class JobRunner {
  private jobName = 'PROJECTION1';
  private sleepTime = 60 * 1000;
  private jobService = new JobService();

  public async start(): Promise<void> {
    do {
      console.log(`Job runner: start ${this.jobName} job processing.`);
      try {
        await this.jobService.processSnapshot(this.jobName);
        console.log(`Job runner: finish ${this.jobName} job processing.`);
      } catch (error) {
        console.error(`Job runner: ${this.jobName} job failure:`, error);
      }
      console.log(`Job runner: going to sleep for ${this.sleepTime / 1000} sec.`);
      await sleep(this.sleepTime);
    } while (true);
  }
}
