import 'babel-polyfill';
import {expect} from 'chai';
import {beforeAndAfter} from './../environment';
import * as driver from './e2e.driver';
import {ExpectedConditions as EC} from 'protractor';

describe('Wazzap E2E tests', () => {

  beforeAndAfter();
  const user1 = 'Donald';
  const user2 = 'Ivanka';
  const msg = 'lets make America great again!';

  it('should login to app', async () => {
    await driver.navigate();
    expect(await driver.isLoginScreenPresent()).to.equal(true);
    expect(await driver.getUserNameElement().isPresent()).to.equal(false);
    await driver.login(user1);
    expect(await driver.getUserNameElement().getText()).to.equal(user1);
    expect(await driver.isLoginScreenPresent()).to.equal(false);
  });

  it('should show contacts list on login', async () => {
    await driver.navigate();
    await driver.login(user1);
    expect(await driver.getContactListCnt().isDisplayed(), 'Contact list invisible').to.equal(false);
    await driver.navigate();
    await driver.login(user2);
    expect(await driver.getContactListCnt().isDisplayed(), 'Contact list visible').to.equal(true);
    expect(await driver.getContactListItems().map(el => el.getText())).to.eql([user1]);
  });

  it('should move item from contacts to conversions on first message', async () => {
    await driver.startNewConversation(user1, user2, msg);
    await driver.navigate();
    await driver.login(user2);
    await browser.wait(EC.presenceOf(driver.getConversationListItem()));
    expect(await driver.getAllConversationListItems().map(el => el.getText())).to.eql([user1]);
  });
});
