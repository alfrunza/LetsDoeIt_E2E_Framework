const { TestWatcher } = require("jest");
const {By,Key,Builder, until, Actions} = require("selenium-webdriver");
require('@testing-library/jest-dom');
require("chromedriver");

let driver;
let baseUrl = 'https://letsdoeit.com/';
let currentUrl;
let url;
let parentHandle;
let accountsLetsdoeitHandle;

async function loginTrial() {
    //Login on lesofed559@robhung.com
    await driver.findElement(By.css('.box-account')).click();
    await driver.findElement(By.id('input-signin-email')).click();
    await driver.findElement(By.id('input-signin-email')).sendKeys('[email]');
    await driver.findElement(By.id('input-signin-password')).click();
    await driver.findElement(By.id('input-signin-password')).sendKeys('[password]');
    await driver.sleep(500);
    await driver.findElement(By.css('.button-login')).click();

    //Wait until upgrade screen is visible
    await driver.wait(until.urlIs('https://letsdoeit.com/trial-upgrade.en.html'), 10000);
    await driver.sleep(1000);

    //Uncheck the upgrade checkbox and click on CONTINUE TO LETSDOEIT
    await driver.findElement(By.css('.inputs-inline')).click();
    await driver.findElement(By.css('.btn-trial-upgrade-page')).click();

    currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe('https://letsdoeit.com/');
}

beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.sleep(1000);
    await driver.manage().window().maximize();
    // Age gate cookie
    await driver.get('https://letsdoeit.com/');

    // //Open new tab for accounts.letsdoeit.com/
    // parentHandle = await driver.getWindowHandle();
    // await driver.switchTo().newWindow('tab');
    // await driver.sleep(500);
    // accountsLetsdoeitHandle = await driver.getWindowHandle();
    // await driver.get('https://accounts.letsdoeit.com/api/v1/login');

    // //Set a skipCaptcha cookie on accounts.letsodeit.com
    // await driver.manage().addCookie({
    //     name:'skipCaptcha', 
    //     value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic2tpcF9jYXB0Y2hhIiwiaWF0IjoxNjQ3MDE0MzcxLCJleHAiOjE2NDc2MTkxNzEsImlzcyI6ImFjY291bnRzX3Bvcm5kb2UifQ.sMu4APIAiljx2EyvsxriL-hho-AYqhbxRjjtLP0kQms',
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'None',
    // });

    // //Change to first tab
    // await changeTab(parentHandle);

    await driver.findElement(By.id("age-gate-confirm")).click();
    await driver.sleep(500);

    // set a skipCaptchaClient cookie on the current domain
    // await driver.manage().addCookie({
    //     name:'skipCaptchaClient', 
    //     value: '50ec9d8e2d77b8b5f1f5a2229f2f3382cc540932d0a59d60d7c7a0715b2938eaa%3A2%3A%7Bi%3A0%3Bs%3A17%3A%22skipCaptchaClient%22%3Bi%3A1%3Bi%3A1%3B%7D',
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'None',
    // });

    await driver.sleep(1000);

    await driver.navigate().refresh();

    await driver.sleep(5000);

    //Login
    await loginTrial();
});

afterEach(async () => {
    driver.close();
})


jest.setTimeout(90000);

async function changeTab(parentHandle) {
    //Wait for new tab to open
    await driver.wait(
        async () => (await driver.getAllWindowHandles()).length === 2, 10000
    );

    //Change to new tab
    windows = await driver.getAllWindowHandles();
    windows.forEach(async handle => {
        if(handle !== parentHandle){
            await driver.switchTo().window(handle);
        }
    })
}

async function closeTab(parentHandle) {
    //Close tab and return to parent
    await driver.close();
    await driver.switchTo().window(parentHandle);
}

/*
*       Section number:                               SECTION 1
*       Section descrition:                           Marketplace
*       Section Test Cases:                           MP_2
*/

describe('Marketplace', () => {

    //As a Trial user I am prompted with an Upgrade pop-up when trying to open the MP
    test('MP_2', async () => {
        //Click on marketplace logo and verify popup is present
        await driver.findElement(By.css('.market-logo')).click();
        await driver.findElement(By.css('.success'));
        await driver.findElement(By.css('.button-close')).click();
    })
})

