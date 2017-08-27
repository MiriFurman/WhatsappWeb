export function isLoginScreenPresent() {
  return $('[data-hook="login-screen"]').isPresent();
}

export function getUserNameElement() {
  return $('[data-hook="username"]');
}
