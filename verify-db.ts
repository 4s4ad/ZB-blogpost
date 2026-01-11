
import { db } from "./lib/db";
import { PrismaClient } from "@prisma/client";


async function verify() {
  console.log("Verifying Database Connection...");
  
  try {
    const articles = await db.article.findMany({
      include: {
        author: true,
        categories: true,
        tags: true
      }
    });
    console.log(`Successfully connected! Found ${articles.length} articles.`);
    
    if (articles.length > 0) {
      console.log("Sample Article Titles:");
      articles.forEach(a => console.log(`- ${a.title} (Slug: ${a.slug})`));
    } else {
      console.warn("WARNING: Database connection successful but NO articles found. Did you run the seed?");
    }

    const categories = await db.category.findMany();
    console.log(`Found ${categories.length} categories.`);
    
  } catch (error) {
    console.error("ERROR: Failed to connect to database or fetch data.");
    console.error(error);
  }
}

verify();
