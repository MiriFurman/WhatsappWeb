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

  getConversationListItemTextAtIndex(index) {
    return $$('[data-hook="conversation-item"]').get(index).getText();
  }

  clickContactAtIndex(index) {
    return $$('[data-hook="contact-item"]').get(index).click();
  }

  async waitForElement(datahook) {
    await browser.wait(EC.presenceOf($(`[data-hook=${datahook}]`)));
  }


  async login(username) {
    const loginInput = await this.getInput('login-username');
    await loginInput.enterText(username);
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
    const loginInput = await this.getInput('input-msg');
    await loginInput.enterText(msg);
    const loginButton = await this.getButton('send-msg');
    await loginButton.click();
  }

}
