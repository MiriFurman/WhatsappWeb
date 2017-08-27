import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter, app} from './../environment';
import {inputTestkitFactory, buttonTestkitFactory, waitForVisibilityOf} from 'wix-style-react/dist/testkit/protractor';
import * as driver from './e2e.driver';

describe('Wazzap E2E tests', () => {

  beforeAndAfter();
  const user1 = 'Donald';

  it('should login to app', async () => {
    await browser.get(app.getUrl('/'));
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


});


