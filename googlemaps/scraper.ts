// @ts-nocheck
import * as playwright from "playwright";

type Business = {
  place_url?: string;
  name?: string;
  category?: string;
  address?: string;
  website?: string;
  phone?: string;
  stars?: string;
  reviews?: string;
  star_5?: string;
  star_4?: string;
  star_3?: string;
  star_2?: string;
  star_1?: string;
};
const BusinessInfoLocator = {
  name: "h1[class*=fontHeadlineLarge]",
  address: "button[aria-label*=Address]",
  category: "button[jsaction*='pane.rating.category']",
  website: "a[aria-label*=Website]",
  phone: "button[aria-label*=Phone]",
  stars: "div[class*=fontBodyMedium]>div>span>span[aria-label*='star']",
  reviews:
    "div[class*=fontBodyMedium]>div>span>span>span[aria-label*='review']",
  star_5: "tbody>tr[aria-label*='5 star']",
  star_4: "tbody>tr[aria-label*='4 star']",
  star_3: "tbody>tr[aria-label*='3 star']",
  star_2: "tbody>tr[aria-label*='2 star']",
  star_1: "tbody>tr[aria-label*='1 star']",
};
class Scraper {
  location: string;
  name: string;
    static getPlacesInfo: any;

  constructor(name: string,location: string) {
    this.name = name;
    this.location = location;
  }

  query: string = `${name} ${location}`;

  parseSearchResult = async (
    locator: playwright.Locator,
    page: playwright.Page
  ): Promise<Business> => {
    await locator.click();
    await page.waitForTimeout(5000);
    const result: Business = {
      place_url: await locator.locator("a").first().getAttribute("href"),
      name: await page.evaluate(
        () =>
          document.querySelector("h1[class*=fontHeadlineLarge]")?.textContent
      ),
      address: await page.evaluate(
        () => document.querySelector("button[aria-label*=Address]")?.textContent
      ),
      category: await page.evaluate(
        () =>
          document.querySelector("button[jsaction*='pane.rating.category']")
            ?.textContent
      ),
      website: await page.evaluate(
        () => document.querySelector("a[aria-label*=Website]")?.href
      ),
      phone: await page.evaluate(
        () => document.querySelector("button[aria-label*=Phone]")?.innerText
      ),
      stars: await page.evaluate(
        () =>
          document.querySelector(
            "div[class*=fontBodyMedium]>div>span>span[aria-label*='star']"
          )?.previousSibling?.innerText
      ),
      reviews: await page.evaluate(
        () =>
          document
            .querySelector(
              "div[class*=fontBodyMedium]>div>span>span>span[aria-label*='review']"
            )
            ?.innerText?.match(/(\d+)/)![1]
      ),
      star_5: await page.evaluate(
        () =>
          document
            .querySelector("tbody>tr[aria-label*='5 star']")
            ?.getAttribute("aria-label")
            ?.match(/(\d+) review/)![1]
      ),
      star_4: await page.evaluate(
        () =>
          document
            .querySelector("tbody>tr[aria-label*='4 star']")
            ?.getAttribute("aria-label")
            ?.match(/(\d+) review/)![1]
      ),
      star_3: await page.evaluate(
        () =>
          document
            .querySelector("tbody>tr[aria-label*='3 star']")
            ?.getAttribute("aria-label")
            ?.match(/(\d+) review/)![1]
      ),
      star_2: await page.evaluate(
        () =>
          document
            .querySelector("tbody>tr[aria-label*='2 star']")
            ?.getAttribute("aria-label")
            ?.match(/(\d+) review/)![1]
      ),
      star_1: await page.evaluate(
        () =>
          document
            .querySelector("tbody>tr[aria-label*='1 star']")
            ?.getAttribute("aria-label")
            ?.match(/(\d+) review/)![1]
      ),
    };
    return result;
  };

  getPlacesInfo = async (): Promise<Business[]> => {
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log(this.query);
    const url = `https://www.google.com/maps/search/${this.query.replace(
      " ",
      "+"
    )}/?hl=en&entry=ttu`;
    await page.goto(url);
    await page.waitForSelector("div[role*=article]");
    const listings = await page.locator("div[role*=article]");
    const data: Business[] = [];
    for (let i = 0; i < (await listings.all()).length; i++) {
      if(i>0) {
        console.log(data[i-1])
      }
      const locator = listings.nth(i);
      await this.parseSearchResult(locator, page).then((res) => data.push(res));
    }
    await browser.close();
    return data;
  };
}

export default Scraper 