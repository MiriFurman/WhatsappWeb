import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter, app} from './../environment';
import {inputTestkitFactory, waitForVisibilityOf} from 'wix-style-react/dist/testkit/protractor';
describe('Wazzap E2E tests', () => {

  beforeAndAfter();
  it('should have a login field', async () => {
    await browser.get(app.getUrl('/'));
    const userInput = inputTestkitFactory({dataHook: 'login-username'});
    await waitForVisibilityOf(userInput.element(), 'Cannot find Input');
    expect(await userInput.element().isDisplayed()).to.equal(true);
  });


});


