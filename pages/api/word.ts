import type { NextApiRequest, NextApiResponse } from "next";

const wordsDb = [
  "abbey",
  "proxy",
  "metal",
  "space",
  "wrong",
  "games",
  "taboo",
  "words",
];

function millisToDays(millis: number) {
  return Math.floor(millis / 1000 / 60 / 60 / 24);
}

const startOf = millisToDays(new Date("2022-01-18").valueOf());

function getDaysSince() {
  const incoming = millisToDays(new Date().valueOf());
  return incoming - startOf;
}

export default function word(
  req: NextApiRequest,
  res: NextApiResponse<{ word: string }>
) {
  const daysSince = getDaysSince();
  const index = wordsDb.length % daysSince;
  const todaysWord = wordsDb[index];
  res.status(200).json({ word: todaysWord });
}
