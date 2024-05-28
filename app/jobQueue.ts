import { Queue, Worker,  } from 'bullmq';
import IORedis from 'ioredis'
import {processBulkOperations} from "~/routes/utils/processBulkOperations";
import * as process from "node:process";

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
})

export const bulkQueue = new Queue('bulkQueue', {
  connection: connection,
});

const bulkWorker = new Worker('bulkQueue', async (job)=>{
  await processBulkOperations(job.data.filename, job.data.shop)
}, { connection });