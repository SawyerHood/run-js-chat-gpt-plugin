import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Worker } from "worker_threads";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.post(
  "/javascript/run",
  async (req: Request<void, { code: string }>, res: Response) => {
    const { code } = req.body;

    // Create a new worker thread to run the third-party code
    const worker = new Worker("./dist/worker.js", {
      workerData: { code },
    });

    // Listen for messages from the worker
    worker.on("message", (result) => {
      if (result.error) {
        return res.status(500).json({ error: result.error, result: null });
      }
      return res.status(200).json({ result: result.value, error: null });
    });

    // Listen for errors from the worker
    worker.on("error", (error) => {
      return res.status(500).json({ error: error.message, result: null });
    });
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
