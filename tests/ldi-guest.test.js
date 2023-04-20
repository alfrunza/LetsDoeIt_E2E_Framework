const { TestWatcher } = require("jest");
const {By,Key,Builder, until, Actions} = require("selenium-webdriver");
require('@testing-library/jest-dom');
require("chromedriver");

let driver;
let baseUrl = 'https://letsdoeit.com/';
let currentUrl;
let url;

beforeEach(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.sleep(1000);
    await driver.manage().window().maximize();
    // Age gate cookie
    await driver.get('https://letsdoeit.com/');
    await driver.findElement(By.id("age-gate-confirm")).click();
    await driver.sleep(500);
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
*       Section descrition:                           Homepage
*       Section Test Cases:                           HP_2, HP_3, HP_4, HP_5, HP_6, HP_7
*/


describe('Homepage', () =>{

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

        //Click on Notification box and verify notification menu is visible
        await driver.findElement(By.css('.box-notifications')).click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.module-notifications'))), 3000);
        await driver.findElement(By.css('.box-notifications')).click();

        //Click on Profile box and verify profile menu is visible
        await driver.findElement(By.css('.box-account')).click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.module-account'))), 3000);
        await driver.findElement(By.css('.box-account')).click();

        //Click on Search box and verify search menu is visible
        await driver.findElement(By.css('.box-search')).click();
        await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.module-search:not(.hide)'))), 3000);
        await driver.findElement(By.css('.box-search')).click();

        //Click on SIGN UP button and verify user is redirected to Join Page
        await driver.findElement(By.linkText('SIGN UP')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('letsdoeit.com/sign-up');
    })

    //Each scene has a picture & video preview on mouse hover
    test.only( 'HP_3', async () => {
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
})

/*
*       Section number:                               SECTION 2
*       Section descrition:                           Videos Page
*       Section Test Cases:                           VLP_1, VLP_2, VLP_3, VLP_4
*/

describe('Videos Listing Page', () => {

    //As an user accessing videos will send me to the videos listing page using the Newest videos order (4 videos on each of the 6 rows)
    test( 'VLP_1', async () => {

        //Click on Videos in the header
        await driver.findElement(By.linkText('VIDEOS')).click();

        //Get Url and verify it
        currentUrl = await driver.getCurrentUrl();
        url = baseUrl + 'videos.en.html';
        expect(currentUrl).toBe(url);
        
        //Count videos and verify correct number
        let videoCards = await driver.findElements(By.css('.global-video-listing > .global-video-card'));
        expect(videoCards.length).toBe(24);
    })

    test( 'VLP_2', async () => {
        //Click on Videos in the header
        await driver.findElement(By.linkText('VIDEOS')).click();
        url = await driver.getCurrentUrl();

        //Click on Most Popular and verify link
        await driver.findElement(By.css('.inputs-boxes > .input-select')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('Most Popular')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=rating');

        //Click on Most Viewed and verify link
        await driver.findElement(By.css('.inputs-boxes > .input-select')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('Most viewed')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=-views_weekly');

        //Click on Longest Movies and verify link
        await driver.findElement(By.css('.inputs-boxes > .input-select')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('Longest movies')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=-length');

        //Click on Newest Movies and verify link
        await driver.findElement(By.css('.inputs-boxes > .input-select')).click();
        await driver.sleep(1000);
        await driver.findElement(By.linkText('Newest movies')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=-recent');
    })

    //At the bottom of the page I can find the pagination buttons
    test( 'VLP_3', async () => {
        //Click on Videos in the header
        await driver.findElement(By.linkText('VIDEOS')).click();

        //Verify pagination buttons are present
        let pageButtons = await driver.findElement(By.css('.pagination'));
        expect(pageButtons).toBeDefined;
    })

    //As an user I can click any of the pagination buttons which will lead me to their designated page
    test( 'VLP_4', async () => {
        //Click on Videos in the header
        await driver.findElement(By.linkText('VIDEOS')).click();

        //Scroll to pagination
        await driver.executeScript("window.scroll({ top: 1500, left: 0, behavior: 'smooth'});");

        await driver.sleep(1000);

        //Create "do...while" loop to be executed for 4 page buttons after firstly clicking on next page
        await driver.findElement(By.css('.-p-pages-links > a:nth-child(2)')).click();
        let i=2;
        do{
            //Scroll to pagination
            await driver.executeScript("window.scroll({ top: 1500, left: 0, behavior: 'smooth'});");
            await driver.sleep(1000);
            
            //Get link, verify link, click next page and increment
            currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toContain('?page='+i);
            await driver.findElement(By.css('.-p-next-url')).click();
            i++;
        }while(i<=5);
    })
})

/*
*       Section number:                               SECTION 3
*       Section descrition:                           Player Page
*       Section Test Cases:                           PP_1, PP_6, PP_8, PP_9, PP_10, PP_11, PP_12, PP_13, PP_14
*/

describe('Player Page', () => {

    //Selecting a scene\video will send me to the single video page
    test( 'PP_1', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Get link and verify it includes "/watch"
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/watch');
    })

    //As a logged in/guest user I can find the like - dislike - favorite - save - downloads - nr. of views - upload date buttons
    test( 'PP_6', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Search for Like button
        await driver.findElement(By.css('.row-actions-video > .col-auto-width > .row.table > .txt-center:nth-child(1)'));

        //Search for Dislike button
        await driver.findElement(By.css('.row-actions-video > .col-auto-width > .row.table > .txt-center:nth-child(2)'));

        //Search for Favorite button
        await driver.findElement(By.css('.row-actions-video > .col:nth-child(2) > .actions'));

        //Search for Save button
        await driver.findElement(By.css('.col:nth-child(3) > .actions'));

        //Search for Downloads button
        await driver.findElement(By.css('.col:nth-child(4) > .actions'));

        //Search for Comments button
        await driver.findElement(By.css('.m-hide > .actions'));

        //Search for No. of Views and Upload Date
        await driver.findElement(By.css('.h5-published'));
    })

    //As an user I can find the tags and the categories the selected scene is from
    test( 'PP_8', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Search for Tags and Categories
        await driver.findElement(By.css('.h5 .inline-links')); //Categories
        await driver.findElement(By.css('.h6 .inline-links')); //Tags
    })

    //As a guest user I can find a selection of pictures under the videoplayer and clicking on them will take me to the sign up page
    test( 'PP_9', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Click on the first image in Gallery
        await driver.findElement(By.css('#gallery-thumbs > .swiper-slide-active > a')).click();

        //Verify link contains "sign-up.en.html"
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
    })

    // As a guest user I can find the comment section under the picture gallery locked behind "Comments only available to members" and an JOIN NOW button
    test( 'PP_10', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Get comment box text and verify it is correct
        let commentBoxText = await driver.findElement(By.css('.h2 > i')).getText();
        expect(commentBoxText).toBe('Comments only available to members');

        //Verify Join Now button exists
        await driver.findElement(By.css('.button-join-now'));
    })

    //Clicking on JOIN NOW will take me to the sign up page
    test( 'PP_11', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Click on Comments button to scroll down
        await driver.sleep(1000);
        await driver.findElement(By.css('.partner-offer-media .btn[aria-label="Close"')).click();
        await driver.findElement(By.css('.m-hide > .actions')).click();

        //Click Join Now button and verify link is correct
        await driver.findElement(By.css('.button-join-now')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
    })

    //As an user, above the "Related Movies" section I can find a header title with "Similar Videos From {Channel}" and a selection of 4 scenes
    test( 'PP_12', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Get channel name
        let channelName = await driver.findElement(By.css('.actors > .h5 strong')).getText();

        //Get 'similar to [channel]' text
        let similarVidText = await driver.findElement(By.css('.module-similar-movies > .h1 > a')).getText();

        //Verify similar video text is composed of "similar videos from" and channel name
        expect(similarVidText.toLowerCase()).toBe('similar videos from ' + channelName.toLowerCase());
    })

    //As an user, above the comments section I can find a header title with "Related Movies" and a selection of 8 scenes (model/brand)
    test( 'PP_13', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //Save all video cards in array and verify total number is 8
        let videoCards = await driver.findElements(By.css('.module-related-movies > .global-video-listing > .global-video-card'));
        expect(videoCards.length).toBe(8);
    })

    //As a guest user selecting (like - dislike - favorite - save - downloads - commenting/reply) will send me to sign up page.
    test( 'PP_14', async () => {
        //Click on first video on homepage
        await driver.findElement(By.css('.global-video-card')).click();

        //If the offer banner appears, close it
        await driver.sleep(1000);
        if(driver.findElement(By.css('.partner-offer-media .btn[aria-label="Close"'))){
            await driver.findElement(By.css('.partner-offer-media .btn[aria-label="Close"')).click();
        }

        //Click on Like button and verify link
        await driver.findElement(By.css('.row-actions-video > .col-auto-width > .row.table > .txt-center:nth-child(1)')).click();
        await driver.sleep(2000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
        driver.navigate().back();

        //Click on Dislike button and verify link
        await driver.findElement(By.css('.row-actions-video > .col-auto-width > .row.table > .txt-center:nth-child(2)')).click();
        await driver.sleep(2000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
        driver.navigate().back();

        //Click on Favorite button and verify link
        await driver.findElement(By.css('.row-actions-video > .col:nth-child(2) > .actions')).click();
        await driver.sleep(2000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
        driver.navigate().back();

        //Click on Save button and verify link
        await driver.findElement(By.css('.col:nth-child(3) > .actions')).click();
        await driver.sleep(2000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
        driver.navigate().back();

        //Click on Downloads button and verify link
        await driver.findElement(By.css('.col:nth-child(4) > .actions')).click();
        await driver.sleep(2000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
        driver.navigate().back();
    })
})

/*
*       Section number:                               SECTION 4
*       Section descrition:                           Categories Page
*       Section Test Cases:                           CTG_1, CTG_2, CTG_3, CTG_4
*/

describe('Categories Listing Page', () => {

    //As an user I can access the Categories page from the header
    test( 'CTG_1', async () => {
        //Click on Categories in the header and verify link
        await driver.findElement(By.linkText('CATEGORIES')).click();
        url = baseUrl + 'categories.en.html';
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url);
    })

    //As an user in the Categories page I can find a dropdown with all the categories
    test( 'CTG_2', async () => {
        //Click on Categories in the header
        await driver.findElement(By.linkText('CATEGORIES')).click();

        //Click on dropdown and store the ${randomNumber}th category name
        await driver.findElement(By.css('.inputs-boxes > .input-select')).click();
        await driver.sleep(500);

        //Create array with all categories and get the title of a random category
        const links = await driver.findElements(By.css('.inputs-modals > .inner > a'));
        const randomLink = Math.floor(Math.random() * links.length);
        let linkText = await links[randomLink].getText();

        //Click on the random category chosen above
        await links[randomLink].click();

        //Change linkText string so that it matches possible links (turn '& ' into '', ' (18+)' into '' and ' ' into '-')
        linkText = linkText.replace(' (18+)', '');
        linkText = linkText.replace('& ', '');
        linkText = linkText.replace(/ /g, '-');
        linkText = linkText.toLowerCase();

        //Get link and compare to linkText
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/categories');
        expect(currentUrl).toContain('/' + linkText);
    })

    //As an user I can click on any of the Categories and be taken to said category's page
    test( 'CTG_3', async () => {
        //Click on Categories in the header
        await driver.findElement(By.linkText('CATEGORIES')).click();

        //Crate array with category cards and get the title of a random card
        const catCards = await driver.findElements(By.css('.-g-cc-url'));
        const randomLink = Math.floor(Math.random() * catCards.length);
        let linkText = await catCards[randomLink].getAttribute('title');

        //Click on the random category chosen above
        await catCards[randomLink].click();

        //Change linkText string so that it matches possible links (turn '& ' into '', ' (18+)' into '' and ' ' into '-')
        linkText = linkText.replace(' (18+)', '');
        linkText = linkText.replace('& ', '');
        linkText = linkText.replace(/ /g, '-');
        linkText = linkText.toLowerCase();

        //Get link and compare to linkText
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/categories');
        expect(currentUrl).toContain('/' + linkText);
    })

    //As an user I can find a search field where I can search for a category (category will be displayed after searching and I need to click it)
    test( 'CTG_4', async () => {
        //Click on Categories in the header
        await driver.findElement(By.linkText('CATEGORIES')).click();

        //Crate array with category cards and get the title of a random card
        const catCards = await driver.findElements(By.css('.-g-cc-url'));
        const randomLink = Math.floor(Math.random() * catCards.length);
        let linkText = await catCards[randomLink].getAttribute('title');

        //Find search bar, click it and search for linkText category; click on result
        let searchBar = await driver.findElement(By.css('.light_youtube_searched_for'));
        await searchBar.click();
        await searchBar.sendKeys(linkText);
        await driver.sleep(500);
        await driver.findElement(By.css('.inputs-active .inputs-modals > .inner > a')).click();
        
        //Change linkText string so that it matches possible links (turn '& ' into '', ' (18+)' into '' and ' ' into '-')
        linkText = linkText.replace(' (18+)', '');
        linkText = linkText.replace('& ', '');
        linkText = linkText.replace(/ /g, '-');
        linkText = linkText.toLowerCase();

        //Get link and compare to linkText
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/categories');
        expect(currentUrl).toContain('/' + linkText);
    })
})

/*
*       Section number:                               SECTION 5
*       Section descrition:                           Models Listing Page
*       Section Test Cases:                           MLP_1, MLP_2, MLP_3, MLP_4
*/

describe('Models Listing Page', () => {

    //As an user I can access Models page
    test( 'MLP_1', async () => {
        //Click on Models in the header
        await driver.findElement(By.linkText('MODELS')).click();
        url = baseUrl + 'pornstars/sex/girls.en.html';
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url);
    })

    //As an user in the models page I can find a dropdown menu to change the gender of the models
    test( 'MLP_2', async () => {
        //Click on Models in the header
        await driver.findElement(By.linkText('MODELS')).click();

        //Click on gender dropdown, click on Male and verify link
        await driver.findElement(By.css('.-aih-filters-filter > .inputs-boxes')).click();
        await driver.sleep(500);
        await driver.findElement(By.css('.-aih-filters-filter > .inputs-boxes > .inputs-modals')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('guys');
    })

    //As an user, in the models page, I can find a dropdown menu to change the order of the models (by name / videos / popular models / recent activity)
    test( 'MLP_3', async () => {
        //Click on Models in the header
        await driver.findElement(By.linkText('MODELS')).click();

        //Click on sorter dropdown, click on Name and verify link
        await driver.findElement(By.css('.-aih-filters-sorter > .inputs-boxes > .input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Name')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('?order=name');

        //Click on sorter dropdown, click on Videos and verify link
        await driver.findElement(By.css('.-aih-filters-sorter > .inputs-boxes > .input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Videos')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('?order=-movies');

        //Click on sorter dropdown, click on Popular Models and verify link
        await driver.findElement(By.css('.-aih-filters-sorter > .inputs-boxes > .input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Popular Models')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('?order=-hotness');

        //Click on sorter dropdown, click on Recent Activity and verify link
        await driver.findElement(By.css('.-aih-filters-sorter > .inputs-boxes > .input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Recent Activity')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('?order=activity');
    })

    //As an user, in the models page, I can find a search bar to look for models on the site
    test( 'MLP_4', async () => {
        //Click on Models in the header
        await driver.findElement(By.linkText('MODELS')).click();

        //Create model card array and get a random name
        const modelCards = await driver.findElements(By.css('.-g-ac-url'));
        const randomLink = Math.floor(Math.random() * modelCards.length);
        let linkText = await modelCards[randomLink].getAttribute('title');
        linkText = linkText.slice(20);

        //Click on the search bar and search for the random chosen
        let searchBar = driver.findElement(By.css('.light_youtube_searched_for'));
        await searchBar.click();
        await searchBar.sendKeys(linkText);
        await driver.sleep(500);
        await driver.findElement(By.css('.inputs-active .inputs-modals > .inner > a')).click();

        //Change linkText so that it maches possible link; verify link
        linkText = linkText.replace(/ /g , '-');
        linkText = linkText.toLowerCase();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain(linkText);
        expect(currentUrl).toContain('/models');
    })
})

/*
*       Section number:                               SECTION 6
*       Section descrition:                           Model Profile Page
*       Section Test Cases:                           MPP_1, MPP_2, MPP_4
*/

describe('Model Profile Page', () => {

    //As an user I can access any models page
    test( 'MPP_1', async () => {
        //Click on Models in the header
        await driver.findElement(By.linkText('MODELS')).click();

        //Remember first model on the page, click the card and verify link
        let modelCard = await driver.findElement(By.css('.-g-ac-url'));
        let modelName = await modelCard.getAttribute('title');
        modelName = modelName.slice(20);
        modelName = modelName.replace(/ /g, '-');
        modelName = modelName.toLowerCase();
        await modelCard.click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/models');
        expect(currentUrl).toContain(modelName);
    })

    //As an user I can find a "subscribe" button - as a guest, clicking it will take me to the sign up page 
    test( 'MPP_2', async () => {
        //Click on Models in the header and click on the first model
        await driver.findElement(By.linkText('MODELS')).click();
        await driver.findElement(By.css('.-g-ac-url')).click();

        //Click on subscribe button and verify link
        await driver.findElement(By.css('.button-subs')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
    })

    //As an user I can find a picture of the model on the left and the scenes they performed in below
    test( 'MPP_4', async () => {
        //Click on Models in the header and click on the first model
        await driver.findElement(By.linkText('MODELS')).click();
        await driver.findElement(By.css('.-g-ac-url')).click();

        //Search for videos module
        await driver.findElement(By.css('.module-actor-videos'));
    })
})

/*
*       Section number:                               SECTION 7
*       Section descrition:                           Channels Listing Page
*       Section Test Cases:                           CLP_1, CLP_2, CLP_3, CLP_4, CLP_5, CLP_6, CLP_7
*/

describe('Channels Listing Page', () => {
    
    //As an user I can access Channels Page
    test('CLP_1', async () => {
        //Click on Channels in the header and verify link
        await driver.findElement(By.linkText('CHANNELS')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(baseUrl + 'channels.en.html');
    })

    //As an user I can find a listing of channels with 8 channels with 4 videos on each row (depends on the network)
    test('CLP_2', async () => {
        //Click on Channels in the header
        await driver.findElement(By.linkText('CHANNELS')).click();

        //Create array with all visible channels; verify they are a total of 8
        const totalChannels = await driver.findElements(By.css('.module-channel-box:not(.hide)'));
        expect(totalChannels.length).toBe(8);

        //Create array with all visible videos; verify total number of videos is totalChannels * 4
        const totalVids = await driver.findElements(By.css('.module-channel-box:not(.hide) .trailer-video-card'));
        expect(totalVids.length).toBe(totalChannels.length * 4);
    })

    //As an user I can find a dropdown menu to change the network
    test('CLP_3', async () => {
        //Click on Channels in the header
        await driver.findElement(By.linkText('CHANNELS')).click();

        await driver.findElement(By.css('.-chih-filters-network > .inputs-boxes > .input-select'));


    })

    //Changing the network from the dropdown will take me to the network's page in a new tab
    test('CLP_4', async () => {
        //Click on Channels in the header
        await driver.findElement(By.linkText('CHANNELS')).click();

        //Store current window handle
        const parentHandle = await driver.getWindowHandle();

        //Click on a new (random) network and remember linkText
        await driver.findElement(By.css('.-chih-filters-network > .inputs-boxes > .input-select')).click();
        await driver.sleep(1000);
        const networks = await driver.findElements(By.css('.-chih-filters-network > .inputs-boxes > .inputs-modals > .inner > a'));
        const randomIndex = Math.floor(Math.random() * networks.length);
        let auxText = await networks[randomIndex].getText();
        await networks[randomIndex].click();

        await changeTab(parentHandle)

        //Get title for verification
        await driver.sleep(2000);
        currentUrl = await driver.getCurrentUrl();

        //Create switch loop for verifying possible link scenarios
        switch(auxText) {
            case "DoeGirls":
                expect(currentUrl).toBe("https://doegirls.com/");
                break;
            case "Mamacitaz":
                expect(currentUrl).toBe("https://mamacitaz.com/channels.en.html");
                break;
            case "AmateurEuro":
                expect(currentUrl).toBe("https://amateureuro.com/channels.en.html");
                break;
            case "VIPSexVault":
                expect(currentUrl).toBe("https://vipsexvault.com/channels.en.html");
                break;
            case "TransBella":
                expect(currentUrl).toBe("https://transbella.com/channels.en.html");
                break;
            default:
                console.log("Something went wrong...");
                fail();

        };

        await driver.sleep(1000);
        
        await closeTab(parentHandle);
    })

    //As an user I can find a dropdown menu to change the channels
    test('CLP_5', async () => {
        //Click on Channels in the header
        await driver.findElement(By.linkText('CHANNELS')).click();

        await driver.findElement(By.css('.-chih-filters-channels > .inputs-boxes > .input-select'));
    })

    //Changing the channel will display videos from that channel
    test('CLP_6', async () => {
        //Click on Channels in the header
        await driver.findElement(By.linkText('CHANNELS')).click();

        //Click on a random channel and remember linkText
        await driver.findElement(By.css('.-chih-filters-channels > .inputs-boxes > .input-select')).click();
        await driver.sleep(1000);
        const channels = await driver.findElements(By.css('.-chih-filters-channels > .inputs-boxes > .inputs-modals > .inner > a'));
        const randomIndex = Math.floor(Math.random() * channels.length);
        let linkText = await channels[randomIndex].getText();
        await channels[randomIndex].click();

        //Change linkText to match possible links
        linkText = linkText.replace(/ /g, '-');
        linkText = linkText.toLowerCase();

        //Verify link
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain(linkText);
        expect(currentUrl).toContain('/channels/');
    })

    //As an user I can find a button to load more channels on the bottom of the page
    test('CLP_7', async () => {
        //Click on Channels in the header
        await driver.findElement(By.linkText('CHANNELS')).click();

        //Create array with all the visible elements
        const visibleChannels = await driver.findElements(By.css('.module-channel-box:not(.hide)'));
        expect(visibleChannels.length).toBe(8);

        await driver.sleep(500);

        //Create array with media banner and click on Close button if it exists
        const visibleBanner = await driver.findElements(By.css('.partner-offer-media'));
        if(visibleBanner.length === 1){
            await driver.findElement(By.css('.btn[data-animation-target="partner-offer-media"]')).click();
        }

        await driver.sleep(500);

        //Click on LOAD MORE CHANNELS button
        await driver.findElement(By.id('btn-load-more-channels')).click();

        //Create new array with all the visible elements
        const visibleChannels_2 = await driver.findElements(By.css('.module-channel-box:not(.hide)'));
        expect(visibleChannels_2.length).toBe(18);

        console.log(visibleChannels.length);
        console.log(visibleChannels_2.length);
    })
})

/*
*       Section number:                               SECTION 8
*       Section descrition:                           Channel Profile Page
*       Section Test Cases:                           CPP_1, CPP_2, CPP_4, CPP_5
*/

describe('Channel Profile Page', () => {

    //As an user I can find videos from the channel on which page I am currently on
    test('CPP_1', async () => {
        //Click on CHANNELS in the header, remember first channel name and click it
        await driver.findElement(By.linkText('CHANNELS')).click();
        let channelName = await driver.findElement(By.css('.module-channel-box a')).getAttribute('title');
        await driver.findElement(By.css('.module-channel-box a')).click();

        //Modify channel name to match possible links
        channelName = channelName.replace(/ /g, '-');
        channelName = channelName.toLowerCase();

        //Verify link
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain(channelName);
        expect(currentUrl).toContain('/channels/');
    })

    //As an user I can view the Channel Trailer
    test('CPP_2', async () => {
        //Click on CHANNELS in the header and click on the first channel
        await driver.findElement(By.linkText('CHANNELS')).click();
        await driver.findElement(By.css('.module-channel-box a')).click();

        //Click on Trailer and find preview element
        await driver.findElement(By.css('.-chph-trailer > .btn')).click();
        await driver.sleep(500);
        await driver.findElement(By.id('video-channel-preview'));
    })

    //As an user I can find a dropdown to order the channel's scenes (newest movies - most popular - most viewed - longest movies)
    test('CPP_4', async () => {
        //Click on CHANNELS in the header and click on the first channel
        await driver.findElement(By.linkText('CHANNELS')).click();
        await driver.findElement(By.css('.module-channel-box a')).click();

        //Remember channel link for future purpouses
        url = await driver.getCurrentUrl();

        //Change dropdown option to Most Popular and verify link
        await driver.findElement(By.css('.input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Most Popular')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=rating');

        //Change dropdown option to Most viewed and verify link
        await driver.findElement(By.css('.input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Most viewed')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=-views_weekly');

        //Change dropdown option to Longest movies and verify link
        await driver.findElement(By.css('.input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Longest movies')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=-length');

        //Change dropdown option to Newest movies and verify link
        await driver.findElement(By.css('.input-select')).click();
        await driver.sleep(500);
        await driver.findElement(By.linkText('Newest movies')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(url + '?order=-recent');
    })

    //As a guest user I am sent to the sign in page when trying to subscribe to a channel
    test('CPP_5', async () => {
        //Click on CHANNELS in the header and click on the first channel
        await driver.findElement(By.linkText('CHANNELS')).click();
        await driver.findElement(By.css('.module-channel-box a')).click();

        //Click on sub button and verify link
        await driver.findElement(By.css('.button-subs')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/sign-up.en.html');
    })
})

/*
*       Section number:                               SECTION 9
*       Section descrition:                           Search
*       Section Test Cases:                           SRC_1
*/

describe('Search', () => {

    //As a guest I can use the Search feature from the header menu
    test('SRC_1', async () => {
        //Create a string of 5 random letters for us to search
        let string = Math.random().toString(36).slice(-5);
        console.log(string);

        //Click on search button and search for string
        await driver.findElement(By.css('.box-search')).click();
        await driver.sleep(500);
        await driver.findElement(By.xpath('//*[@id="vue-app"]/header/div/div[1]/div[5]/div[1]/div/div/div/form/div/div[1]/input')).click();
        await driver.findElement(By.xpath('//*[@id="vue-app"]/header/div/div[1]/div[5]/div[1]/div/div/div/form/div/div[1]/input')).sendKeys(string);
        await driver.findElement(By.xpath('//*[@id="vue-app"]/header/div/div[1]/div[5]/div[1]/div/div/div/form/div/div[2]/button')).click();

        //Verify link and that string is present
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/search.en.html');
        let searchParam = '?q=' + string;
        expect(currentUrl).toContain(searchParam);
        let control = await driver.findElement(By.css('.-vih-heading > .h5')).getText();
        control = control.toLowerCase();
        expect(control).toBe(string);
    })
})

/*
*       Section number:                               SECTION 10
*       Section descrition:                           Notifications
*       Section Test Cases:                           NTF_1, NTF_2, NTF_3, NTF_4
*/

describe('Notifications', () => {

    //As a logged-out user I can find the Channels and Models tabs inside the Notifications tab
    test('NTF_1', async () => {
        //Click on notifications button and verify Channels and Models can be found and are clickable
        //We can verify that the tabs are clickable by declaring a variable with the specific WebElement
        //After clicking on the other tab, the one we declared will lose the 'txt-active' class and so that means it will be a different element
        await driver.sleep(500);
        await driver.findElement(By.css('.box-notifications')).click();
        let activeTabs = await driver.findElements(By.css('.tabs-left > .tab'));
        let firstElementClass = await activeTabs[0].getAttribute('class');
        let secondElementClass = await activeTabs[1].getAttribute('class');
        expect(firstElementClass).toContain('tab-active');
        expect(secondElementClass).not.toContain('tab-active');

        //Click on second tab and verify the same as above but for the other element
        await activeTabs[1].click();
        activeTabs = await driver.findElements(By.css('.tabs-left > .tab'));
        firstElementClass = await activeTabs[0].getAttribute('class');
        secondElementClass = await activeTabs[1].getAttribute('class');
        expect(firstElementClass).not.toContain('tab-active');
        expect(secondElementClass).toContain('tab-active');
    })

    //As a guest user inside the Channels tab I can find the latest releases (each scene has a preview)
    test('NTF_2', async () => {
        //Click on notifications button
        await driver.findElement(By.css('.box-notifications')).click();

        //Create array with videos displayed in the active tab
        //By doing this we are implicitly verifying videos are displayed (the test case is failed automatically if Selenium can't find videos)
        let videoCards = await driver.findElements(By.css('.-gc-vc-inner-top'));

        //Define actions
        const actions = driver.actions({async: true});

        //Create for loop and hover mouse on each videoCard
        for(let i = 0; i < videoCards.length; i++){
            //Mouse hover event
            await actions.move({origin: videoCards[i]}).perform();

            await driver.sleep(1000);

            //Verify preview is present
            await driver.wait(until.elementIsVisible(await driver.findElement(By.css('.global-preview'))), 3000);
        }
    })

    //As a guest user inside the Models tab I can find a selection of models with recent activity on the site
    test('NTF_3', async () => {
        //Click on notifications button
        await driver.findElement(By.css('.box-notifications')).click();

        //Click on the inactive tab and verify 7 pornstar cards are present
        await driver.findElement(By.css('.tab:not(.tab-active)')).click();
        let pornstarCards = await driver.findElements(By.css('.background-cover'));
        expect(pornstarCards.length).toBe(7);
    })

    //As a guest user I can find Create Account, Sign In buttons on the bottom of the dropdown menu, below the scenes \ models
    test('NTF_4', async () => {
        //Click on notifications button
        await driver.findElement(By.css('.box-notifications')).click();

        //Click on CREATE NEW ACCOUNT and verify link
        await driver.findElement(By.css('.button-intro-left')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('sign-up.en.html');

        //Navigate back and click on notifictaions button
        await driver.navigate().back();
        await driver.findElement(By.css('.box-notifications')).click();

        //Click on SIGN IN and verify link
        await driver.findElement(By.css('.button-intro-right')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('sign-in.en.html');
    })
})

/*
*       Section number:                               SECTION 11
*       Section descrition:                           Sign Up
*       Section Test Cases:                           SUR_1
*/

describe('Sign Up', () => {

    //As an user I can find the Sign Up / Upgrade button in the header.
    //Selecting it, will send me to the accounts page where I can add my credentials and select the payment plan I want to opt for
    test('SUR_1', async () => {
        //Click on SIGN UP and verify link
        await driver.findElement(By.css('.btn-join-guest')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('sign-up.en.html');

        //Verify email and password fields are present
        await driver.findElement(By.id('input-register-email'));
        await driver.findElement(By.id('3'));

        //Create array with payment methods and verify their number
        let paymentMethods = await driver.findElements(By.css('.-suf-payment-span'));
        expect(paymentMethods.length).toBe(3);

        //Verify number of plans and type of plans
        const paymentPlans = await driver.findElements(By.css('.-suf-plan-heading'));
        const controlPlans = ['12 Months', '1 Month', '2 Days Trial', 'Mega Pass'];
        for(let i = 0; i < paymentPlans.length; i++){
            expect(await paymentPlans[i].getText()).toBe(controlPlans[i]);
        }
    })
})

/*
*       Section number:                               SECTION 12
*       Section descrition:                           Login
*       Section Test Cases:                           LL_1
*/

describe('Login', () => {

    //As a guest user, logging in from a specific page will log me in on the same page
    test('LL_1', async () => {
        //Create array with all videos and click on a random one
        const videoCards = await driver.findElements(By.css('.global-video-card'));
        const randomIndex = Math.floor(Math.random() * videoCards.length);
        await videoCards[randomIndex].click();

        //Remember link
        let controlUrl = await driver.getCurrentUrl();

        //Login on premiumtest1@test.com
        await driver.findElement(By.css('.box-account')).click();
        await driver.findElement(By.id('input-signin-email')).click();
        await driver.findElement(By.id('input-signin-email')).sendKeys('premiumtest1@test.com');
        await driver.findElement(By.id('input-signin-password')).click();
        await driver.findElement(By.id('input-signin-password')).sendKeys('123456');
        await driver.sleep(500);
        await driver.findElement(By.css('.button-login')).click();

        //Wait until MP bar is located
        await driver.wait(until.elementLocated(By.css('.market-header')), 30000);
        
        //Click on CONTINUE TO LETSDOEIT and verify link
        await driver.findElement(By.linkText('CONTINUE TO LETSDOEIT')).click();
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(controlUrl);
    })
})

/*
*       Section number:                               SECTION 13
*       Section descrition:                           Footer
*       Section Test Cases:                           FT_1, FT_2, FT_3, FT_4, FT_5, FT_8, FT_9, FT_10, FT_11, FT_12, FT_13
*/

describe('Footer', () => {

    //As an user I can find the logo at all times into the footer
    test('FT_1', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Verify logo is present
        await driver.findElement(By.css('.-footer .main-logo-letsdoeit'));
    })

    //Below the footer logo I can find the following label links into the footer: RTA / ASACP (clicking each should take me to the respective websites)
    test('FT_2', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with RTA and ASACP buttons
        const legalLinks = await driver.findElements(By.css('.footer-legal-link'));

        //Get parent window handle
        const parentHandle = await driver.getWindowHandle();

        //--------------------- RTA ----------------------

        //Click on first legal link
        await legalLinks[0].click();
        await driver.sleep(1000);

        await changeTab(parentHandle);

        //Verify link
        await driver.sleep(1000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe('https://www.rtalabel.org/');

        await closeTab(parentHandle);

        //--------------------- ASACP ----------------------

        //Click on second legal link
        await legalLinks[1].click();
        await driver.sleep(1000);

        await changeTab(parentHandle);

        //Verify link
        await driver.sleep(1000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe('https://www.asacp.org/index.html?content=aboutus');

        await closeTab(parentHandle);
    })

    //As an user I can find in the footer the following lists: Information/Account/Partners/Follow Us
    test('FT_3', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Verify sections are present
        const footerSections = await driver.findElements(By.css('.-f-links > .-f-links-heading'));
        const controlSections = ['INFORMATION', 'ACCOUNT', 'PARTNERS', 'FOLLOW US'];
        for(let i = 1; i < footerSections.length; i++){
            expect(await footerSections[i].getText()).toBe(controlSections[i]);
        }
    })

    //In the Information tab, I can find: DMCA/Privacy/Terms/About/Content removal/ Trust and Safety (clicking each should take me to the respective pages)
    test('FT_4', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with links and control links
        let footerLinks = await driver.findElements(By.css('.-f-links:nth-child(2) > a'));
        const footerControlLinks = [
            'https://letsdoeit.com/pages/copyright.en.html',
            'https://letsdoeit.com/pages/privacy.en.html',
            'https://letsdoeit.com/pages/terms.en.html',
            'https://letsdoeit.com/pages/about.en.html',
            'https://letsdoeit.com/pages/content-removal.en.html',
            'https://letsdoeit.com/pages/trust-safety.en.html',
        ];

        //Use a for loop to execute same statements for each link
        for(let i = 0; i < footerLinks.length; i++){
            
            //Repopulate footerLinks array
            footerLinks = await driver.findElements(By.css('.-f-links:nth-child(2) > a'));

            //Click on nth link
            await footerLinks[i].click();

            //Verify link
            currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe(footerControlLinks[i]);

            //Go back to last page
            await driver.navigate().back();
            await driver.sleep(1000);
        }
    })

    //In the Account tab, I can find: Create Account/Log in/FAQs/Support for guest users (clicking each should take me to the respective pages)
    test('FT_5', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with links and control links
        let footerLinks = await driver.findElements(By.css('.-f-links:nth-child(3) > a'));
        const footerControlLinks = [
            'https://letsdoeit.com/sign-up.en.html',
            'https://letsdoeit.com/sign-in.en.html',
            'https://letsdoeit.com/pages/faq.en.html',
            'https://letsdoeit.com/pages/support.en.html',
        ];

        //Use a for loop to execute same statements for each link
        for(let i = 0; i < footerLinks.length; i++){
            
            //Repopulate footerLinks array
            footerLinks = await driver.findElements(By.css('.-f-links:nth-child(3) > a'));

            //Click on nth link
            await footerLinks[i].click();

            //Verify link
            currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe(footerControlLinks[i]);

            //Go back to last page
            await driver.navigate().back();
            await driver.sleep(1000);
        }
    })

    //In the Partners tab, I can find the Affiliate and Production links (clicking each should take me to the respective pages)
    test('FT_8', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with Affiliates and Production buttons
        const partnerLinks = await driver.findElements(By.css('.-f-links:nth-child(4) > a'));

        //Get parent window handle
        const parentHandle = await driver.getWindowHandle();

        // ---------------------- Affiliates ----------------------

        //Click on Affiliate Program
        await partnerLinks[0].click();
        await driver.sleep(1000);
        
        await changeTab(parentHandle);

        //Verify link
        await driver.sleep(1000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe('https://doe.cash/');

        await closeTab(parentHandle);

        // ---------------------- Production ----------------------

        //Click on Production link
        await partnerLinks[1].click();
        await driver.sleep(1000);
        
        await changeTab(parentHandle);

        //Verify link
        await driver.sleep(1000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe('https://letsdoeitteam.com/');

        await closeTab(parentHandle);
    })

    //In the Follow Us tab, I can find the links to Twitter/Instagram/Youtube (clicking each should take me to the respective pages)
    test('FT_9', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with social links
        const socialLinks = await driver.findElements(By.css('.-f-links:nth-child(5) > a'));

        //Get parent window handle
        const parentHandle = await driver.getWindowHandle();

        // ------------ Twitter ------------

        //Click on twitter link
        await socialLinks[0].click();
        await driver.sleep(1000);

        await changeTab(parentHandle);

        //Verify link
        await driver.sleep(1000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('https://twitter.com/');
        expect(currentUrl).toContain('letsdoe');

        await closeTab(parentHandle);

        // ----------- Instagram ------------

        //Click on instagram link
        await socialLinks[1].click();
        await driver.sleep(1000);

        await changeTab(parentHandle);

        //Verify link
        await driver.sleep(1000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('https://www.instagram.com/');
        expect(currentUrl).toContain('letsdoeit');

        await closeTab(parentHandle);

        // ----------- YouTube ------------

        //Click on youtube link
        await socialLinks[2].click();
        await driver.sleep(1000);

        await changeTab(parentHandle);

        //Verify link
        await driver.sleep(1000);
        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('youtube.com/');

        await closeTab(parentHandle);
    })

    //In the footer I can find a description of LDI
    test('FT_10', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Find network description
        await driver.findElement(By.css('.-f-network-phrase'));
    })

    //Below the description, I can find information about the company (Name / Address etc)
    test('FT_11', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with addresses and a control array
        const addresses = await driver.findElements(By.css('.-f-address'));
        const controlAddresses = [
            'ALL 4 HEALTH SRL, Natiunile Unite Boulevard, no 4, Building 107 A, 9th floor, 050121 Bucharest, Romania',
            'MIDUS HOLDINGS INC, 5944 Coral Ridge Drive #247, Coral Springs, Florida 33076, USA'
        ]

        //Verify addresses
        expect(await addresses[0].getText()).toBe(controlAddresses[0]);
        expect(await addresses[1].getText()).toBe(controlAddresses[1]);
    })

    //Below the description, I can find the links for Epoch/Segpay/Vendo/2000Charge/Centrobill
    test('FT_12', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with vendor links
        const vendors = await driver.findElements(By.css('.-f-billing > a[target]'));

        //Get parent handle
        const parentHandle = await driver.getWindowHandle();

        //Create array with vendor links for validation
        const controlVendors = [
            'https://secure.vend-o.com/customers/profile/login/',
            'https://epoch.com/billing_support/find_purchase',
            'https://cs.segpay.com/',
            'https://2000charge.com/support/consumer-support.html',
            'https://centrohelp.com/'
        ]

        //Click each vendor and verify link
        for(let i = 0; i < vendors.length; i++){
            //Click each vendor
            await vendors[i].click();
            await driver.sleep(1000);

            await changeTab(parentHandle);

            //Verify link
            await driver.sleep(1000);
            currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe(controlVendors[i]);

            await closeTab(parentHandle);
        }
    })

    //Below the billing links, I can find a language bar with 5 most commonly used languages displayed and a More button
    test('FT_13', async () => {
        //Scroll to bottom of the page
        await driver.executeScript("window.scroll({ top: 5000, left: 0, behavior: 'smooth'});");
        await driver.sleep(1500);

        //Create array with all languages and verify there are 5 of them
        const languages = await driver.findElements(By.css('.-f-languages-a[lang]'));
        expect(languages.length).toBe(5);

        //Verify MORE button is present
        await driver.findElement(By.css('.-f-languages-a > .vue-portal-target'));
    })
})