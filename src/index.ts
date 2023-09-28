import express from "express";

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

app.listen(3000, () => {
  console.log("Server listening on the port 3000");
});
