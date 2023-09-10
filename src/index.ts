import express from "express";
import path from "path";
import friendsRouter from "./routes/friends.router";
import messagesRouter from "./routes/messages.route";

const PORT = 3000;
const app = express();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.url} in ${delta}ms`);
});
app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "views", "index.hbs"), {
    title: "Hello there from",
    caption: "Hello world I am a caption",
  });
});
app.use(express.json());
app.use("/friends", friendsRouter);
app.use("/messages", messagesRouter);

app.listen(PORT, () => {
  console.log("App listenning...");
});
