"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  Target,
  CheckCircle,
  Phone,
  CalendarDays,
  Calculator,
  ShoppingCart,
  Package,
  Palette,
  Check,
  Euro,
  Trash,
  Info,
  CreditCard,
  Eye,
} from "lucide-react";
import { cn } from "@/domain/utils/common";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { DatePicker } from "@/presentation/components/ui/date-picker";
import { CreateCampaignDto, createCampaignSchema } from "../../domain/dto/create-campaign-dto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import { Switch } from "@/presentation/components/ui/switch";
import { useFileUpload } from "@/presentation/hooks/use-file-upload";
import { UPLOAD_FILE_MAX_SIZE } from "@/domain/constants/file";
import { formatBytes } from "@/domain/utils/file";
import { ErrorMessage } from "@/presentation/components/error-message";
import { PageHeader } from "@/presentation/components/page-header";
import { RadioGroup, RadioGroupItem } from "@/presentation/components/ui/radio-group";
import { Badge } from "@/presentation/components/ui/badge";
import { formatCurrency } from "@/domain/utils/currency";
import { formatDateFromPattern } from "@/domain/utils/date";

const FORM_STEPS = [
  {
    number: 1,
    title: "Informations générales",
    label: "Informations",
    icon: FileText,
    description: "Renseignez les informations de base de votre campagne",
  },
  {
    number: 2,
    title: "Choix de l'objectif",
    label: "Objectif",
    icon: Target,
    description: "Sélectionnez le type de campagne qui correspond à vos besoins",
  },
  {
    number: 3,
    title: "Budget & validation du lead",
    label: "Budget",
    icon: Euro,
    description: "Définissez votre budget et les conditions de validation du lead",
  },
  {
    number: 4,
    title: "Éléments créatifs & identité visuelle",
    label: "Créatifs",
    icon: Palette,
    description: "Personnalisez l'apparence de votre campagne",
  },
  {
    number: 5,
    title: "Récapitulatif & Wallet",
    label: "Récapitulatif",
    icon: Package,
    description: "Vérifiez les détails et planifier votre campagne",
  },
];

const CREATIVE_SUPPORTS = [
  {
    id: "annonce",
    title: "Annonce",
    cost: 0,
  },
  {
    id: "banner",
    title: "Bannière",
    cost: 150,
  },
  {
    id: "landing-page",
    title: "Landing page",
    cost: 300,
  },
  {
    id: "email-template",
    title: "Email template",
    cost: 100,
  },
  {
    id: "video",
    title: "Video promotionnelle",
    cost: 500,
  },
];

const OBJECTIVES = [
  {
    id: "lead-generation",
    title: "Génération de leads simples",
    description: "Collecte de contacts qualifiés pour votre entreprise",
    estimatedCost: 35,
    icon: Target,
    tooltip: "Coût estimé par lead généré.",
  },
  {
    id: "appointment",
    title: "Rendez-vous qualifiés",
    description: "Génération de RDV commerciaux qualifiés",
    estimatedCost: 45,
    icon: CalendarDays,
    tooltip: "Coût estimé par rendez-vous pris.",
  },
  {
    id: "callback",
    title: "Appels / Rappels",
    description: "Demandes de contact téléphonique",
    estimatedCost: 30,
    icon: Phone,
    tooltip: "Coût estimé par appel/rappel.",
  },
  {
    id: "quote",
    title: "Demande de devis",
    description: "Collecte de demandes de devis qualifiées",
    estimatedCost: 50,
    icon: Calculator,
    tooltip: "Coût estimé par devis qualifié.",
  },
  {
    id: "conversion",
    title: "Conversion commerciale",
    description: "Paiement uniquement sur vente confirmée",
    estimatedCost: 0,
    icon: ShoppingCart,
    tooltip: "Paiement uniquement sur vente confirmée.",
  },
];

const BTP_CATEGORIES = [
  "Maçonnerie",
  "Plomberie",
  "Électricité",
  "Peinture",
  "Menuiserie",
  "Charpente",
  "Couverture",
  "Plâtrerie",
  "Carrelage",
  "Chauffage",
  "Autre",
];

