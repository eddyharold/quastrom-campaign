import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(1, "L'intitulé est requis"),

  description: z.string().min(1, "La description est requise"),

  objectiveType: z.enum(["qualification", "classic"], {
    message: "Le type d'objectif est requis",
  }),

  classicObjective: z.string().optional(),

  hasQualificationFile: z.boolean().default(false).optional(), // toujours présent

  qualificationFile: z
    .instanceof(File, { message: "Veuillez télécharger un fichier valide" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "La taille du fichier doit être inférieure à 5 Mo")
    .nullable()
    .optional(),

  budget: z.string().regex(/^\d+(\.\d{1,2})?$/, "Le budget doit être un nombre valide"),

  budgetType: z.string().min(1, "Le type de budget est requis"),

  hasCreatives: z.boolean().default(false).optional(), // toujours présent

  commissionModel: z.string().min(1, "Le modèle de commission est requis"),

  commissionValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "La valeur de la commission doit être un nombre valide"),

  eligibilityConditions: z
    .array(z.string().min(1, "La condition ne peut pas être vide"))
    .min(1, "Au moins une condition d'éligibilité est requise"),

  logo: z
    .instanceof(File, { message: "Veuillez télécharger un logo valide" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "La taille du logo doit être inférieure à 2 Mo")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "Seuls les formats .jpg, .png et .svg sont pris en charge"
    )
    .nullable()
    .optional(),

  brandGuidelines: z
    .instanceof(File, { message: "Veuillez télécharger un fichier de directives de marque valide" })
    .refine((file) => file.size <= 10 * 1024 * 1024, "La taille du fichier doit être inférieure à 10 Mo")
    .nullable()
    .optional(),

  websiteUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .startsWith("https://", "L'URL doit être un lien sécurisé (https://)")
    .optional(),

  additionalVisuals: z
    .array(
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, "Chaque fichier doit être inférieur à 5 Mo")
    )
    .max(10, "Maximum 10 visuels supplémentaires autorisés")
    .optional(), // ⚠️ pas .optional() sinon conflit avec expected type `File[]`

  creativeSupports: z
    .array(z.string().min(1, "Le support ne peut pas être vide"))
    .min(1, "Au moins un support créatif est requis"),

  creativeElements: z
    .array(z.string().min(1, "L'élément ne peut pas être vide"))
    .min(1, "Au moins un élément créatif est requis"),

  walletBalance: z.number().min(0, "Le solde du portefeuille ne peut pas être négatif"),

  conversionStatuses: z
    .array(z.string().min(1, "Le statut ne peut pas être vide"))
    .min(1, "Au moins un statut de conversion est requis"),

  startDate: z.date().min(new Date(), "La date de début doit être dans le futur").optional(),

  endDate: z.date().min(new Date(), "La date de fin doit être dans le futur").optional(),

  category: z.string().min(1, "La catégorie est requise").optional(),
});

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;
