import {app} from './../environment';
import {
  inputTestkitFactory,
  buttonTestkitFactory,
} from 'wix-style-react/dist/testkit/protractor';
import {ExpectedConditions as EC} from 'protractor';

const getInput = dataHook => inputTestkitFactory({dataHook});
const getButton = dataHook => buttonTestkitFactory({dataHook});

export function isLoginScreenPresent() {
  return $('[data-hook="login-screen"]').isPresent();
}

export const navigate = (url = '/') => browser.get(app.getUrl(url));

export function getUserNameElement() {
  return $('[data-hook="username"]');
}

export function getContactListCnt() {
  return $('[data-hook="contact-list"]');
}

export function getContactListItems() {
  return $$('[data-hook="contact-item"]');
}

export function getConversationListItem() {
  return $('[data-hook="conversation-item"]');
}

export function getAllConversationListItems() {
  return $$('[data-hook="conversation-item"]');
}


export async function login(username) {
  await getInput('login-username').enterText(username);
  await getButton('login-btn').click();
  return browser.wait(EC.presenceOf($('[data-hook="username"]')));

}

export function getContactAtIndex(index) {
  return $$('[data-hook="contact-item"]').get(index);
}

export async function startNewConversation(user1, user2, msg) {
  await navigate();
  await login(user1);
  await navigate();
  await login(user2);
  await getContactAtIndex(0).click();
  await getInput('input-msg').enterText(msg);
  await getButton('send-msg').click();
}
