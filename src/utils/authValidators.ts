type LoginValidationInput = {
  email: string;
  password: string;
};

type RegisterValidationInput = {
  name: string;
  email: string;
  password: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Informe sua senha.";
  }

  if (password.length < 8) {
    return "A senha deve possuir pelo menos 8 caracteres.";
  }

  if (!/[a-z]/.test(password)) {
    return "A senha deve possuir pelo menos uma letra minúscula.";
  }

  if (!/[A-Z]/.test(password)) {
    return "A senha deve possuir pelo menos uma letra maiúscula.";
  }

  if (!/\d/.test(password)) {
    return "A senha deve possuir pelo menos um número.";
  }

  return null;
}

export function validateLogin({
  email,
  password,
}: LoginValidationInput): string | null {
  if (!email.trim() || !password) {
    return "Preencha e-mail e senha.";
  }

  if (!isValidEmail(email)) {
    return "Informe um e-mail válido.";
  }

  return null;
}

export function validateRegister({
  name,
  email,
  password,
}: RegisterValidationInput): string | null {
  const normalizedName = name.trim();

  if (!normalizedName || !email.trim() || !password) {
    return "Preencha todos os campos.";
  }

  if (normalizedName.length < 2) {
    return "O nome deve possuir pelo menos 2 caracteres.";
  }

  if (!isValidEmail(email)) {
    return "Informe um e-mail válido.";
  }

  return validatePassword(password);
}
