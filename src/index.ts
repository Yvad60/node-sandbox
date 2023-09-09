import express from "express";

const app = express();

const PORT = 3000;
const friends = [
  {
    id: 1,
    name: "Ivad Yvess",
  },
  {
    id: 2,
    name: "Kate Nina",
  },
];

app.listen(PORT, () => {
  console.log("App listenning...");
});

app.use((req, res, next) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.url} in ${delta}ms`);
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world I am an express app");
});

app.post("/friends", (req, res) => {
  if (req.body.name == null) return res.status(400).json({ error: "Missing friend name" });
  const newFriend = {
    name: req.body.name,
    id: friends.length + 1,
  };
  friends.push(newFriend);
  res.status(201).json(newFriend);
});

app.get("/friends", (req, res) => {
  res.status(200).json(friends);
});
