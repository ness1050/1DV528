import fetch from 'node-fetch';
import { parse as parser } from 'node-html-parser';

/**
 * extracts the links and the content of given urls.
 * @param {string} url url for scraping.
 * @param {string} name for scrapping process.
 * @returns {Promise<Array>} links and names.
 */
export async function extract(url, name) {
  process.stdout.write('Scraping: ' + name + '... ');

  const respons = await fetchHtml(url);
  const html = respons.querySelectorAll('a');
  const links = html.map((element) => element.rawAttrs);
  const names = html.map((element) => element.textContent);

  for (let i = 0; i < links.length; i++) {
    links[i] = links[i].replace('href="', '');
    links[i] = links[i].replace('"', '');
    names[i] = names[i].split('\n').join('');
    names[i] = names[i].split(' ').join('');
  }
  return [links, names];
}

/**
 * Fetches the content from given of url.
 * @param {string} url url to fetch from.
 * @returns a parsed document.
 */
export async function fetchHtml(url) {
  try {
    const response = await fetch(url);
    const document = await response.text();
    return parser.parse(document);
  } catch (error) {
    console.error('Failed while fecthing: ', error)
  }
}

