const validatePassword = (password: string) => {
  // calculating the length
  const length_error = password.length < 8;
  // searching for digits
  const digit_error = password.search(/\d/) === -1;
  // searching for uppercase
  const uppercase_error = password.search(/[A-Z]/) === -1;
  // searching for lowercase
  const lowercase_error = password.search(/[a-z]/) === -1;
  // searching for symbols
  const symbol_error =
    password.search(/[@ !#$%&'()*+,-./[\\\]^_`{|}~"]/) === -1;
  // overall result
  const password_ok = !(
    length_error ||
    digit_error ||
    uppercase_error ||
    lowercase_error ||
    symbol_error
  );

  return password_ok;
};

export { validatePassword };
