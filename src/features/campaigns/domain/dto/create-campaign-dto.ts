import { z } from "zod";

export const createCampaignSchema = z
  .object({
    category: z
      .string({
        required_error: "La catégorie est requise",
        invalid_type_error: "La catégorie doit être une chaine de caractères",
      })
      .nonempty({ message: "La catégorie est requise" }),

    name: z
      .string({
        required_error: "L'intitulé est requis",
        invalid_type_error: "L'intitulé doit être une chaine de caractères",
      })
      .nonempty({ message: "L'intitulé est requis" }),

    description: z
      .string({
        required_error: "La description est requise",
        invalid_type_error: "La description doit être une chaine de caractères",
      })
      .nonempty({ message: "La description est requise" }),

    campaign_objective_id: z
      .string({
        required_error: "L'objectif est requis",
        invalid_type_error: "L'objectif doit être une chaine de caractères",
      })
      .nonempty({ message: "L'objectif est requis" }),

    start_date: z.date({
      required_error: "La date de début est requise",
      invalid_type_error: "La date de début doit être une date",
    }),

    end_date: z.date({
      required_error: "La date de fin est requise",
      invalid_type_error: "La date de fin doit être une date valide",
    }),

    budget: z
      .string({
        required_error: "Le budget est requis",
        invalid_type_error: "Le budget doit être un nombre valide",
      })
      .regex(/^\d+(\.\d{1,2})?$/, "Le budget doit être un nombre valide")
      .nonempty({ message: "Le budget est requis" }),

    commission_model: z
      .string({
        required_error: "Le mode de commission est requis",
        invalid_type_error: "Le mode de commission doit être une chaine de caractères",
      })
      .optional(),

    commission_value: z
      .string({
        invalid_type_error: "Le montant de la commission doit être une chaîne",
        required_error: "Le montant de la commission est requis",
      })
      .optional(),

    conversion_rate: z
      .string({
        invalid_type_error: "Le taux de conversion doit être une chaîne",
        required_error: "Le taux de conversion est requis",
      })
      .optional(),

    estimated_leads: z
      .string({
        required_error: "Le nombre de leads est requis",
        invalid_type_error: "Le nombre de leads doit être un nombre",
      })
      // .regex(/^\d+(\.\d{1,2})?$/, "Le nombre de leads doit être un nombre valide")
      .optional(),

    validation_condition_selected: z.array(z.string()).optional(),

    contacts_file: z
      .instanceof(File, { message: "Veuillez télécharger un fichier valide" })
      .refine((file) => file.size <= 5 * 1024 * 1024, "La taille du fichier doit être inférieure à 5 Mo")
      .nullable()
      .optional(),

    logo: z
      .instanceof(File, { message: "Veuillez télécharger un logo valide" })
      .refine((file) => file.size <= 2 * 1024 * 1024, "La taille du logo doit être inférieure à 2 Mo")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
        "Seuls les formats .jpg, .png et .svg sont pris en charge"
      )
      .nullable()
      .optional(),

    visuel_identify: z
      .instanceof(File, { message: "Veuillez télécharger un fichier de directives de marque valide" })
      .refine((file) => file.size <= 10 * 1024 * 1024, "La taille du fichier doit être inférieure à 10 Mo")
      .nullable()
      .optional(),

    website: z
      .string()
      .url("Veuillez entrer une URL valide")
      .startsWith("https://", "L'URL doit être un lien sécurisé (https://)")
      .optional(),

    visuel: z
      .array(
        z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, "Chaque fichier doit être inférieur à 5 Mo")
      )
      .max(10, "Maximum 10 visuels supplémentaires autorisés")
      .optional(),

    campaign_selected_creatives: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      console.log(data);
      if (data.commission_model === "fixed") {
        return !!data.commission_value;
      }
      return true;
    },
    {
      message: "Le montant de la commission est requis",
      path: ["commission_value"],
    }
  )
  .refine(
    (data) => {
      if (data.commission_model === "fixed") {
        return !isNaN(Number(data.commission_value));
      }
      return true;
    },
    {
      message: "Le montant de la commission doit être un nombre valide",
      path: ["commission_value"],
    }
  )
  .refine(
    (data) => {
      if (data.commission_model === "percentage") {
        return !!data.conversion_rate;
      }
      return true;
    },
    {
      message: "Le taux de conversion est requis",
      path: ["conversion_rate"],
    }
  )
  .refine(
    (data) => {
      if (data.commission_model === "percentage") {
        return !isNaN(Number(data.conversion_rate));
      }
      return true;
    },
    {
      message: "Le taux de conversion doit être un nombre valide",
      path: ["conversion_rate"],
    }
  )
  .refine(
    (data) => {
      if (data.commission_model === "percentage") {
        return Number(data.conversion_rate) > 0;
      }
      return true;
    },
    {
      message: "Le taux de conversion doit être supérieur à 0",
      path: ["conversion_rate"],
    }
  )
  .refine(
    (data) => {
      if (data.commission_model === "percentage") {
        return Number(data.conversion_rate) <= 100;
      }
      return true;
    },
    {
      message: "Le taux de conversion doit être inférieur ou égal à 100",
      path: ["conversion_rate"],
    }
  );

export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;
