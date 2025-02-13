//nq222af//

import dataScraper from './scraper.mjs'

/**
 * Main execution script.
 * Script takes an url as parameter or argument.
 * Creates an intance of dataScraper class.
 */
const startUrl = process.argv[2];
if (startUrl) {
    const finder = new dataScraper(startUrl);
    finder.run();
} else {
    // if no url provided then throws this!
    console.log("Please provide a URL as an argument to start");
}
