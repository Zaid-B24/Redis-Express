"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function processSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        const { problemId, code, language } = JSON.parse(submission);
        console.log(`Processing submission for problemId ${problemId}...`);
        console.log(`Code: ${code}`);
        console.log(`Language: ${language}`);
        yield new Promise((resolve) => setTimeout(resolve, 5000));
        console.log(`Finished processing submission for problemId ${problemId}`);
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client
            yield client.connect();
            // Wait for a submission from the "problems" queue
            const submission = yield client.brPop("problems", 0);
            if (submission) {
                yield processSubmission(submission.element);
            }
        }
        catch (error) {
            console.error("Failed to connect to redis or process submission", error);
        }
        finally {
            // Ensure the Redis client is closed when the worker is done
            yield client.disconnect();
        }
    });
}
// Start the worker
startWorker();
