import {app} from './../environment';
import {
  inputTestkitFactory,
  buttonTestkitFactory,
  waitForVisibilityOf
} from 'wix-style-react/dist/testkit/protractor';

export function isLoginScreenPresent() {
  return $('[data-hook="login-screen"]').isPresent();
}

export const navigate = (url = '/') => browser.get(app.getUrl(url));

export function getUserNameElement() {
  return $('[data-hook="username"]');
}


export async function login(username) {
  await navigate();
  const userInput = inputTestkitFactory({dataHook: 'login-username'});
  const loginButton = buttonTestkitFactory({dataHook: 'login-btn'});
  await userInput.enterText(username);
  await loginButton.click();
}

export function getContactAtIndex(index) {
  return $$('[data-hook="contact-item"]').get(index);
}

export async function startNewConversation(user1, user2, msg) {
  await login(user1);
  await login(user2);
  await getContactAtIndex(0).click();
  const msgInput = inputTestkitFactory({dataHook: 'input-msg'});
  const sendButton = buttonTestkitFactory({dataHook: 'send-msg'});
  await waitForVisibilityOf(msgInput.element(), 'Cannot find msg Input');
  msgInput.enterText(msg);
  sendButton.click();
}
