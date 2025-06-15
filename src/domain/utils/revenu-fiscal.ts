type IncomeCategory = "très modeste" | "modeste" | "intermédiaire" | "supérieure";

interface IncomeOption {
  label: string;
  value: number;
  type: IncomeCategory;
  type_label: string;
}

export enum Region {
  IN_IDF = "IN_IDF",
  OUT_IDF = "OUT_IDF",
}

const BASE_THRESHOLDS: Record<Region, Record<number, [number, number, number]>> = {
  [Region.IN_IDF]: {
    1: [23768, 28933, 40404],
    2: [34884, 42463, 59394],
    3: [41893, 51000, 71060],
    4: [48914, 59549, 83637],
    5: [55961, 68123, 95758],
  },
  [Region.OUT_IDF]: {
    1: [17173, 22015, 30844],
    2: [25115, 32197, 45340],
    3: [30206, 38719, 54592],
    4: [35285, 45234, 63844],
    5: [40388, 51775, 73098],
  },
};

const BONUS_PER_EXTRA_PERSON: Record<Region, [number, number, number]> = {
  [Region.IN_IDF]: [7038, 8568, 12122],
  [Region.OUT_IDF]: [5094, 6525, 9254],
};

export function getIncomeOptions(persons: number | null, region: Region): IncomeOption[] {
  let veryLow = 0;
  let low = 0;
  let intermediate = 0;

  const numPersons = persons || 1;

  if (numPersons <= 5) {
    const group = numPersons <= 5 ? numPersons : 5;
    const [baseVeryLow, baseLow, baseIntermediate] = BASE_THRESHOLDS[region][group];

    veryLow = baseVeryLow;
    low = baseLow;
    intermediate = baseIntermediate;
  } else {
    const extraCount = numPersons - 5;
    const [bonusVeryLow, bonusLow, bonusIntermediate] = BONUS_PER_EXTRA_PERSON[region];

    veryLow = bonusVeryLow + extraCount * bonusVeryLow;
    low = bonusLow + extraCount * bonusLow;
    intermediate = bonusIntermediate + extraCount * bonusIntermediate;
  }

  return [
    {
      type: "très modeste",
      type_label: "Très modeste",
      label: `Inférieur à ${veryLow.toLocaleString("fr-FR")} €`,
      value: veryLow,
    },
    {
      type: "modeste",
      type_label: "Modeste",
      label: `Inférieur à ${low.toLocaleString("fr-FR")} €`,
      value: low,
    },
    {
      type: "intermédiaire",
      type_label: "Intermédiaire",
      label: `Inférieur à ${intermediate.toLocaleString("fr-FR")} €`,
      value: intermediate,
    },
    {
      type: "supérieure",
      type_label: "Aise",
      label: `Supérieur à ${intermediate.toLocaleString("fr-FR")} €`,
      value: intermediate + 100,
    },
  ];
}
