/**
 * Centralized formatting + validation for RegisterFighter form.
 * Keep UI components dumb: they only call these helpers.
 */

export type RegisterFighterField =
  | "nombre"
  | "apodo"
  | "peso"
  | "altura"
  | "alcance"
  | "edad"
  | "duracionPromedioEnPelea"
  | "victorias"
  | "derrotas"
  | "empates"
  | "rachaActual"
  | "rachaHistorica";

/**
 * Sections of the form. Used to determine which fields are required
 * based on the "peleador nuevo" switch.
 */
export type RegisterFighterSection =
  | "informacionBasica"
  | "informacionFisica"
  | "historialPeleas"
  | "rachas";

/**
 * Maps each field to its section.
 */
export const FIELD_SECTION: Record<RegisterFighterField, RegisterFighterSection> = {
  nombre: "informacionBasica",
  apodo: "informacionBasica",
  edad: "informacionBasica",
  peso: "informacionFisica",
  altura: "informacionFisica",
  alcance: "informacionFisica",
  duracionPromedioEnPelea: "historialPeleas",
  victorias: "historialPeleas",
  derrotas: "historialPeleas",
  empates: "historialPeleas",
  rachaActual: "rachas",
  rachaHistorica: "rachas",
};

/**
 * Sections that are always required, even for new fighters.
 */
export const ALWAYS_REQUIRED_SECTIONS: RegisterFighterSection[] = [
  "informacionBasica",
  "informacionFisica",
];

/**
 * Returns whether a field is required given the current switch state.
 *
 * @param field - The field to check.
 * @param isPeleadorNuevo - Whether the "peleador nuevo" switch is ON.
 */
export function isFieldRequired(
  field: RegisterFighterField,
  isPeleadorNuevo: boolean
): boolean {
  if (!isPeleadorNuevo) return true; // All fields required when switch is OFF
  return ALWAYS_REQUIRED_SECTIONS.includes(FIELD_SECTION[field]);
}

type ValidationResult = string | null;

// ---------------------------------------------------------------------------
// String helpers
// ---------------------------------------------------------------------------

function normalizeSpaces(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function onlyLettersAndSpaces(value: string) {
  // Keeps unicode letters (accents, ñ, etc.) and spaces.
  return value.replace(/[^\p{L}\s]/gu, "");
}

function countWords(value: string) {
  const cleaned = normalizeSpaces(value);
  if (!cleaned) return 0;
  return cleaned.split(" ").filter(Boolean).length;
}

/**
 * Formats a text input to uppercase letters only, capping the number of words.
 * Allows a trailing space so the user can type the next word naturally.
 */
function upperLettersWithTrailingSpace(value: string, maxWords: number): string {
  // Strip invalid chars but preserve spaces (including trailing space).
  const lettersAndSpaces = onlyLettersAndSpaces(value).toUpperCase();

  // If the value ends with a space we want to preserve it (mid-typing).
  const trailingSpace = lettersAndSpaces.endsWith(" ") ? " " : "";

  // Normalize internal spaces and cap words.
  const words = lettersAndSpaces
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords);

  return words.join(" ") + (words.length < maxWords ? trailingSpace : "");
}

// ---------------------------------------------------------------------------
// Nombre
// ---------------------------------------------------------------------------

/**
 * Allows typing freely (including a separating space); caps at 2 words.
 */
export function formatNombreInput(value: string): string {
  return upperLettersWithTrailingSpace(value, 2);
}

export function validateNombre(value: string): ValidationResult {
  const v = normalizeSpaces(value);
  if (!v) return "El nombre es obligatorio.";
  const words = countWords(v);
  if (words < 1 || words > 2)
    return "Debe contener entre 1 y 2 palabras (Nombre y Apellido).";
  if (onlyLettersAndSpaces(v) !== v)
    return "Solo se permiten letras (sin numeros ni simbolos).";
  return null;
}

// ---------------------------------------------------------------------------
// Apodo
// ---------------------------------------------------------------------------

/**
 * Allows 1 or 2 words (space is optional).
 */
export function formatApodoInput(value: string): string {
  return upperLettersWithTrailingSpace(value, 2);
}