/*
*       Section number:                               SECTION 2
*       Section descrition:                           Homepage
*       Section Test Cases:                           HP_1, HP_2, HP_3, HP_4, HP_5, HP_6, HP_7, HP_8, HP_9, HP_10
*/

describe.only('Homepage', () => {

    //As a logged-in user, I can see the Special Partner Deals carousel at the bottom of the page (LDI network deals for Trial users)
    test('HP_1', async () => {
        //Scroll down and verify carousel is present
        await driver.executeScript('window.scroll({top: 3000, left: 0, behavior: "smooth"});');
        await driver.sleep(2000);
        await driver.findElement(By.css('.home-main-carousel'));
    })

    //As a guest/trial/premium user I can access the: Videos\Models\Channels\Categories\Tags\Language\Notifications\User Log in\Search\Sign Up in the header
    test('HP_2', async () => {
        //Click on Videos and verify link is https://letsdoeit.com/videos.en.html
        await driver.findElement(By.css('#nav-item-video > .a > strong')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseUrl + 'videos.en.html');

        //Click on Models and verify link is https://letsdoeit.com/pornstars/sex/girls.en.html
        await driver.findElement(By.css('#nav-item-models > .a > strong')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseUrl + 'pornstars/sex/girls.en.html');

        //Click on Channels and verify link is https://letsdoeit.com/channels.en.html
        await driver.findElement(By.linkText('CHANNELS')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseUrl + 'channels.en.html');

        //Click on Categories and verify link is https://letsdoeit.com/channels.en.html
        await driver.findElement(By.linkText('CATEGORIES')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseUrl + 'categories.en.html');

        //Click on Tags and verify link is https://letsdoeit.com/channels.en.html
        await driver.findElement(By.linkText('TAGS')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseUrl + 'tags.en.html');

        //Click on #LETSDOEIT logo and verify link is baseUrl
        await driver.findElement(By.css('.module-header .module-header_logo')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseUrl);

        //Click on Language box and verify language menu is visible
        await driver.findElement(By.css('.box-language')).click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.module-language'))), 3000);
        await driver.findElement(By.css('.box-language')).click();

        //Click on Profile box and verify profile menu is visible
        await driver.findElement(By.css('.box-account')).click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.module-account'))), 3000);
        await driver.findElement(By.css('.box-account')).click();

        //Click on Search box and verify search menu is visible
        await driver.findElement(By.css('.box-search')).click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.module-search:not(.hide)'))), 3000);
        await driver.findElement(By.css('.box-search')).click();

        //Click on UPGRADE button and verify user is redirected to vendor page
        await driver.findElement(By.linkText('UPGRADE')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('segpay.com/');
    })

    //Each scene has a picture & video preview on mouse hover
    test( 'HP_3', async () => {
        //Create array with all video cards
        let videoCards = await driver.findElements(By.css('.-g-vc-inner-top'));

        //Define actions
        const actions = driver.actions({async: true});
        
        //Execute "for loop" through the element array
        for (let i = 0; i < videoCards.length; i++) { 
            //Mouse hover event
            await actions.move({origin: videoCards[i]}).perform();  

            await driver.sleep(1000);
            
            //Verify video preview is present
            await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.global-preview'))), 3000);
        }

    })

    //As an user I can find the H1 title (Latest Releases) under the homepage carousel with a selection of 8 scenes with a "Load More" button
    test( 'HP_4', async () => {
        //Define Latest Releases header and Load More button
        let h1_latest = await driver.findElement(By.css('.module-latest-movies > .h1 > a'));
        let loadMore_latest = await driver.findElement(By.css('.module-latest-movies > .module-latest-movies-bottom'));

        //Verify variables are defined
        expect(h1_latest).toBeDefined();
        expect(loadMore_latest).toBeDefined();

        //Create video card array
        let videoCards = await driver.findElements(By.css('.module-latest-movies > .global-video-listing > .global-video-card'));

        //Verify there are 8 video cards under Latest Releases
        expect(videoCards.length).toBe(8);
    })

    //As an user, clicking on the header title or the Load More (for top and latest movies) button will send me to the videos listing 
    test( 'HP_5', async () => {
        //Click on Latest Releases header
        await driver.findElement(By.css('.module-latest-movies > .h1 > a')).click();

        //Verify current link is https://letsdoeit.com/videos.en.html?order=-recent
        expect(await driver.getCurrentUrl()).toBe(baseUrl + 'videos.en.html?order=-recent');

        //Navigate to previous page
        await driver.navigate().back();

        //Click on Load More button
        await driver.findElement(By.css('.module-latest-movies > .module-latest-movies-bottom > a')).click();

        //Verify current link is https://letsdoeit.com/videos.en.html?order=-recent
        expect(await driver.getCurrentUrl()).toBe(baseUrl + 'videos.en.html?order=-recent');

        //Navigate to previous page
        await driver.navigate().back();

        /*
        *   REPEAT THE SAME FOR POPULAR UPLOADS
        */

        //Scroll to popular
        await driver.executeScript("window.scroll({ top: 1000, left: 0, behavior: 'smooth'});");

        //Click on Popular this week header
        await driver.findElement(By.css('.module-finest > .h1 > a')).click();

        //Verify current link is https://letsdoeit.com/videos.en.html?order=rating
        expect(await driver.getCurrentUrl()).toBe(baseUrl + 'videos.en.html?order=rating');

        //Navigate to previous page
        await driver.navigate().back();

        //Scroll to load more
        await driver.executeScript("window.scroll({ top: 1500, left: 0, behavior: 'smooth'});");

        if(driver.findElement(By.css('.partner-offer-media .btn[aria-label="Close"'))){
            await driver.findElement(By.css('.partner-offer-media .btn[aria-label="Close"')).click();
        }

        //Click on Load More button
        await driver.findElement(By.css('.module-finest > .module-finest-bottom > a')).click();

        //Verify current link is https://letsdoeit.com/videos.en.html?order=rating
        expect(await driver.getCurrentUrl()).toBe(baseUrl + 'videos.en.html?order=rating');
    })

    //As an user I can find another H1 title under the 1st one (Popular This Week) with a selection of 8 scenes with a "Load More" button
    test( 'HP_6', async () => {
        //Define Latest Releases header and Load More button
        let h1_popular = await driver.findElement(By.css('.module-finest > .h1 > a'));
        let loadMore_popular = await driver.findElement(By.css('.module-finest > .module-finest-bottom'));

        //Verify variables are defined
        expect(h1_popular).toBeDefined();
        expect(loadMore_popular).toBeDefined();

        //Create video card array
        let videoCards = await driver.findElements(By.css('.module-finest > .global-video-listing > .global-video-card'));

        //Verify there are 8 video cards under Latest Releases
        expect(videoCards.length).toBe(8);
    })

    //As an user I can find the 3rd header (Recently Active Pornstars) with a selection of 6 models which have had recent activity
    test( 'HP_7', async () => {
        //Define Pornstars header and Load Mode button
        let h1_pornstars = await driver.findElement(By.css('.module-actors > .h1 > a'));
        let loadMore_pornstars = await driver.findElement(By.css('.module-actors > .module-actors-bottom'));

        //Verify variables are defined
        expect(h1_pornstars).toBeDefined();
        expect(loadMore_pornstars).toBeDefined();

        //Create pornstar card array
        let videoCards = await driver.findElements(By.css('.module-actors > .global-actors-listing > .global-actor-card'));

        //Verify there are 6 pornstar cards under Recently Active
        expect(videoCards.length).toBe(6);
    })

    //As a logged in user I can find the MP bar above the header
    test('HP_8', async () => {
        //Verify MP bar is present
        await driver.findElement(By.css('.module-market-header'));
    })

    //As a trial user trying to open anything (besides language and account) I am prompted with an Upgrade pop-up
    test('HP_9', async () => {
        //Click on network and verify popup is present
        await driver.findElement(By.css('.item-networks')).click();
        await driver.findElement(By.css('.success'));
        await driver.findElement(By.css('.button-close')).click();

        //Click on sites and verify popup is present
        await driver.findElement(By.css('.item-sites')).click();
        await driver.findElement(By.css('.success'));
        await driver.findElement(By.css('.button-close')).click();
    })

    //As a trial user I have an Upgrade banner on the bottom of the page
    test('HP_10', async () => {
        //Verify banner is present
        await driver.findElement(By.css('.popup-upgrade_yellow_bar'));
    })
})