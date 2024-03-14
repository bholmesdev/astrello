import { Board, db } from "astro:db";
import Slugger from "github-slugger";

// https://astro.build/db/seed
export default async function seed() {
  const slugger = new Slugger();
  await db.insert(Board).values({
    name: "The Ben Board",
    slug: slugger.slug("The Ben Board"),
  });
}