export function validateApodo(value: string): ValidationResult {
  const v = normalizeSpaces(value);
  if (!v) return "El apodo es obligatorio.";
  const words = countWords(v);
  if (words < 1 || words > 2)
    return "El apodo debe tener entre 1 y 2 palabras.";
  if (onlyLettersAndSpaces(v) !== v)
    return "Solo se permiten letras (sin numeros ni simbolos).";
  return null;
}

// ---------------------------------------------------------------------------
// Positive integers
// ---------------------------------------------------------------------------

function digitsOnly(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function formatPositiveIntegerInput(
  value: string,
  opts?: { allowZero?: boolean }
) {
  const allowZero = opts?.allowZero ?? false;
  let v = digitsOnly(value);
  if (!allowZero) {
    v = v.replace(/^0+/, "");
  } else {
    v = v.replace(/^0+(?=\d)/, "");
  }
  return v;
}

export function validatePositiveInteger(
  value: string,
  opts?: { allowZero?: boolean; label?: string }
): ValidationResult {
  const allowZero = opts?.allowZero ?? false;
  const label = opts?.label ?? "El valor";
  if (value === "") return `${label} es obligatorio.`;
  if (!/^\d+$/.test(value)) return `${label} debe ser numerico.`;
  const n = Number(value);
  if (!Number.isFinite(n)) return `${label} no es valido.`;
  if (allowZero) {
    if (n < 0) return `${label} debe ser positivo.`;
  } else {
    if (n <= 0) return `${label} debe ser mayor que 0.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Auto-dot decimal  (Altura / Alcance)
// ---------------------------------------------------------------------------

/**
 * Permissive formatter: only strips chars that are never valid (anything that
 * isn't a digit or a dot). Multiple dots are collapsed to the first one.
 * Does NOT force a dot or restructure the digits — that is intentional so
 * the user can freely delete the entire value.
 *
 * Auto-formatting (inserting the dot after digit 1) is applied only when the
 * raw digit string has more than one digit AND the user has not already placed
 * a dot themselves.
 *
 * Examples:
 *   ""     -> ""          (fully erasable)
 *   "1"    -> "1"         (dot not forced until a second digit arrives)
 *   "18"   -> "1.8"       (auto-insert)
 *   "184"  -> "1.84"
 *   "1."   -> "1."        (user typed the dot — keep it)
 *   "1.8"  -> "1.8"
 *   "1.84" -> "1.84"
 */
export function formatAutoDotDecimal(
  value: string,
  opts?: { decimals?: number }
): string {
  const decimals = opts?.decimals ?? 2;

  // 1. Remove everything that is not a digit or dot.
  let v = value.replace(/[^\d.]/g, "");
  if (!v) return "";

  // 2. Collapse multiple dots — keep only the first.
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v =
      v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  // 3. If a dot is already present (typed or auto-inserted previously),
  //    just cap the decimal places and return — no restructuring.
  if (v.includes(".")) {
    const [intPart, decPart] = v.split(".");
    return `${intPart}.${decPart.slice(0, decimals)}`;
  }

  // 4. No dot yet. Only auto-insert when there are 2+ digits.
  const digits = v; // only digits at this point
  if (digits.length <= 1) return digits; // single digit — let user keep typing

  const first = digits.slice(0, 1);
  const rest = digits.slice(1, 1 + decimals);
  return `${first}.${rest}`;
}

export function validateAutoDotDecimal(
  value: string,
  opts?: { label?: string }
): ValidationResult {
  const label = opts?.label ?? "El valor";
  if (value === "" || value === ".") return `${label} es obligatorio.`;
  // Accept "1.", "1.8", "1.84"
  if (!/^\d\.\d{0,2}$/.test(value))
    return `${label} debe tener formato X.XX (maximo 2 decimales).`;
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0)
    return `${label} debe ser mayor que 0.`;
  return null;
}

// ---------------------------------------------------------------------------
// Field-specific thin wrappers
// ---------------------------------------------------------------------------

export const formatPesoInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: false });
export const validatePeso = (v: string) =>
  validatePositiveInteger(v, { allowZero: false, label: "El peso" });

export const formatAlturaInput = (v: string) =>
  formatAutoDotDecimal(v, { decimals: 2 });
export const validateAltura = (v: string) =>
  validateAutoDotDecimal(v, { label: "La altura" });

export const formatAlcanceInput = (v: string) =>
  formatAutoDotDecimal(v, { decimals: 2 });
export const validateAlcance = (v: string) =>
  validateAutoDotDecimal(v, { label: "El alcance" });

export const formatEdadInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: false });
export const validateEdad = (v: string) =>
  validatePositiveInteger(v, { allowZero: false, label: "La edad" });

export const formatDuracionPromedioEnPeleaInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: false });
export const validateDuracionPromedioEnPelea = (v: string) =>
  validatePositiveInteger(v, { allowZero: false, label: "La duracion promedio" });

export const formatVictoriasInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: true });
export const validateVictorias = (v: string) =>
  validatePositiveInteger(v, { allowZero: true, label: "Victorias" });

export const formatDerrotasInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: true });
export const validateDerrotas = (v: string) =>
  validatePositiveInteger(v, { allowZero: true, label: "Derrotas" });

export const formatEmpatesInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: true });
export const validateEmpates = (v: string) =>
  validatePositiveInteger(v, { allowZero: true, label: "Empates" });

export const formatRachaActualInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: true });
export const validateRachaActual = (v: string) =>
  validatePositiveInteger(v, { allowZero: true, label: "Racha actual" });

export const formatRachaHistoricaInput = (v: string) =>
  formatPositiveIntegerInput(v, { allowZero: true });
export const validateRachaHistorica = (v: string) =>
  validatePositiveInteger(v, { allowZero: true, label: "Racha historica" });

// ---------------------------------------------------------------------------
// Generic dispatch helpers
// ---------------------------------------------------------------------------

export function formatField(field: RegisterFighterField, value: string) {
  switch (field) {
    case "nombre":               return formatNombreInput(value);
    case "apodo":                return formatApodoInput(value);
    case "peso":                 return formatPesoInput(value);
    case "altura":               return formatAlturaInput(value);
    case "alcance":              return formatAlcanceInput(value);
    case "edad":                 return formatEdadInput(value);
    case "duracionPromedioEnPelea": return formatDuracionPromedioEnPeleaInput(value);
    case "victorias":            return formatVictoriasInput(value);
    case "derrotas":             return formatDerrotasInput(value);
    case "empates":              return formatEmpatesInput(value);
    case "rachaActual":          return formatRachaActualInput(value);
    case "rachaHistorica":       return formatRachaHistoricaInput(value);
    default:                     return value;
  }
}

/**
 * Validates a field respecting the "peleador nuevo" switch.
 * When `isPeleadorNuevo` is true, non-required fields return null (no error).
 */
export function validateField(
  field: RegisterFighterField,
  value: string,
  isPeleadorNuevo: boolean = false
): ValidationResult {
  if (!isFieldRequired(field, isPeleadorNuevo)) return null;

  switch (field) {
    case "nombre":               return validateNombre(value);
    case "apodo":                return validateApodo(value);
    case "peso":                 return validatePeso(value);
    case "altura":               return validateAltura(value);
    case "alcance":              return validateAlcance(value);
    case "edad":                 return validateEdad(value);
    case "duracionPromedioEnPelea": return validateDuracionPromedioEnPelea(value);
    case "victorias":            return validateVictorias(value);
    case "derrotas":             return validateDerrotas(value);
    case "empates":              return validateEmpates(value);
    case "rachaActual":          return validateRachaActual(value);
    case "rachaHistorica":       return validateRachaHistorica(value);
    default:                     return null;
  }
}

/**
 * Validates the entire form and returns a map of field → error message.
 * Only fields that are required (given the switch state) are validated.
 *
 * @param values - Current form values keyed by field name.
 * @param isPeleadorNuevo - State of the "peleador nuevo" switch.
 */
export function validateForm(
  values: Partial<Record<RegisterFighterField, string>>,
  isPeleadorNuevo: boolean
): Partial<Record<RegisterFighterField, string>> {
  const errors: Partial<Record<RegisterFighterField, string>> = {};

  (Object.keys(FIELD_SECTION) as RegisterFighterField[]).forEach((field) => {
    const error = validateField(field, values[field] ?? "", isPeleadorNuevo);
    if (error) errors[field] = error;
  });

  return errors;
}