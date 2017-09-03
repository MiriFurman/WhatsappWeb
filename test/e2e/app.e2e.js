import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter, app} from './../environment';
import AppDriver from './e2e.driver';
import wrap from 'lodash/wrap';
import {FLUSH, SIGNUP} from '../../src/common/endpoints';
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
  const user1 = {username: 'Donald', password: '111'};
  const user2 = {username: 'Ivanka', password: '222'};
  const msg = 'lets make America great again!';
  const msg2 = 'Winning!!!';
  let firstWindowDriver, secondWindowDriver;

  before(async () => {
    await browser.executeScript(`window.otherWindow = window.open("${app.getUrl('/')}", "_blank", "width=400,height=400")`);
  });

  beforeEach(async () => {
    const [firstWindow, secondWindow] = await browser.getAllWindowHandles();
    firstWindowDriver = createWindowDriver(firstWindow);
    secondWindowDriver = createWindowDriver(secondWindow);
    await firstWindowDriver.navigate();
    await secondWindowDriver.navigate();
    await axios.post(app.getUrl(FLUSH));
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await axios.post(app.getUrl(SIGNUP), {user: user2});
  });

  it('should login to app', async () => {
    await firstWindowDriver.navigate();
    expect(await firstWindowDriver.isLoginScreenPresent()).to.equal(true);
    expect(await firstWindowDriver.isUserNameElementPresent()).to.equal(false);
    await firstWindowDriver.login(user1);
    expect(await firstWindowDriver.getUserNameElementText()).to.equal(user1.username);
    expect(await firstWindowDriver.isLoginScreenPresent()).to.equal(false);
  });

  it.skip('should show contacts list on login', async () => {
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    expect(await firstWindowDriver.isContactListCntDisplayed(), 'Contact list invisible').to.equal(false);

    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);

    expect(await firstWindowDriver.isContactListCntDisplayed(), 'Contact list visible').to.equal(true);
    expect(await firstWindowDriver.getContactListItemTextAtIndex(0)).to.equal(user1.username);
  });

  it('should move item from contacts to conversions on first message and remove him from contacts', async () => {
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);
    await firstWindowDriver.waitForElement('conversation-item');
    expect(await firstWindowDriver.getConversationListItemSenderAtIndex(0)).to.equal(user1.username);
    expect(await firstWindowDriver.getAllContactsNames()).to.eql([]);
  });

  it('should display a message that was send from user1 to user2', async () => {
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);
    await firstWindowDriver.waitForElement('conversation-item');
    await firstWindowDriver.clickConversationAtIndex(0);
    expect(await firstWindowDriver.getMessageFromSelectedConversation(0)).to.equal(msg);
  });

  it('should send message to existing conversation', async () => {
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);
    await firstWindowDriver.waitForElement('conversation-item');
    await firstWindowDriver.clickConversationAtIndex(0);
    await firstWindowDriver.sendMessage(msg2);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    await firstWindowDriver.clickConversationAtIndex(0);
    expect(await firstWindowDriver.getMessageFromSelectedConversation(1)).to.equal(msg2);
  });

  it('should send a message and show it on both screen without refreshing', async () => {
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    await secondWindowDriver.navigate();
    await secondWindowDriver.login(user2);
    await firstWindowDriver.clickAtContactAndSendMsgAt(0, msg);
    await secondWindowDriver.waitForElement('conversation-item');
    await secondWindowDriver.clickConversationAtIndex(0);
    await secondWindowDriver.sendMessage(msg2);
    await firstWindowDriver.waitForElement('conversation-item');
    await firstWindowDriver.clickConversationAtIndex(0);
    await firstWindowDriver.waitForElement('msg-item');
    expect(await firstWindowDriver.getMessageFromSelectedConversation(1)).to.equal(msg2);
  });

  it('should remove current conversation when click on new contact', async () => {
    const user3 = {username: 'Moshe', password: '12345'};
    await axios.post(app.getUrl(SIGNUP), {user: user3});
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    await secondWindowDriver.navigate();
    await secondWindowDriver.login(user2);
    await firstWindowDriver.clickAtContactAndSendMsgAt(0, msg);
    await secondWindowDriver.waitForElement('conversation-item');
    await secondWindowDriver.clickConversationAtIndex(0);
    await secondWindowDriver.sendMessage(msg2);
    await firstWindowDriver.waitForElement('conversation-item');
    await firstWindowDriver.clickConversationAtIndex(0);
    await firstWindowDriver.waitForElement('msg-item');
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user3);
    await secondWindowDriver.waitForElement('contact-item');
    await secondWindowDriver.clickContactAtIndex(0);
    expect(await secondWindowDriver.getMessagesFromSelectedConversation()).to.eql([]);
  });
  it.skip('should sign up and redirected to login page', async () => {
    const signupObject = {
      username: 'Eden Ben Zaken',
      password: 'queenOfRoses'
    };
    await firstWindowDriver.navigate();
    expect(await firstWindowDriver.isLoginScreenPresent(), 'should show login screen at the beginning').to.equal(true);
    await firstWindowDriver.clickSignup();
    expect(await firstWindowDriver.isLoginScreenPresent(), 'should not show login screen after clicking signup').to.equal(false);
    await firstWindowDriver.signup(signupObject);
    expect(await firstWindowDriver.isLoginScreenPresent(), 'should  show login screen after signing up').to.equal(true);
  });

});
