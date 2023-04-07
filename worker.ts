import { parentPort, workerData } from "worker_threads";
import { getQuickJS, shouldInterruptAfterDeadline } from "quickjs-emscripten";

(async () => {
  const { code } = workerData;

  const QuickJS = await getQuickJS();

  try {
    const result = QuickJS.evalCode(code, {
      shouldInterrupt: shouldInterruptAfterDeadline(Date.now() + 1000),
      memoryLimitBytes: 1024 * 1024,
    });
    parentPort!.postMessage({ error: null, value: result });
  } catch (error) {
    console.log(error);
    parentPort!.postMessage({ error: String(error), value: null });
  }
})();