export default function CreateCampaign() {
  const { updateBreadcrumb } = useLayoutContext();
  const form = useForm<CreateCampaignDto>({
    resolver: zodResolver(createCampaignSchema),
  });

  const [
    { files, isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
  ] = useFileUpload({
    maxSize: UPLOAD_FILE_MAX_SIZE,
    initialFiles: [],
    onFilesChange: (files) => {
      const file = files.length > 0 ? files[0] || null : null;

      if (file) {
        form.setValue("qualificationFile", file.file as File);
      }
    },
  });

  const [
    { files: logoFiles, isDragging: logoIsDragging, errors: logoErrors },
    {
      handleDragEnter: logoHandleDragEnter,
      handleDragLeave: logoHandleDragLeave,
      handleDragOver: logoHandleDragOver,
      handleDrop: logoHandleDrop,
      openFileDialog: logoOpenFileDialog,
      removeFile: logoRemoveFile,
      getInputProps: logoGetInputProps,
    },
  ] = useFileUpload({
    maxSize: UPLOAD_FILE_MAX_SIZE,
    initialFiles: [],
    onFilesChange: (files) => {
      const file = files.length > 0 ? files[0] || null : null;

      if (file) {
        form.setValue("qualificationFile", file.file as File);
      }
    },
  });

  const [
    { files: brandGuidelinesFiles, isDragging: brandGuidelinesIsDragging, errors: brandGuidelinesErrors },
    {
      handleDragEnter: brandGuidelinesHandleDragEnter,
      handleDragLeave: brandGuidelinesHandleDragLeave,
      handleDragOver: brandGuidelinesHandleDragOver,
      handleDrop: brandGuidelinesHandleDrop,
      openFileDialog: brandGuidelinesOpenFileDialog,
      removeFile: brandGuidelinesRemoveFile,
      getInputProps: brandGuidelinesGetInputProps,
    },
  ] = useFileUpload({
    maxSize: UPLOAD_FILE_MAX_SIZE,
    initialFiles: [],
    onFilesChange: (files) => {
      const file = files.length > 0 ? files[0] || null : null;

      if (file) {
        form.setValue("brandGuidelines", file.file as File);
      }
    },
  });

  const [
    { files: additionalVisualsFiles, isDragging: additionalVisualsIsDragging, errors: additionalVisualsErrors },
    {
      handleDragEnter: additionalVisualsHandleDragEnter,
      handleDragLeave: additionalVisualsHandleDragLeave,
      handleDragOver: additionalVisualsHandleDragOver,
      handleDrop: additionalVisualsHandleDrop,
      openFileDialog: additionalVisualsOpenFileDialog,
      removeFile: additionalVisualsRemoveFile,
      getInputProps: additionalVisualsGetInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxSize: UPLOAD_FILE_MAX_SIZE,
    initialFiles: [],
    onFilesChange: (files) => {
      const visuals = files.length > 0 ? files.map((file) => file.file) : [];
      form.setValue("additionalVisuals", visuals as File[]);
    },
  });

  const qualificationContactListFile = files[0] || null;
  const logoFile = logoFiles[0] || null;
  const brandGuidelinesFile = brandGuidelinesFiles[0] || null;

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleNext = () => nextStep();
  const handlePrevious = () => prevStep();

  const handleObjectiveTypeChange = (value: boolean) => {
    form.setValue("objectiveType", value ? "qualification" : "classic");
    form.setValue("classicObjective", "");
    removeFile(qualificationContactListFile.id);
  };

  const handleSelectObjective = (value: string) => {
    form.setValue("classicObjective", value);
    form.setValue("commissionModel", "");
    form.setValue("commissionValue", "");
    form.setValue("budget", "");
    form.setValue("eligibilityConditions", []);
  };

  const handleEligibilityConditionsChange = (checked: boolean | "indeterminate", condition: string) => {
    const conditions = form.watch("eligibilityConditions") || [];
    if (checked && checked !== "indeterminate") {
      form.setValue("eligibilityConditions", [...conditions, condition]);
    } else {
      form.setValue(
        "eligibilityConditions",
        conditions.filter((id) => id !== condition)
      );
    }
  };

  const handleCreativeSupportsChange = (checked: boolean | "indeterminate", support: string) => {
    const supports = form.watch("creativeSupports") || [];
    if (checked && checked !== "indeterminate") {
      form.setValue("creativeSupports", [...supports, support]);
    } else {
      form.setValue(
        "creativeSupports",
        supports.filter((id) => id !== support)
      );
    }
  };

  const getObjective = () => {
    const objectif = OBJECTIVES.find((obj) => obj.id === form.getValues("classicObjective"));
    return objectif ? objectif.title : "Non défini";
  };

  const getCreativeSupports = () => {
    return CREATIVE_SUPPORTS.filter((support) => (form.getValues("creativeSupports") || []).includes(support.id));
  };

  const getMontantTotal = () => {
    return (
      getCreativeSupports().reduce((total, support) => total + support.cost, 0) + Number(form.getValues("budget") || 0)
    );
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mt-2">
      {FORM_STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isPending = currentStep < step.number;

        return (
          <Fragment key={`create-campaign-step-${step.number}`}>
            <div className="relative shrink-0 mx-6">
              <div
                className={cn(
                  `rounded-full flex items-center justify-center border-2 transition-all h-8 w-8 shrink-0`,
                  isCompleted && "bg-success border-success text-success-foreground",
                  isCurrent && "border-primary text-primary ring-2 ring-primary/20",
                  isPending && "border-muted-foreground text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : <step.icon className="size-4" />}
              </div>
              <span
                className={cn(
                  `text-sm font-semibold absolute left-1/2 -translate-x-1/2 -top-8`,
                  isCompleted && "text-success",
                  isCurrent && "text-primary font-semibold",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {idx !== FORM_STEPS.length - 1 && (
              <div
                className={cn(`grow h-1 rounded-md transition-all`, isCompleted ? "bg-success" : "bg-muted-foreground")}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );

  useEffect(() => {
    updateBreadcrumb([
      {
        title: "Tableau de bord",
        link: "/",
      },
      {
        title: "Campagnes",
        link: "/campaigns",
      },
      {
        title: "Création",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  return (
    <div className="flex-1 overflow-auto p-6">
      <Form {...form}>
        <div className="max-w-5xl mx-auto space-y-6">
          <PageHeader
            title="Planifier une nouvelle campagne"
            subtitle="Complétez les étapes ci-dessous pour configurer et activer votre campagne"
            navigateBackTo="/campaigns"
          />

          <Card className="pt-10 px-8">{renderStepIndicator()}</Card>

          {currentStep === 1 && (
            <Card>
              <CardHeader className="border-b border-dashed">
                <CardTitle>{FORM_STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>{FORM_STEPS[currentStep - 1].description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Intitulé de la campagne</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Campagne de qualification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Description détaillée</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez les objectifs de votre campagne et votre public cible"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de début</FormLabel>
                        <FormControl>
                          <DatePicker value={field.value} onChange={(date) => field.onChange(date)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de fin</FormLabel>
                        <FormControl>
                          <DatePicker value={field.value} onChange={(date) => field.onChange(date)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur d'activité</FormLabel>
                      <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                        <SelectTrigger className="w-full">
                          <FormControl>
                            <SelectValue placeholder="Sélectionnez votre secteur d'activité" />
                          </FormControl>
                        </SelectTrigger>
                        <SelectContent>
                          {BTP_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <>
              <Card className="px-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="objectiveType"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                          <FormLabel className="text-base">Qualification de contacts existants</FormLabel>
                          <FormDescription className="text-sm">
                            Téléversez votre fichier de contacts à qualifier. Aucun lead externe ne sera généré.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "qualification"}
                            onCheckedChange={handleObjectiveTypeChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("objectiveType") === "qualification" && (
                    <>
                      {errors.length > 0 && <ErrorMessage message={errors[0]} />}

                      {!qualificationContactListFile && (
                        <div
                          role="button"
                          onClick={openFileDialog}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          data-dragging={isDragging || undefined}
                          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                        >
                          <input
                            {...getInputProps()}
                            className="sr-only"
                            aria-label="Upload file"
                            disabled={Boolean(qualificationContactListFile)}
                          />

                          <div className="flex flex-col items-center justify-center text-center">
                            <div
                              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                              aria-hidden="true"
                            >
                              <Upload className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">Televerser vos contacts</p>
                            <p className="text-muted-foreground text-xs">
                              Porter & deposer ou cliquer pour televerser (max. {formatBytes(UPLOAD_FILE_MAX_SIZE)})
                            </p>
                          </div>
                        </div>
                      )}

                      {qualificationContactListFile && (
                        <div
                          key={qualificationContactListFile.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-background border border-dashed px-4 py-2"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium">
                                {qualificationContactListFile.file.name}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="icon-sm"
                            variant="accent"
                            className="-me-2"
                            onClick={() => removeFile(files[0]?.id)}
                            aria-label="Remove file"
                          >
                            <Trash className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>

              <Card>
                <CardHeader className="border-b border-dashed">
                  <CardTitle>{FORM_STEPS[currentStep - 1].title}</CardTitle>
                  <CardDescription>{FORM_STEPS[currentStep - 1].description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="classicObjective"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            value={field.value}
                            onValueChange={handleSelectObjective}
                          >
                            {OBJECTIVES.map((objective) => (
                              <FormItem
                                key={`campaign-objective-${objective.id}-item`}
                                className="border-input has-data-[state=checked]:border-transparent has-data-[state=checked]:ring-3 has-data-[state=checked]:ring-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={objective.id}
                                    id={`campaign-objective-${objective.id}-radio`}
                                    aria-describedby={`campaign-objective-${objective.id}-description`}
                                    className="order-1 after:absolute after:inset-0"
                                  />
                                </FormControl>
                                <div className="font-normal flex grow items-start gap-3">
                                  <div className="bg-accent rounded-lg p-2 size-8 flex items-center justify-center shrink-0">
                                    <objective.icon className="size-4" />
                                  </div>
                                  <div className="grid grow gap-2">
                                    <FormLabel htmlFor={`campaign-objective-${objective.id}`}>
                                      {objective.title}
                                    </FormLabel>
                                    <p
                                      id={`campaign-objective-${objective.id}-description`}
                                      className="text-muted-foreground text-xs"
                                    >
                                      {objective.description}
                                    </p>
                                    {!!objective.estimatedCost && objective.estimatedCost > 0 && (
                                      <Badge size="xs" variant="accent" className="text-[0.7rem] px-2 py-0.5">
                                        ~{formatCurrency(objective.estimatedCost)}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("classicObjective") === "conversion" && (
                    <div className="rounded-lg p-6 border border-dashed space-y-8">
                      <div className="pb-2">
                        <div className="text-lg font-semibold">Modèle de commission</div>
                        <div className="text-muted-foreground text-xs">
                          Selectionnez le modèle de commission puis indiquez le montant ou le pourcentage
                        </div>
                      </div>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="commissionModel"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormControl>
                                <RadioGroup
                                  className="flex items-center gap-10"
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="fixed" id="commission-model-fixed-amount" />
                                    </FormControl>
                                    <FormLabel htmlFor="commission-model-fixed-amount">Montant fixe</FormLabel>
                                  </FormItem>

                                  <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                      <RadioGroupItem value="percentage" id="commission-model-percentage" />
                                    </FormControl>
                                    <FormLabel htmlFor="commission-model-percentage">Pourcentage de la vente</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("commissionModel") && (
                          <FormField
                            control={form.control}
                            name="commissionValue"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormControl>
                                  <Input
                                    placeholder={
                                      form.watch("commissionModel") === "fixed" ? "Ex: 50 pour 50€" : "Ex: 10 pour 10%"
                                    }
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader className="border-b border-dashed">
                <CardTitle>{FORM_STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>{FORM_STEPS[currentStep - 1].description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-12">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-lg font-semibold">Budget total</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="Ex: 1000" {...field} />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-muted-foreground">€</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("classicObjective") === "lead-generation" ? (
                  <div className="flex items-center space-x-2 h-12 p-4 bg-success/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">
                      Le lead doit avoir rempli le formulaire avec un nom et un numéro de téléphone valides.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Conditions de validation</h3>

                    <div className="divide-y divide-dashed">
                      {[
                        {
                          id: "signed-quote",
                          label: "Devis signé",
                          description: "Le prospect a accepté une estimation",
                        },
                        {
                          id: "appointment-booked",
                          label: "RDV pris",
                          description: "Un créneau a été réservé pour échange",
                        },
                        {
                          id: "confirmed-sale",
                          label: "Vente confirmée",
                          description: "Action commerciale réalisée",
                        },
                        {
                          id: "qualified-lead",
                          label: "Fiche qualifiée",
                          description: "Lead validé manuellement ou via scoring",
                        },
                      ].map((condition) => {
                        const isSelected = (form.watch("eligibilityConditions") || []).includes(condition.id);

                        return (
                          <div className="flex items-start gap-2 py-4 boder">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleEligibilityConditionsChange(checked, condition.id)}
                              id={condition.id}
                              aria-describedby={`campaign-eligibility-conditions-${condition.id}-description`}
                            />
                            <div className="grid grow gap-1.5">
                              <Label htmlFor={condition.id}>{condition.label}</Label>
                              <p
                                id={`campaign-eligibility-conditions-${condition.id}-description`}
                                className="text-muted-foreground text-xs"
                              >
                                {condition.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <>
              <div className="flex items-center space-x-2 h-12 p-4 bg-info/10 rounded-lg">
                <Info className="h-5 w-5 text-info" />
                <span className="text-sm text-info">
                  Certains éléments créatifs peuvent être nécessaires pour votre campagne. Nous pouvons les réaliser
                  pour vous selon votre charte graphique
                </span>
              </div>

              <Card>
                <CardHeader className="border-b border-dashed">
                  <CardTitle>Identité visuelle (obligatoire)</CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <Label>Téléversement du logo</Label>
                        <p className="text-xs text-muted-foreground">
                          Seule les formats .jpg, .png, .webp et .svg sont pris en charge
                        </p>
                      </div>

                      {logoErrors.length > 0 && <ErrorMessage message={logoErrors[0]} />}

                      {!logoFile && (
                        <div
                          role="button"
                          onClick={logoOpenFileDialog}
                          onDragEnter={logoHandleDragEnter}
                          onDragLeave={logoHandleDragLeave}
                          onDragOver={logoHandleDragOver}
                          onDrop={logoHandleDrop}
                          data-dragging={logoIsDragging || undefined}
                          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                        >
                          <input
                            {...logoGetInputProps()}
                            className="sr-only"
                            aria-label="Upload logo"
                            disabled={Boolean(logoFile)}
                          />

                          <div className="flex flex-col items-center justify-center text-center">
                            <div
                              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                              aria-hidden="true"
                            >
                              <Upload className="size-4 opacity-60" />
                            </div>
                            <p className="text-muted-foreground text-xs">
                              Porter & deposer ou cliquer pour televerser (max. {formatBytes(UPLOAD_FILE_MAX_SIZE)})
                            </p>
                          </div>
                        </div>
                      )}

                      {logoFile && (
                        <div
                          key={logoFile.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-background border border-dashed px-4 py-2"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium">{logoFile.file.name}</p>
                            </div>
                          </div>

                          <Button
                            size="icon-sm"
                            variant="accent"
                            className="-me-2"
                            onClick={() => logoRemoveFile(logoFile?.id)}
                            aria-label="Remove logo"
                          >
                            <Trash className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <Label>Charte graphique</Label>
                        <p className="text-xs text-muted-foreground">
                          Document de référence contenant vos couleurs, typographies, visuals
                        </p>
                      </div>

                      {brandGuidelinesErrors.length > 0 && <ErrorMessage message={brandGuidelinesErrors[0]} />}

                      {!brandGuidelinesFile && (
                        <div
                          role="button"
                          onClick={brandGuidelinesOpenFileDialog}
                          onDragEnter={brandGuidelinesHandleDragEnter}
                          onDragLeave={brandGuidelinesHandleDragLeave}
                          onDragOver={brandGuidelinesHandleDragOver}
                          onDrop={brandGuidelinesHandleDrop}
                          data-dragging={brandGuidelinesIsDragging || undefined}
                          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                        >
                          <input
                            {...brandGuidelinesGetInputProps()}
                            className="sr-only"
                            aria-label="Upload brand guidelines"
                            disabled={Boolean(brandGuidelinesFile)}
                          />

                          <div className="flex flex-col items-center justify-center text-center">
                            <div
                              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                              aria-hidden="true"
                            >
                              <Upload className="size-4 opacity-60" />
                            </div>
                            <p className="text-muted-foreground text-xs">
                              Porter & deposer ou cliquer pour televerser (max. {formatBytes(UPLOAD_FILE_MAX_SIZE)})
                            </p>
                          </div>
                        </div>
                      )}

                      {brandGuidelinesFile && (
                        <div
                          key={brandGuidelinesFile.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-background border border-dashed px-4 py-2"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium">{brandGuidelinesFile.file.name}</p>
                            </div>
                          </div>

                          <Button
                            size="icon-sm"
                            variant="accent"
                            className="-me-2"
                            onClick={() => brandGuidelinesRemoveFile(brandGuidelinesFile?.id)}
                            aria-label="Remove brand guidelines"
                          >
                            <Trash className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>URL de votre site internet</FormLabel>
                        <FormControl>
                          <Input placeholder="https://votre-site.com" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Auto-extraction possible de vos éléments graphiques
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-dashed">
                  <CardTitle>Visuels complémentaires</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {additionalVisualsErrors.length > 0 && <ErrorMessage message={additionalVisualsErrors[0]} />}

                  <div
                    role="button"
                    onClick={additionalVisualsOpenFileDialog}
                    onDragEnter={additionalVisualsHandleDragEnter}
                    onDragLeave={additionalVisualsHandleDragLeave}
                    onDragOver={additionalVisualsHandleDragOver}
                    onDrop={additionalVisualsHandleDrop}
                    data-dragging={additionalVisualsIsDragging || undefined}
                    className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-20 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                  >
                    <input
                      {...additionalVisualsGetInputProps()}
                      className="sr-only"
                      aria-label="Upload brand guidelines"
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <Upload className="size-4 opacity-60" />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Porter & deposer ou cliquer pour televerser (max. {formatBytes(UPLOAD_FILE_MAX_SIZE)})
                      </p>
                    </div>
                  </div>

                  {additionalVisualsFiles.length > 0 && (
                    <div className="space-y-2.5">
                      {additionalVisualsFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-background border border-dashed px-4 py-2"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium">{file.file.name}</p>
                            </div>
                          </div>

                          <Button
                            size="icon-sm"
                            variant="accent"
                            className="-me-2"
                            onClick={() => additionalVisualsRemoveFile(file.id)}
                            aria-label="Remove brand guidelines"
                          >
                            <Trash className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-dashed">
                  <CardTitle>Sélection des supports créatifs</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="divide-y divide-dashed">
                    {CREATIVE_SUPPORTS.map((support) => {
                      const isSelected = (form.watch("creativeSupports") || []).includes(support.id);

                      return (
                        <div
                          className="flex items-center gap-2 py-4"
                          key={`campaign-creative-support-${support.id}-item`}
                        >
                          {support.cost > 0 ? (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleCreativeSupportsChange(checked, support.id)}
                              id={`campaign-creative-support-${support.id}`}
                            />
                          ) : (
                            <span className="text-success-foreground bg-success/50 rounded-full size-5 flex items-center justify-center">
                              <Check className="size-3" />
                            </span>
                          )}
                          <Label
                            htmlFor={`campaign-creative-support-${support.id}`}
                            className="flex items-center justify-between gap-4 w-full text-base"
                          >
                            <span>{support.title}</span>
                            {support.cost > 0 ? (
                              <span className="text-muted-foreground bg-accent/50 text-sm border border-dashed px-2 py-1 rounded">
                                {formatCurrency(support.cost)}
                              </span>
                            ) : (
                              <span className="text-success bg-success/10 text-sm border border-success/10 border-dashed px-2 py-1 rounded">
                                Offert
                              </span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {currentStep === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="border-b border-dashed">
                    <CardTitle>Récapitulatif de la campagne</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Campagne</p>
                        <p className="font-medium">{form.getValues("name") || "Non défini"}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Période</p>
                        <p className="font-medium">
                          {form.getValues("startDate") &&
                          formatDateFromPattern(form.getValues("startDate"), "dd/MM/yyyy")
                            ? `${formatDateFromPattern(
                                form.getValues("startDate"),
                                "dd/MM/yyyy"
                              )} - ${formatDateFromPattern(form.getValues("endDate"), "dd/MM/yyyy")}`
                            : "Non définie"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Objectif</p>
                        <p className="font-medium">{getObjective()}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-medium">
                          {form.getValues("budget") ? formatCurrency(form.getValues("budget")) : "Non défini"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b border-dashed">
                    <CardTitle className="flex items-center justify-between">
                      <span>Éléments créatifs</span>
                      <span>
                        {formatCurrency(getCreativeSupports().reduce((total, support) => total + support.cost, 0))}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span>Annonce</span>
                      <span className="text-success bg-success/10 text-sm border border-success/10 border-dashed px-2 py-1 rounded">
                        Offert
                      </span>
                    </div>

                    {getCreativeSupports().map((support) => {
                      return (
                        <div
                          key={`selected-creative-support-${support.id}`}
                          className="flex items-center justify-between gap-4 w-full"
                        >
                          <span>{support.title}</span>
                          <span className="text-muted-foreground bg-accent/50 text-sm border border-dashed px-2 py-1 rounded">
                            {formatCurrency(support.cost)}
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                  <CardFooter className="border-t border-dashed flex items-center justify-between text-lg font-semibold">
                    <span>Montant total</span>
                    <span>
                      {formatCurrency(getCreativeSupports().reduce((total, support) => total + support.cost, 0))}
                    </span>
                  </CardFooter>
                </Card>
              </div>

              <Card className="h-fit">
                <CardHeader className="border-b border-dashed">
                  <CardTitle>Portefeuille</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="bg-accent/60 p-4 rounded-md mb-6">
                    <div className="flex justify-between items-center">
                      <p className="text-lg">Solde actuel</p>
                      <p className="font-bold text-2xl">{500} €</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <p>Budget de la campagne</p>
                      <p>{formatCurrency(form.getValues("budget") || 0)}</p>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <p>Éléments créatifs</p>
                      <p>{formatCurrency(getCreativeSupports().reduce((total, support) => total + support.cost, 0))}</p>
                    </div>

                    <div className="flex justify-between font-medium border-t pt-3 mt-3">
                      <p>Total à charger</p>
                      <p>{formatCurrency(getMontantTotal())}</p>
                    </div>

                    <div className="flex justify-between text-warning/80 font-medium">
                      <p>À débiter maintenant</p>
                      <p>{formatCurrency(getCreativeSupports().reduce((total, support) => total + support.cost, 0))}</p>
                    </div>
                  </div>

                  <div className="bg-info/10 border border-info/10 rounded-md p-4 text-sm text-info mb-6">
                    Seuls les éléments créatifs sélectionnés seront immédiatement débités de votre wallet. Le reste du
                    montant sera simplement chargé et activé lors du lancement de la campagne.
                  </div>

                  <div className="text-base font-semibold border border-dashed p-4 rounded-md text-center">
                    Recharge nécessaire: {formatCurrency(getMontantTotal() - 500 > 0 ? getMontantTotal() - 500 : 0)}
                  </div>

                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    <CreditCard />
                    {form.formState.isSubmitting ? "Paiement en cours..." : "Payer & Planifier la campagne"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft />
              Précédent
            </Button>

            <div>
              {currentStep < FORM_STEPS.length && (
                <Button variant="default" onClick={handleNext}>
                  {currentStep === FORM_STEPS.length - 1 ? "Voir le récapitulatif" : "Suivant"}
                  {currentStep === FORM_STEPS.length - 1 ? <Eye /> : <ArrowRight />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
