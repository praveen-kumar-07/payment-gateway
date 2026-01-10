export function isValidVPA(vpa) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(vpa);
}

export function luhn(card) {
  let sum = 0, alt = false;
  for (let i = card.length - 1; i >= 0; i--) {
    let n = Number(card[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function cardNetwork(card) {
  if (/^4/.test(card)) return "visa";
  if (/^5[1-5]/.test(card)) return "mastercard";
  if (/^3[47]/.test(card)) return "amex";
  if (/^(60|65|8[1-9])/.test(card)) return "rupay";
  return "unknown";
}

export function validExpiry(mm, yy) {
  const month = parseInt(mm);
  let year = parseInt(yy);
  if (yy.length === 2) year += 2000;
  const now = new Date();
  const exp = new Date(year, month);
  return month >= 1 && month <= 12 && exp >= now;
}
