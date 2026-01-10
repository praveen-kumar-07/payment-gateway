/* -------- VPA VALIDATION -------- */
export function isValidVPA(vpa) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(vpa);
}

/* -------- LUHN ALGORITHM -------- */
export function isValidCard(number) {
  const digits = number.replace(/[\s-]/g, "");
  if (!/^\d{13,19}$/.test(digits)) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);

    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }

    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

/* -------- CARD NETWORK -------- */
export function detectNetwork(number) {
  if (/^4/.test(number)) return "visa";
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^3[47]/.test(number)) return "amex";
  if (/^(60|65|8[1-9])/.test(number)) return "rupay";
  return "unknown";
}

/* -------- EXPIRY DATE -------- */
export function isValidExpiry(mm, yy) {
  const month = parseInt(mm, 10);
  let year = parseInt(yy, 10);

  if (month < 1 || month > 12) return false;
  if (yy.length === 2) year += 2000;

  const now = new Date();
  const expiry = new Date(year, month - 1, 1);
  const current = new Date(now.getFullYear(), now.getMonth(), 1);

  return expiry >= current;
}
