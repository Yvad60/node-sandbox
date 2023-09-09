import express from "express";
import friendsRouter from "./routes/friends.router";

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.url} in ${delta}ms`);
});

app.use(express.json());
app.use("/friends", friendsRouter);

app.listen(PORT, () => {
  console.log("App listenning...");
});
