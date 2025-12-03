import { db } from '../db';
import { items } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function fixImageUrls() {
  console.log('Starting to fix image URLs...');

  try {
    const allItems = await db.select().from(items);
    let updatedCount = 0;

    for (const item of allItems) {
      if (!item.imageUrls || typeof item.imageUrls !== 'string') {
        continue; // Skip if no imageUrls or not a string
      }

      let parsedUrls: string[];
      try {
        parsedUrls = JSON.parse(item.imageUrls);
      } catch (e) {
        console.error(`Failed to parse imageUrls for item ${item.id}:`, item.imageUrls);
        continue; // Skip if JSON is invalid
      }

      if (!Array.isArray(parsedUrls)) {
        continue;
      }

      // Filter out invalid URLs
      const validUrls = parsedUrls.filter(url => {
        // Check for URLs that are valid http/https URLs and don't contain the worker URL
        // or the erroneous "Welcome" message.
        const isWorkerUrl = url.includes('workers.dev');
        const isWelcomeMessage = url.includes('Welcome to the R2 asset proxy!');
        const isValidHttp = url.startsWith('http://') || url.startsWith('https://');
        
        return isValidHttp && !isWorkerUrl && !isWelcomeMessage;
      });

      // If the number of valid URLs is different, it means we need to update
      if (validUrls.length !== parsedUrls.length) {
        console.log(`Updating item ${item.id}...`);
        console.log(`  Old URLs: ${item.imageUrls}`);
        const newImageUrls = JSON.stringify(validUrls);
        console.log(`  New URLs: ${newImageUrls}`);

        await db.update(items)
          .set({ imageUrls: newImageUrls })
          .where(eq(items.id, item.id));
        
        updatedCount++;
      }
    }

    console.log(`Finished fixing image URLs. Total items updated: ${updatedCount}`);

  } catch (error) {
    console.error('An error occurred while fixing image URLs:', error);
  }
}

fixImageUrls();
