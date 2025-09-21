const MOD_10 = 10;
const MOD_100 = 100;
const EXCLUDE_11 = 11;
const RANGE_MIN = 2;
const RANGE_MAX = 4;
const EXCLUDE_12 = 12;
const EXCLUDE_14 = 14;

export function formatBe(value: number, unit: "day" | "hour" | "minute") {
  const abs = Math.abs(value);
  const getForm = (forms: [string, string, string]) => {
    const module10 = abs % MOD_10;
    const module100 = abs % MOD_100;
    if (module10 === 1 && module100 !== EXCLUDE_11) {
      return forms[0];
    }
    if (
      module10 >= RANGE_MIN &&
      module10 <= RANGE_MAX &&
      (module100 < EXCLUDE_12 || module100 > EXCLUDE_14)
    ) {
      return forms[1];
    }
    return forms[2];
  };

  if (unit === "minute") {
    return `${abs} ${getForm(["хвіліна", "хвіліны", "хвілін"])} таму`;
  }
  if (unit === "hour") {
    return `${abs} ${getForm(["гадзіна", "гадзіны", "гадзін"])} таму`;
  }
  return `${abs} ${getForm(["дзень", "дні", "дзён"])} таму`;
}
