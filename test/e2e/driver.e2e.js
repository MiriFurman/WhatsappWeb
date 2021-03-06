import {app} from './../environment';
import {
  inputTestkitFactory,
  buttonTestkitFactory,
  textTestkitFactory
} from 'wix-style-react/dist/testkit/protractor';
import {ExpectedConditions as EC} from 'protractor';

import * as dh from '../../src/components/MessageBubble/MessageBubbleDataHooks';

export default class AppDriver {

  getInput(dataHook) {
    return inputTestkitFactory({dataHook});
  }

  getButton(dataHook) {
    return buttonTestkitFactory({dataHook});
  }

  getText(dataHook) {
    return textTestkitFactory({dataHook});
  }

  isLoginScreenPresent() {
    return $('[data-hook="login-screen"]').isPresent();
  }

  navigate(url = '/') {
    return browser.get(app.getUrl(url));
  }

  getUserNameElementText() {
    return $('[data-hook="username"]').getText();
  }

  getUserToolbarImage() {
    const actualImgSrc = $('[data-hook="toolbar-gravatar"]').getAttribute('src');
    return actualImgSrc;
  }

  getConversationWindowImage() {
    const actualImgSrc = $('[data-hook="conversation-window-gravatar-image"]').getAttribute('src');
    return actualImgSrc;
  }

  isConversationWindowDisplayNamePresent() {
    return $('[data-hook="conversation-window-display-name"]').isPresent();
  }

  getConversationWindowDisplayName() {
    const name = $('[data-hook="conversation-window-display-name"]').getText();
    return name;
  }

  isUserNameElementPresent() {
    return $('[data-hook="username"]').isPresent();
  }

  isContactListCntDisplayed() {
    return $('[data-hook="contact-list"]').isDisplayed();
  }

  getContactListItemTextAtIndex(index) {
    return $$('[data-hook="contact-item"]').get(index).getText();
  }

  getAllContactsNames() {
    return $$('[data-hook="contact-item"]').map(contact => contact.getText());
  }

  getConversationListItemSenderAtIndex(index) {
    return $$('[data-hook="conversation-display-name"]').get(index).getText();
  }

  clickContactAtIndex(index) {
    return $$('[data-hook="contact-item"]').get(index).click();
  }

  clickConversationAtIndex(index) {
    return $$('[data-hook="conversation-item"]').get(index).click();
  }

  async waitForElement(datahook) {
    await browser.wait(EC.presenceOf($(`[data-hook=${datahook}]`)));
  }


  async login({username, password}) {
    const loginInput = await this.getInput('login-username');
    await loginInput.enterText(username);
    const passwordInput = await this.getInput('login-password');
    await passwordInput.enterText(password);
    const loginButton = await this.getButton('login-btn');
    await loginButton.click();
    return browser.wait(EC.presenceOf($('[data-hook="username"]')));

  }

  async startNewConversation(user1, user2, msg) {
    await this.navigate();
    await this.login(user1);
    await this.navigate();
    await this.login(user2);
    await this.clickContactAtIndex(0);
    return this.sendMessage(msg);
  }

  async clickAtContactAndSendMsgAt(contactIdx, msg) {
    await this.waitForElement('contact-item');
    await this.clickContactAtIndex(contactIdx);
    return this.sendMessage(msg);
  }


  getMessagesFromSelectedConversation() {
    return $$('[data-hook="msg-item"]').map(msg => msg.getText());
  }

  getMessageFromSelectedConversation(index) {
    return $$('[data-hook="msg-item"]').get(index).getText();
  }

  getMessageFromSelectedConversationAt(index) {
    return $$('[data-hook="msg-item"]').get(index).getText();
  }

  getDisplayedMessageTime(index) {
    return $$(`[data-hook="${dh.Time}"]`).get(index).getText();
  }

  async sendMessage(msg) {
    await browser.wait(EC.presenceOf($('[data-hook="input-msg"]')));
    const inputMsg = $('[data-hook="input-msg"]');
    await inputMsg.sendKeys(msg);
    return inputMsg.sendKeys(protractor.Key.ENTER);
  }

  waitForSignupToBePresent() {
    return browser.wait(EC.presenceOf($('[data-hook="signup-heading"]')));
  }

  clickSignup() {
    return $('[data-hook="signup-link"]').click();
  }

  async signup(signupDetails) {
    await this.fillValues(signupDetails);
    const signupBtn = await this.getButton('signup-btn');
    return signupBtn.click();
  }

  async fillValues({username, password}) {
    const usernameInput = await this.getInput('signup-username');
    const passwordInput = await this.getInput('signup-password');
    const verifyInput = await this.getInput('signup-verify-password');
    await usernameInput.enterText(username);
    await passwordInput.enterText(password);
    return verifyInput.enterText(password);
  }

  async clickButtonByDataHook(dataHook) {
    const button = await this.getButton(dataHook);
    return button.click();
  }

  async enterInputTextByDataHook(dataHook, text) {
    const input = await this.getInput(dataHook);
    return input.enterText(text);
  }

}
