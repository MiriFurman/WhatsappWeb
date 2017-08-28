import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter} from './../environment';
import {
  inputTestkitFactory,
  buttonTestkitFactory,
  waitForVisibilityOf
} from 'wix-style-react/dist/testkit/protractor';
import * as driver from './e2e.driver';

describe('Wazzap E2E tests', () => {

  beforeAndAfter();
  const user1 = 'Donald';
  const user2 = 'Ivanka';
  const msg = 'lets make America great again!';

  it('should login to app', async () => {
    await driver.navigate();
    const userInput = inputTestkitFactory({dataHook: 'login-username'});
    await waitForVisibilityOf(userInput.element(), 'Cannot find Input');
    expect(await userInput.element().isDisplayed()).to.equal(true);
    expect(await driver.isLoginScreenPresent()).to.be.true;

    await userInput.enterText(user1);
    const loginButton = buttonTestkitFactory({dataHook: 'login-btn'});
    expect(await driver.getUserNameElement().isPresent()).to.be.false;

    await loginButton.click();
    expect(await driver.getUserNameElement().getText()).to.equal(user1);
    expect(await driver.isLoginScreenPresent()).to.be.false;
  });

  it('should show contacts list on login', async () => {
    await driver.login(user1);
    expect(await $('[data-hook="contact-list"]').isDisplayed(), 'Contact list invisible').to.equal(false);
    await driver.login(user2);
    expect(await $('[data-hook="contact-list"]').isDisplayed(), 'Contact list visible').to.equal(true);
    expect(await $$('[data-hook="contact-item"]').map(el => el.getText())).to.eql([user1]);
  });

  it('should move item from contacts to conversions on first message', async () => {
    await driver.startNewConversation(user1, user2, msg);
    await driver.login(user2);
    expect(await $$('[data-hook="conversation-item"]').map(el => el.getText())).to.eql([user1]);
  });
});
