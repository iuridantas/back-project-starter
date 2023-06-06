export function isValidCPF(cpf: string): boolean {
  const SIZE = 11;
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== SIZE) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  if ('01234567890'.includes(cpf)) return false;

  let sum = 0;
  let multiplier = SIZE - 1;
  const firstDigit = calculateDigit(cpf, multiplier, SIZE);

  sum = 0;
  multiplier = SIZE;
  const secondDigit = calculateDigit(cpf, multiplier, SIZE);

  return (
    parseInt(cpf.charAt(SIZE - 2)) === firstDigit &&
    parseInt(cpf.charAt(SIZE - 1)) === secondDigit
  );
}

export function isValidCNPJ(cnpj: string): boolean {
  const SIZE = 14;
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== SIZE) return false;
  if (/^(\d)\1{12}$/.test(cnpj)) return false;
  if ('01234567890'.includes(cnpj)) return false;

  let sum = 0;
  let multiplier = SIZE - 2;
  const firstDigit = calculateDigit(cnpj, multiplier, SIZE);

  sum = 0;
  multiplier = SIZE - 1;
  const secondDigit = calculateDigit(cnpj, multiplier, SIZE);

  return (
    parseInt(cnpj.charAt(SIZE - 2)) === firstDigit &&
    parseInt(cnpj.charAt(SIZE - 1)) === secondDigit
  );
}

export function calculateDigit(
  number: string,
  multiplier: number,
  size: number,
): number {
  let sum = 0;

  for (let i = 0; i < size - 2; i++) {
    sum += parseInt(number.charAt(i)) * multiplier;
    multiplier--;
  }

  const mod = sum % 11;
  return mod < 2 ? 0 : 11 - mod;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domainRegex = /@(outlook|gmail|hotmail|yahoo|icloud|example|test)\./i;
  const isValidDomain = domainRegex.test(email);
  return emailRegex.test(email) && isValidDomain;
}

export function isValidPassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^(\+\d{1,3})?\s?(\(\d{2,3}\)\s?)?\d{4,5}[-\s]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
}

export function isValidDate(dateString: string): boolean {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;

  if (!dateRegex.test(dateString)) {
    return false;
  }

  const parts = dateString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  const isValidYear = year >= 1000 && year <= 9999;
  const isValidMonth = month >= 1 && month <= 12;
  const isValidDay = day >= 1 && day <= 31;

  return isValidYear && isValidMonth && isValidDay;
}

export function isValidCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
}
