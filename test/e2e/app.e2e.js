import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter, app} from './../environment';
import {inputTestkitFactory, buttonTestkitFactory, waitForVisibilityOf} from 'wix-style-react/dist/testkit/protractor';
describe('Wazzap E2E tests', () => {

  beforeAndAfter();
  const user1 = 'Donald';
  it('should login to app', async () => {
    await browser.get(app.getUrl('/'));
    const userInput = inputTestkitFactory({dataHook: 'login-username'});
    await waitForVisibilityOf(userInput.element(), 'Cannot find Input');
    expect(await userInput.element().isDisplayed()).to.equal(true);
    await userInput.enterText(user1);
    const loginButton = buttonTestkitFactory({dataHook: 'login-btn'});
    expect(await $('[data-hook="username"]').isPresent()).to.be.false;
    await loginButton.click();
    expect(await $('[data-hook="username"]').getText()).to.equal(user1);
  });


});


