function isMobile() {
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

export { isMobile }