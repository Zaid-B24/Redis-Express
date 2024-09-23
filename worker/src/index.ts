import { createClient } from "redis";
const client = createClient();

async function processSubmission(submission: string) {
    const { problemId, code, language } = JSON.parse(submission);
    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Finished processing submission for problemId ${problemId}`);
}

async function startWorker() {
    try {
        await client.connect();
        const submission = await client.brPop("problems", 0);
        if (submission) {
            await processSubmission(submission.element);
        }
    } catch (error) {
        console.error("Failed to connect to redis or process submission", error);
    } finally {
        await client.disconnect();
    }
}
startWorker();