import cluster from "cluster";
import express from "express";
import os from "os";

const app = express();

const delay = (duration: number) => {
  const startTime = Date.now();
  while (Date.now() - startTime < duration);
};

app.get("/", (req, ress) => {
  ress.send("Performance example " + process.pid);
});

app.get("/timer", (req, res) => {
  delay(7000);
  res.send("Timer is done " + process.pid);
});

if (cluster.isPrimary) {
  const NUMBER_OF_WORKERS = os.cpus();
  NUMBER_OF_WORKERS.forEach((core) => {
    cluster.fork();
  });
  console.log(NUMBER_OF_WORKERS.length);
} else {
  app.listen(3000, () => {
    console.log("Server listening on the port 3000");
  });
}
