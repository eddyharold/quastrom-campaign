import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAbbreviation(name: string | undefined, length = 2): string {
  if (!name) return "UN";
  const words = name.trim().split(/\s+/);

  if (words.length === 1) return words[0][0].toUpperCase();

  const limit = words.length >= length ? length : words.length;

  let abbreviation = "";
  for (let index = 0; index < limit; index++) {
    abbreviation += words[index][0].toUpperCase();
  }

  return abbreviation;
}

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateUsername = (fullname: string): string => {
  if (!fullname) return "";

  const cleanName = fullname.replace(/[^a-zA-Z0-9\s]/g, "").trim();

  const nameParts = cleanName.split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0].toLowerCase();
  } else {
    const initials = nameParts
      .slice(0, -1)
      .map((part) => part.charAt(0))
      .join("");
    const lastName = nameParts[nameParts.length - 1];
    return (initials + lastName).toLowerCase();
  }
};
