import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter, app} from './../environment';
import AppDriver from './driver.e2e';
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
  let firstWindowDriver, secondWindowDriver, thirdWindowDriver;

  before(async () => {
    await browser.executeScript(`window.otherWindow = window.open("${app.getUrl('/')}", "_blank", "width=1280,height=800")`);
    await browser.executeScript(`window.otherWindow = window.open("${app.getUrl('/')}", "_blank", "width=400,height=400")`);
  });

  beforeEach(async () => {
    const [firstWindow, secondWindow, thirdWindow] = await browser.getAllWindowHandles();
    firstWindowDriver = createWindowDriver(firstWindow);
    secondWindowDriver = createWindowDriver(secondWindow);
    thirdWindowDriver = createWindowDriver(thirdWindow);
    await firstWindowDriver.navigate();
    await secondWindowDriver.navigate();
    await thirdWindowDriver.navigate();
    await axios.post(app.getUrl(FLUSH));
  });

  it('should login to app', async () => {
    await firstWindowDriver.navigate();
    expect(await firstWindowDriver.isLoginScreenPresent()).to.equal(true);
    expect(await firstWindowDriver.isUserNameElementPresent()).to.equal(false);
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await firstWindowDriver.login(user1);
    expect(await firstWindowDriver.getUserNameElementText()).to.equal(user1.username);
    expect(await firstWindowDriver.isLoginScreenPresent()).to.equal(false);
  });

  it('should show contacts list on login', async () => {
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    expect(await firstWindowDriver.isContactListCntDisplayed(), 'Contact list invisible').to.equal(false);

    await firstWindowDriver.navigate();
    await axios.post(app.getUrl(SIGNUP), {user: user2});
    await firstWindowDriver.login(user2);

    expect(await firstWindowDriver.isContactListCntDisplayed(), 'Contact list visible').to.equal(true);
    expect(await firstWindowDriver.getContactListItemTextAtIndex(0)).to.equal(user1.username);
  });

  it('should move item from contacts to conversions on first message and remove him from contacts', async () => {
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await axios.post(app.getUrl(SIGNUP), {user: user2});
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);
    await firstWindowDriver.waitForElement('conversation-item');
    expect(await firstWindowDriver.getConversationListItemSenderAtIndex(0)).to.equal(user1.username);
    expect(await firstWindowDriver.getAllContactsNames()).to.eql([]);
  });

  it('should display a message that was send from user1 to user2', async () => {
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await axios.post(app.getUrl(SIGNUP), {user: user2});
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);
    await firstWindowDriver.waitForElement('conversation-item');
    await firstWindowDriver.clickConversationAtIndex(0);
    expect((await firstWindowDriver.getMessageFromSelectedConversation(0))).to.equal(msg);
  });

  it('should send message to existing conversation', async () => {
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await axios.post(app.getUrl(SIGNUP), {user: user2});
    await firstWindowDriver.startNewConversation(user1, user2, msg);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user2);
    await firstWindowDriver.waitForElement('conversation-item');
    await firstWindowDriver.clickConversationAtIndex(0);
    await firstWindowDriver.sendMessage(msg2);
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    await firstWindowDriver.clickConversationAtIndex(0);
    expect((await firstWindowDriver.getMessageFromSelectedConversation(1))).to.equal(msg2);
  });

  it('should send a message and show it on both screen without refreshing', async () => {
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await axios.post(app.getUrl(SIGNUP), {user: user2});
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
    expect((await firstWindowDriver.getMessageFromSelectedConversation(1))).to.equal(msg2);
  });

  it('should remove current conversation when click on new contact', async () => {
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await axios.post(app.getUrl(SIGNUP), {user: user2});
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

  it('should sign up w/o email and be redirected to login page', async () => {
    const signupObject = {
      username: 'Eden Ben Zaken',
      password: 'queenOfRoses'
    };
    await firstWindowDriver.navigate();
    expect(await firstWindowDriver.isLoginScreenPresent(), 'should show login screen at the beginning').to.equal(true);
    await firstWindowDriver.clickSignup();
    await firstWindowDriver.waitForSignupToBePresent();
    await firstWindowDriver.signup(signupObject);
    expect(await firstWindowDriver.isLoginScreenPresent(), 'should  show login screen after signing up').to.equal(true);
  });

  it('should sign up with email as username and display correct gravatar', async () => {
    const michaelswixGravatar = 'http://www.gravatar.com/avatar/2dd3b8058e68863cf9d1aff3f581eb17';
    const signupObject = {
      username: 'michaels@wix.com',
      password: 'mjs'
    };
    const loginObject = {
      username: signupObject.username,
      password: signupObject.password
    };
    await axios.post(app.getUrl(SIGNUP), {user: user2});

    await firstWindowDriver.navigate();
    expect(await firstWindowDriver.isLoginScreenPresent(), 'should show login screen at the beginning').to.equal(true);
    await firstWindowDriver.clickSignup();
    await firstWindowDriver.waitForSignupToBePresent();
    await firstWindowDriver.signup(signupObject);
    await firstWindowDriver.login(loginObject);
    await firstWindowDriver.isContactListCntDisplayed();

    await secondWindowDriver.startNewConversation(loginObject, user2, msg);

    await new Promise(resolve => setTimeout(resolve, 2000));
    await firstWindowDriver.clickConversationAtIndex(0);
    await secondWindowDriver.clickConversationAtIndex(0);
    await new Promise(resolve => setTimeout(resolve, 2000));

    //check that gravatar user is seeing their own image, and the other user image
    await firstWindowDriver.clickConversationAtIndex(0);
    // await new Promise(resolve => setTimeout(resolve, 200000000));

    expect(await firstWindowDriver.getUserToolbarImage()).to.equal(michaelswixGravatar);
    expect(await firstWindowDriver.getConversationWindowImage()).to.equal('https://placeimg.com/60/60/animals');
    await firstWindowDriver.isConversationWindowDisplayNamePresent();
    expect(await firstWindowDriver.getConversationWindowDisplayName()).to.equal(user2.username);

    //check that non-gravatar user sees the generic image and the gravatar user's image
    await secondWindowDriver.clickConversationAtIndex(0);
    expect(await secondWindowDriver.getUserToolbarImage()).to.equal('https://placeimg.com/60/60/animals');
    expect(await secondWindowDriver.getConversationWindowImage()).to.equal(michaelswixGravatar);
    await secondWindowDriver.isConversationWindowDisplayNamePresent();
    expect(await secondWindowDriver.getConversationWindowDisplayName()).to.equal(loginObject.username);
  });

  it('should create group conversation', async () => {
    const user3 = {username: 'tomster@emberjs.com', password: '12345'};
    const groupName = 'The Mighty Trumps';
    await axios.post(app.getUrl(SIGNUP), {user: user1});
    await axios.post(app.getUrl(SIGNUP), {user: user2});
    await axios.post(app.getUrl(SIGNUP), {user: user3});
    await firstWindowDriver.navigate();
    await firstWindowDriver.login(user1);
    await secondWindowDriver.navigate();
    await secondWindowDriver.login(user2);
    await thirdWindowDriver.navigate();
    await thirdWindowDriver.login(user3);
    await firstWindowDriver.clickButtonByDataHook('create-group');
    await firstWindowDriver.waitForElement('input-group-name');
    await firstWindowDriver.enterInputTextByDataHook('input-group-name', groupName);
    await firstWindowDriver.clickContactAtIndex(0);
    await firstWindowDriver.clickContactAtIndex(0);
    await firstWindowDriver.clickButtonByDataHook('create-group-btn');
    await firstWindowDriver.waitForElement('conversation-display-name');
    await secondWindowDriver.waitForElement('conversation-display-name');
    await thirdWindowDriver.waitForElement('conversation-display-name');

    await firstWindowDriver.clickConversationAtIndex(0);
    await firstWindowDriver.sendMessage('I donal d');
    await secondWindowDriver.clickConversationAtIndex(0);
    await secondWindowDriver.sendMessage(`Good evening. Thank you. One year ago, I introduced my father when he declared his candidacy. In his own way, and through his own sheer force of will, he sacrificed greatly to enter the political arena as an outsider. And he prevailed against a field of 16 very talented competitors. (APPLAUSE) For more than a year, Donald Trump has been the people's champion, and tonight he's the people's nominee.
    (APPLAUSE)
    Like many of my fellow millenials, I do not consider myself categorically Republican or Democrat. More than party affiliation, I vote on based on what I believe is right, for my family and for my country. Sometimes it's a tough choice. That is not the case this time. As the proud daughter of your nominee, I am here to tell you that this is the moment and Donald Trump is the person to make America great again.`);
    await thirdWindowDriver.clickConversationAtIndex(0);

    expect(await thirdWindowDriver.getDisplayedMessageTime(0)).to.contain('Donald');
    // todo replace this test with a component test
    // expect(await firstWindowDriver.getDisplayedMessageTime(0)).to.not.contain('Donald');
  });
});
