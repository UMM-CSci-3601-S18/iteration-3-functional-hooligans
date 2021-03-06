import {GoalPage} from './goals.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    // origFn.call(browser.driver.controlFlow(), function () {
    //     return protractor.promise.delayed(100);
    // });

    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Tests all functionality that the goals page provides: from viewing pre-existing goals to adding a new goal to completing/deleting a goal', () => {
    let page: GoalPage;

    beforeEach(() => {
        page = new GoalPage();
    });

    it('Should add a goal.', () => {
        GoalPage.navigateTo();
        expect(page.testAddNewGoal("Go to bed early", "To sleep more")).toBeTruthy();
    });

    it('Should view a goal.', () => {
        GoalPage.navigateTo();
        expect(page.getUniqueGoal()).toBe('Go to bed earlier');
    });

    it('Should click complete button on goal and then click complete tab.', () => {
        GoalPage.navigateTo();
        page.clickComplete();
        page.clickCompleteTab();
    });

    it('Should click delete button on goal.', () => {
        GoalPage.navigateTo();
        page.clickDelete();
    });
});
