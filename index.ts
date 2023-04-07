import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

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

    try {
      const result = globalThis.eval(code);
      res.status(200).json({ result, error: null });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: (e as any).message, result: null });
    }
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
