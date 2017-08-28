import {app} from './../environment';
import {
  inputTestkitFactory,
  buttonTestkitFactory,
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
