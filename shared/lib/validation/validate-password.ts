const MIN_PASSWORD_LENGTH = 8;

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    /[A-Za-zА-Яа-я]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-zА-Яа-я0-9]/.test(password)
  );
}
