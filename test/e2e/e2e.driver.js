import {app} from './../environment';
import {
  inputTestkitFactory,
  buttonTestkitFactory,
} from 'wix-style-react/dist/testkit/protractor';
import {ExpectedConditions as EC} from 'protractor';

export default class AppDriver {

  getInput(dataHook) {
    return inputTestkitFactory({dataHook});
  }

  getButton(dataHook) {
    return buttonTestkitFactory({dataHook});
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

  getConversationListItemTextAtIndex(index) {
    return $$('[data-hook="conversation-item"]').get(index).getText();
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
    const inputMsg = await this.getInput('input-msg');
    await inputMsg.enterText(msg);
    await inputMsg.element().$('input').sendKeys(protractor.Key.ENTER);
  }

  async clickAtContactAndSendMsgAt(contactIdx, msg) {
    await this.waitForElement('contact-item');
    await this.clickContactAtIndex(contactIdx);
    const inputMsg = await this.getInput('input-msg');
    await inputMsg.enterText(msg);
    await inputMsg.element().$('input').sendKeys(protractor.Key.ENTER);
  }


  getMessagesFromSelectedConversation() {
    return $$('[data-hook="msg-item"]').map(msg => msg.getText());
  }

  getMessageFromSelectedConversation(index) {
    return $$('[data-hook="msg-item"]').get(index).getText();
  }

  async sendMessage(msg) {
    const msgInput = await this.getInput('input-msg');
    await msgInput.enterText(msg);
    await msgInput.element().$('input').sendKeys(protractor.Key.ENTER);
  }

  async isSignupScreenPresent() {
    await browser.wait(EC.visibilityOf($('[data-hook="signup-screen"]'), 1000));
    return $('[data-hook="signup-screen"]').isPresent();
  }

  clickSignup() {
    $('[data-hook="signup-link"]').click();
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
