import { parse } from "csv-parse";
import fs from "fs";
import { Planet } from "./types";

const documentStream = fs.createReadStream("./src/planets-data.csv");
const results: Planet[] = [];

const isPlanetHabbitable = (planet: Planet) => {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    +planet.koi_insol > 0.36 &&
    +planet.koi_insol < 1.11 &&
    +planet.koi_prad < 1.6
  );
};

documentStream
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (chunk: Planet) => {
    if (isPlanetHabbitable(chunk)) results.push(chunk);
  })
  .on("end", () => {
    console.log("Finished reading", results);
  })
  .on("error", (err) => {
    console.log("Error occured", err);
  });
