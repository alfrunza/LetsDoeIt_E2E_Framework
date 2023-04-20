// import HomePage from '../pom/HomePage';

const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");

let driver;

beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
});

test('can navigate to video page', async () => {
    await driver.get("https://letsdoeit.com/");

    await driver.findElement(By.id("age-gate-confirm")).click();
    await driver.findElement(By.css("#nav-item-video > .a > strong")).click();
    await driver.findElement(By.css(".global-video-listing > .global-video-card:nth-child(6) > .-g-vc-inner-top > .-g-vc-fake > svg")).click();

    const videoContainer = await driver.findElement(By.css(".section-boxed > .video-container"));

    expect(videoContainer).not.toBeNull()
    
    await driver.quit();

    // const hp = new HomePage(driver);
    // hp.method1();
})