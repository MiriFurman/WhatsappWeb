import {app} from './../environment';


export function isLoginScreenPresent() {
  return $('[data-hook="login-screen"]').isPresent();
}

export const navigate = (url = '/') => browser.get(app.getUrl(url));

export function getUserNameElement() {
  return $('[data-hook="username"]');
}
