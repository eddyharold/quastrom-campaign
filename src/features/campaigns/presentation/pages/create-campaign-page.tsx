import { Fragment, useEffect, useMemo, useState } from "react";
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
  Package,
  Palette,
  Check,
  Euro,
  Trash,
  Info,
  Eye,
  Sparkles,
  Link2,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/domain/utils/common";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { DatePicker } from "@/presentation/components/ui/date-picker";
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
import { formatDateFromPattern, formatIntervalDateToHuman } from "@/domain/utils/date";
import { useGetAllCampaignObjective } from "../../application/use-cases/get-all-campaign-objective-query";
import { useGetAllCreative } from "../../application/use-cases/get-all-creative-query";
import { useGetWallet } from "@/application/use-cases/get-wallet-query";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CampaignCheckoutForm } from "../components/campaing-checkout-form";
import { Link } from "react-router";
import { useCampaignForm } from "../hooks/use-campaign-form";
import { STRIPE_SECRET_KEY } from "@/domain/constants/stripe";

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

const BTP_CATEGORIES = ["BTP", "Energies", "Immobilier", "Assurances", "Finances", "Automobile", "Autre"];
// const BTP_CATEGORIES = [
//   "Bâtiment et Travaux Publics (BTP)",
//   "Énergies et Environnement",
//   "Immobilier et Aménagement",
//   "Assurance et Gestion des Risques",
//   "Banque et Services Financiers",
//   "Industrie Automobile et Mobilité",
//   "Autres Secteurs d’Activité",
// ];

const stripePromise = loadStripe(STRIPE_SECRET_KEY);

