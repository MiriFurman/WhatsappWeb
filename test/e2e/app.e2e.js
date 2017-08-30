import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter, app} from './../environment';
import AppDriver from './e2e.driver';
import wrap from 'lodash/wrap';
import {FLUSH} from '../../src/common/endpoints';
import axios from 'axios';

const createWindowDriver = windowHandle => {
  const driver = new AppDriver();
  const allMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(driver));
  allMethods.forEach(m => {
    if (typeof (driver[m]) === 'function') {
      driver[m] = wrap(driver[m], async (func, ...rest) => {
        await browser.switchTo().window(windowHandle);
        return func.apply(driver, rest);
      });
    }
  });

  return driver;
};


describe('Wazzap E2E tests', () => {

  beforeAndAfter();
  const user1 = 'Donald';
  const user2 = 'Ivanka';
  const msg = 'lets make America great again!';
  const msg2 = 'Winning!!!';
  let firstWindowDriver, secondWindowDriver;

  beforeEach(async () => {
    await browser.executeScript(`window.otherWindow = window.open("${app.getUrl('/')}", "_blank", "width=400,height=400")`);
    const [firstWindow, secondWindow] = await browser.getAllWindowHandles();
    firstWindowDriver = createWindowDriver(firstWindow);
    secondWindowDriver = createWindowDriver(secondWindow);
    await axios.post(app.getUrl(FLUSH));
  });

  it('should login to app', async () => {
    await firstWindowDriver.navigate();
    expect(await firstWindowDriver.isLoginScreenPresent()).to.equal(true);
    expect(await firstWindowDriver.isUserNameElementPresent()).to.equal(false);

    await firstWindowDriver.login(user1);

    expect(await firstWindowDriver.getUserNameElementText()).to.equal(user1);
    expect(await firstWindowDriver.isLoginScreenPresent()).to.equal(false);
  });

  it('should show contacts list on login', async () => {
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    expect(await firstWindowDriver.isContactListCntDisplayed(), 'Contact list invisible').to.equal(false);

    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);

    expect(await firstWindowDriver.isContactListCntDisplayed(), 'Contact list visible').to.equal(true);
    expect(await firstWindowDriver.getContactListItemTextAtIndex(0)).to.equal(user1);
  });

  it('should move item from contacts to conversions on first message', async () => {
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await secondWindowDriver.navigate();
    await secondWindowDriver.login(user2);
    await secondWindowDriver.waitForElement('conversation-item');
    expect(await secondWindowDriver.getConversationListItemTextAtIndex(0)).to.equal(user1);
  });

  it('should display a message that was send from user1 to user2', async () => {
    await firstWindowDriver.startNewConversation(user1, user2, 'bla');
    await secondWindowDriver.navigate();
    await secondWindowDriver.login(user2);
    await secondWindowDriver.waitForElement('conversation-item');
    await secondWindowDriver.clickConversationAtIndex(0);
    expect(await secondWindowDriver.getMessageFromSelectedConversation(0)).to.equal('bla');
  });

  it('should send message to existing conversation', async () => {
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await secondWindowDriver.navigate();
    await secondWindowDriver.login(user2);
    await secondWindowDriver.waitForElement('conversation-item');
    await secondWindowDriver.clickConversationAtIndex(0);
    await secondWindowDriver.sendMessage(msg2);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    await firstWindowDriver.clickConversationAtIndex(0);
    expect(await firstWindowDriver.getMessageFromSelectedConversation(1)).to.equal(msg2);

  });
});
