type envDefault = string | undefined;

function defaultVariable(variable: envDefault, defaultValue: string): string {
  if (typeof variable === "undefined") {
    return defaultValue;
  }
  return variable;
}

function requireEnv(variable: envDefault, name: string): string {
  if (typeof variable === "undefined") {
    throw new Error(`Variable ${name} is required`);
  }
  return variable;
}

function booleanEnv(variable: envDefault): boolean {
  return defaultVariable(variable, "false") === "true";
}

export const apiUrl = requireEnv(
  process.env.REACT_APP_API_BASE,
  "REACT_APP_API_BASE"
);
