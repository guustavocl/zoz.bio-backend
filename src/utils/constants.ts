export const MIN_LENGTH_MSG = (label: string, minimum = 1) => {
  return `${label} should have at least ${minimum} character${minimum > 1 ? "s" : ""}`;
};

export const MAX_LENGTH_MSG = (label: string, max: number) => {
  return `${label} should have a maximum of ${max} characters or less.`;
};

export const CONFIRMATION_MAIL_TEXT = (url: string) => {
  return `Confirm Your Email Address
  Enter the following link to confirm your email address. ${url}
  If you didn't create an account with zoz.bio, you can safely delete this email.`;
};