export default function CreateCampaign() {
  const { updateBreadcrumb } = useLayoutContext();

  const [currentStep, setCurrentStep] = useState(1);
  const [upladContactListFile, setUpladContactListFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: objectives } = useGetAllCampaignObjective();
  const { data: creatives } = useGetAllCreative();
  const { data: wallet } = useGetWallet();

  const form = useCampaignForm();

  const [
    { files, isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
  ] = useFileUpload({
    maxSize: UPLOAD_FILE_MAX_SIZE,
    initialFiles: [],
    onFilesChange: (files) => {
      const file = files.length > 0 ? files[0] || null : null;

      if (file) {
        form.setValue("contacts_file", file.file as File);
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
        form.setValue("logo", file.file as File);
      }
    },
  });

  const [
    { files: visuelIdentityFiles, isDragging: visuelIdentityIsDragging, errors: visuelIdentityErrors },
    {
      handleDragEnter: visuelIdentityHandleDragEnter,
      handleDragLeave: visuelIdentityHandleDragLeave,
      handleDragOver: visuelIdentityHandleDragOver,
      handleDrop: visuelIdentityHandleDrop,
      openFileDialog: visuelIdentityOpenFileDialog,
      removeFile: visuelIdentityRemoveFile,
      getInputProps: visuelIdentityGetInputProps,
    },
  ] = useFileUpload({
    maxSize: UPLOAD_FILE_MAX_SIZE,
    initialFiles: [],
    onFilesChange: (files) => {
      const file = files.length > 0 ? files[0] || null : null;

      if (file) {
        form.setValue("visuel_identify", file.file as File);
      }
    },
  });

  const [
    { files: moreVisuelFIlesFiles, isDragging: moreVisuelFIlesIsDragging, errors: moreVisuelFIlesErrors },
    {
      handleDragEnter: moreVisuelFIlesHandleDragEnter,
      handleDragLeave: moreVisuelFIlesHandleDragLeave,
      handleDragOver: moreVisuelFIlesHandleDragOver,
      handleDrop: moreVisuelFIlesHandleDrop,
      openFileDialog: moreVisuelFIlesOpenFileDialog,
      removeFile: moreVisuelFIlesRemoveFile,
      getInputProps: moreVisuelFIlesGetInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxSize: UPLOAD_FILE_MAX_SIZE,
    initialFiles: [],
    onFilesChange: (files) => {
      const visuals = files.length > 0 ? files.map((file) => file.file) : [];
      form.setValue("visuel", visuals as File[]);
    },
  });

  const contactListFile = files[0] || null;
  const logoFile = logoFiles[0] || null;
  const visuelIdentityFile = visuelIdentityFiles[0] || null;

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
    handleScrollToStep();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    handleScrollToStep();
  };

  const handleNext = () => nextStep();
  const handlePrevious = () => prevStep();

  const handleReset = () => {
    form.reset();
    setCurrentStep(1);
    setErrorMessage("");
  };

  const handleScrollToStep = () => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleObjectiveTypeChange = (value: boolean) => {
    setUpladContactListFile(value);
    form.setValue("campaign_objective_id", "");
    removeFile(contactListFile.id);
  };

  const handleSelectObjective = (value: string) => {
    form.setValue("campaign_objective_id", value);
    form.setValue("commission_model", "");
    form.setValue("commission_value", "");
    form.setValue("budget", "");
    form.setValue("estimated_leads", "");
    form.setValue("validation_condition_selected", []);
  };

  const handleEligibilityConditionsChange = (checked: boolean | "indeterminate", condition: string) => {
    const conditions = form.watch("validation_condition_selected") || [];
    if (checked && checked !== "indeterminate") {
      form.setValue("validation_condition_selected", [...conditions, condition]);
    } else {
      form.setValue(
        "validation_condition_selected",
        conditions.filter((id) => id !== condition)
      );
    }
  };

  const handleCreativeSupportsChange = (checked: boolean | "indeterminate", support: string) => {
    const supports = form.watch("campaign_selected_creatives") || [];
    if (checked && checked !== "indeterminate") {
      form.setValue("campaign_selected_creatives", [...supports, support]);
    } else {
      form.setValue(
        "campaign_selected_creatives",
        supports.filter((id) => id !== support)
      );
    }
  };

  const selectedObjective = form.watch("campaign_objective_id");
  const selectedCreatives = form.watch("campaign_selected_creatives");
  const budget = Number(form.watch("budget") || 0);
  const walletBalance = Number(wallet?.balance || 0);

  const estimatedLeads = Number(form.watch("estimated_leads") || 0);

  const objective = useMemo(() => {
    return objectives?.find((obj) => obj.id.toString() === selectedObjective);
  }, [selectedObjective, objectives]);

  const creativeSupports = useMemo(() => {
    return creatives?.filter((support) => (selectedCreatives || []).includes(support.code)) || [];
  }, [selectedCreatives, creatives]);

  const creativeCost = useMemo(() => {
    return creativeSupports?.reduce((total, support) => total + support.price, 0);
  }, [creativeSupports]);

  const paymentAmount = useMemo(() => {
    const totalCost = budget + creativeCost;
    if (walletBalance >= totalCost) return 0;
    return totalCost - walletBalance;
  }, [budget, creativeCost, walletBalance]);

  const handleBudgetChange = (value: string) => {
    const budgetValue = Number(value);

    if (isNaN(budgetValue)) return;

    form.setValue("budget", value);

    if (!objective) return;
    const costPerLead = Number(objective.price_lead);

    if (!isNaN(costPerLead) && costPerLead > 0) {
      const estimatedLeads = Math.round(budgetValue / costPerLead);
      form.setValue("estimated_leads", estimatedLeads.toString());
    }
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

          {errorMessage && (
            <div className="flex items-center gap-2 text-destructive p-4 min-h-12 text-sm bg-destructive/10 font-medium rounded-lg">
              <Info className="size-5 text-destructive shrink-0" />
              <span className="text-sm text-destructive">{errorMessage}</span>
            </div>
          )}

          {Object.entries(form.formState.errors).length > 0 && (
            <div className="flex gap- text-destructive p-4 min-h-12 text-sm bg-destructive/10 font-medium rounded-lg">
              <ul className="list-disc list-inside">
                {Object.entries(form.formState.errors).map(([key, error]) => (
                  <li key={key}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader className="border-b border-dashed">
                <CardTitle>{FORM_STEPS[currentStep - 1].title}</CardTitle>
                <CardDescription>{FORM_STEPS[currentStep - 1].description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
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

                <div className="h-px border-t border-dashed" />

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
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de début</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            disabledUntil={new Date()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de fin</FormLabel>
                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            disabledUntil={form.watch("start_date") || new Date()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("start_date") && form.watch("end_date") && (
                    <div className="col-span-2 text-sm text-info flex items-center gap-2">
                      <Info className="size-3.5 shrink-0" /> Approximativement{" "}
                      {formatIntervalDateToHuman(form.watch("start_date"), form.watch("end_date"))} de campagne
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <>
              <Card className="px-6">
                <div className="space-y-6">
                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Qualification de contacts existants</Label>
                      <div className="text-sm text-muted-foreground">
                        Téléversez votre fichier de contacts à qualifier. Aucun lead externe ne sera généré.
                      </div>
                    </div>
                    <Switch checked={upladContactListFile} onCheckedChange={handleObjectiveTypeChange} />
                  </div>

                  {upladContactListFile && (
                    <>
                      {errors.length > 0 && <ErrorMessage message={errors[0]} />}

                      {!contactListFile && (
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
                            disabled={Boolean(contactListFile)}
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

                      {contactListFile && (
                        <div
                          key={contactListFile.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-background border border-dashed px-4 py-2"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium">{contactListFile.file.name}</p>
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
                    name="campaign_objective_id"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            value={field.value}
                            onValueChange={handleSelectObjective}
                          >
                            {objectives?.map((objective) => (
                              <FormItem
                                key={`campaign-objective-${objective.id}-item`}
                                className="border-input has-data-[state=checked]:border-transparent has-data-[state=checked]:ring-3 has-data-[state=checked]:ring-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={objective.id.toString()}
                                    id={`campaign-objective-${objective.id}-radio`}
                                    aria-describedby={`campaign-objective-${objective.id}-description`}
                                    className="order-1 after:absolute after:inset-0"
                                  />
                                </FormControl>

                                <div className="font-normal flex grow items-start gap-3">
                                  <div className="grid grow gap-2">
                                    <FormLabel htmlFor={`campaign-objective-${objective.code}`}>
                                      {objective.name}
                                    </FormLabel>
                                    <p
                                      id={`campaign-objective-${objective.code}-description`}
                                      className="text-muted-foreground text-xs"
                                    >
                                      {objective.description}
                                    </p>
                                    {!!objective.price_lead && Number(objective.price_lead) > 0 && (
                                      <Badge size="xs" variant="accent" className="text-[0.7rem] px-2 py-0.5">
                                        ~{formatCurrency(Number(objective.price_lead))}
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

                  {objective?.code === "sale_confirmed" && (
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
                          name="commission_model"
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

                        {form.watch("commission_model") === "fixed" && (
                          <FormField
                            control={form.control}
                            name="commission_value"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormControl>
                                  <Input placeholder="Ex: 50 pour 50€" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {form.watch("commission_model") === "percentage" && (
                          <FormField
                            control={form.control}
                            name="conversion_rate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormControl>
                                  <Input placeholder="Ex: 10 pour 10%" {...field} />
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
                          <Input
                            placeholder="Ex: 1000"
                            {...field}
                            onChange={(e) => handleBudgetChange(e.target.value)}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-muted-foreground">€</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />

                      {budget > 0 && (
                        <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                          <Info className="size-4 shrink-0" /> Avec un budget de{" "}
                          <span className="font-semibold text-primary">{formatCurrency(budget)}</span> et prix par lead
                          de <span className="font-semibold text-primary">{formatCurrency(objective?.price_lead)}</span>
                          , vous aurez environ <span className="font-semibold text-primary">{estimatedLeads}</span>{" "}
                          leads.
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {objective &&
                  (!objective?.validation_conditions || objective?.validation_conditions.length === 0 ? (
                    <div className="flex items-center space-x-2 h-12 p-4 bg-success/10 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <span className="text-sm">
                        Le lead doit avoir rempli le formulaire avec un nom et un numéro de téléphone valides.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Conditions de validation</h3>

                      <div className="divide-y divide-dashed">
                        {objective?.validation_conditions?.map((condition) => {
                          const isSelected = (form.watch("validation_condition_selected") || []).includes(
                            condition.name
                          );

                          return (
                            <div className="flex items-start gap-2 py-4 boder">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleEligibilityConditionsChange(checked, condition.name)
                                }
                                id={condition.name}
                                aria-describedby={`campaign-eligibility-conditions-${condition.name}-description`}
                              />
                              <div className="grid grow gap-1.5">
                                <Label htmlFor={condition.name}>{condition.label}</Label>
                                <p
                                  id={`campaign-eligibility-conditions-${condition.description}-description`}
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
                  ))}
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

                      {visuelIdentityErrors.length > 0 && <ErrorMessage message={visuelIdentityErrors[0]} />}

                      {!visuelIdentityFile && (
                        <div
                          role="button"
                          onClick={visuelIdentityOpenFileDialog}
                          onDragEnter={visuelIdentityHandleDragEnter}
                          onDragLeave={visuelIdentityHandleDragLeave}
                          onDragOver={visuelIdentityHandleDragOver}
                          onDrop={visuelIdentityHandleDrop}
                          data-dragging={visuelIdentityIsDragging || undefined}
                          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                        >
                          <input
                            {...visuelIdentityGetInputProps()}
                            className="sr-only"
                            aria-label="Upload brand guidelines"
                            disabled={Boolean(visuelIdentityFile)}
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

                      {visuelIdentityFile && (
                        <div
                          key={visuelIdentityFile.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-background border border-dashed px-4 py-2"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium">{visuelIdentityFile.file.name}</p>
                            </div>
                          </div>

                          <Button
                            size="icon-sm"
                            variant="accent"
                            className="-me-2"
                            onClick={() => visuelIdentityRemoveFile(visuelIdentityFile?.id)}
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
                    name="website"
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
                  {moreVisuelFIlesErrors.length > 0 && <ErrorMessage message={moreVisuelFIlesErrors[0]} />}

                  <div
                    role="button"
                    onClick={moreVisuelFIlesOpenFileDialog}
                    onDragEnter={moreVisuelFIlesHandleDragEnter}
                    onDragLeave={moreVisuelFIlesHandleDragLeave}
                    onDragOver={moreVisuelFIlesHandleDragOver}
                    onDrop={moreVisuelFIlesHandleDrop}
                    data-dragging={moreVisuelFIlesIsDragging || undefined}
                    className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-20 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
                  >
                    <input
                      {...moreVisuelFIlesGetInputProps()}
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

                  {moreVisuelFIlesFiles.length > 0 && (
                    <div className="space-y-2.5">
                      {moreVisuelFIlesFiles.map((file) => (
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
                            onClick={() => moreVisuelFIlesRemoveFile(file.id)}
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
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>Sélection des supports créatifs</CardTitle>
                    <div className="text-lg font-semibold">{formatCurrency(creativeCost)}</div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="divide-y divide-dashed">
                    {creatives?.map((support) => {
                      const isSelected = (form.watch("campaign_selected_creatives") || []).includes(support.code);

                      return (
                        <div
                          className="flex items-center gap-2 py-4"
                          key={`campaign-creative-support-${support.code}-item`}
                        >
                          {support.price > 0 ? (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleCreativeSupportsChange(checked, support.code)}
                              id={`campaign-creative-support-${support.code}`}
                            />
                          ) : (
                            <span className="text-success-foreground bg-success/50 rounded-full size-5 flex items-center justify-center">
                              <Check className="size-3" />
                            </span>
                          )}
                          <Label
                            htmlFor={`campaign-creative-support-${support.code}`}
                            className="flex items-center justify-between gap-4 w-full"
                          >
                            <span>{support.description}</span>
                            {support.price > 0 ? (
                              <span className="text-muted-foreground bg-accent/50 text-sm border border-dashed px-2 py-1 rounded">
                                {formatCurrency(support.price)}
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
                          {form.getValues("start_date") &&
                          formatDateFromPattern(form.getValues("start_date"), "dd/MM/yyyy")
                            ? `${formatDateFromPattern(
                                form.getValues("start_date"),
                                "dd/MM/yyyy"
                              )} - ${formatDateFromPattern(form.getValues("end_date"), "dd/MM/yyyy")}`
                            : "Non définie"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Objectif</p>
                        <p className="font-medium">{objective?.name || "Non défini"}</p>
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
                      <span>{formatCurrency(creativeCost)}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span>Annonce</span>
                      <span className="text-success bg-success/10 text-sm border border-success/10 border-dashed px-2 py-1 rounded">
                        Offert
                      </span>
                    </div>

                    {creativeSupports.map((support) => {
                      return (
                        <div
                          key={`selected-creative-support-${support.name}`}
                          className="flex items-center justify-between gap-4 w-full"
                        >
                          <span>{support.name}</span>
                          <span className="text-muted-foreground bg-accent/50 text-sm border border-dashed px-2 py-1 rounded">
                            {formatCurrency(support.price)}
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                  <CardFooter className="border-t border-dashed flex items-center justify-between text-lg font-semibold">
                    <span>Montant total</span>
                    <span>{formatCurrency(creativeCost)}</span>
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
                      <p className="font-bold text-2xl">{formatCurrency(walletBalance)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <p>Budget de la campagne</p>
                      <p>{formatCurrency(form.getValues("budget") || 0)}</p>
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <p>Éléments créatifs</p>
                      <p>{formatCurrency(creativeCost)}</p>
                    </div>

                    <div className="flex justify-between font-medium border-t pt-3 mt-3">
                      <p>Total à charger</p>
                      <p>{formatCurrency(paymentAmount)}</p>
                    </div>

                    <div className="flex justify-between text-warning/80 font-medium">
                      <p>À débiter maintenant</p>
                      <p>{formatCurrency(creativeCost)}</p>
                    </div>
                  </div>

                  <div className="bg-info/10 border border-info/10 rounded-md p-4 text-sm text-info mb-6">
                    Seuls les éléments créatifs sélectionnés seront immédiatement débités de votre wallet. Le reste du
                    montant sera simplement chargé et activé lors du lancement de la campagne.
                  </div>

                  <Elements stripe={stripePromise}>
                    <CampaignCheckoutForm
                      form={form}
                      paymentAmount={paymentAmount}
                      onSuccess={nextStep}
                      onError={setErrorMessage}
                      handlePrevious={handlePrevious}
                    />
                  </Elements>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 6 && (
            <Card>
              <CardContent className="p-10 text-center space-y-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="size-20 bg-gradient-to-br dark:from-success/50 dark:to-success/40 from-success to-success/80 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                      <CheckCircle className="size-10 text-success-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="size-6 dark:text-foreground text-primary animate-pulse" />
                    </div>
                    <div className="absolute -bottom-2 -left-2">
                      <Sparkles className="size-6 dark:text-foreground text-primary animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-3xl font-semibold leading-tight tracking-tight">
                      Campagne créée avec succès 🎉
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-success/20 to-success/80 rounded-full mx-auto"></div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Votre campagne d'affiliation est maintenant configurée et sauvegardée dans votre compte.
                  </p>
                </div>

                <div className="block font-semibold text-lg max-w-lg mx-auto">
                  Next step : l'activation pour commencer à générer des revenus 💡
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" asChild className="h-10">
                      <Link to="/campaigns">
                        <Link2 />
                        Voir mes campagnes
                      </Link>
                    </Button>

                    <Button className="h-10" onClick={handleReset}>
                      <Plus />
                      Nouvelle campagne
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep < FORM_STEPS.length && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft />
                Précédent
              </Button>

              <Button variant="default" onClick={handleNext}>
                {currentStep === FORM_STEPS.length - 1 ? (
                  <>
                    <Eye /> Récapitulatif
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
