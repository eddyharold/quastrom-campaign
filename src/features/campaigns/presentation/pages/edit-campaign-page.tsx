import { Fragment, useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { ArrowLeft, ArrowRight, FileText, Target, Check, Euro, Info, CheckCircle2, Save } from "lucide-react";
import { cn } from "@/domain/utils/common";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { DatePicker } from "@/presentation/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { PageHeader } from "@/presentation/components/page-header";
import { RadioGroup, RadioGroupItem } from "@/presentation/components/ui/radio-group";
import { Badge } from "@/presentation/components/ui/badge";
import { formatCurrency } from "@/domain/utils/currency";
import { formatIntervalDateToHuman } from "@/domain/utils/date";
import { useGetAllCampaignObjective } from "../../application/use-cases/get-all-campaign-objective-query";
import { useUpdateCampaignForm } from "../hooks/use-campaign-form";
import { useGetCampaign } from "../../application/use-cases/get-campaign-query";
import { useParams } from "react-router";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { useUpdateCampaign } from "../../application/use-cases/update-campaign-mutation";
import { toast } from "sonner";

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

export default function EditCampaign() {
  const { updateBreadcrumb } = useLayoutContext();

  const { id } = useParams();

  const { data: campaign, isLoading } = useGetCampaign(id as string);
  const { mutateAsync: updateCampaign, isPending: isUpdateCampaignLoading, error } = useUpdateCampaign(id as string);
  const { data: objectives } = useGetAllCampaignObjective();

  const [currentStep, setCurrentStep] = useState(1);

  const form = useUpdateCampaignForm();

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

  const handleScrollToStep = () => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleSelectObjective = (value: string) => {
    form.setValue("campaign_objective_id", value);
    form.setValue("commission_model", campaign?.commission_model || "");
    form.setValue("commission_value", Number(campaign?.commission_value || 0).toString());
    form.setValue("budget", Number(campaign?.budget || "").toString());
    form.setValue("estimated_leads", Number(campaign?.estimated_leads || "").toString());
    // form.setValue(
    //   "validation_condition_selected",
    //   typeof campaign?.validation_condition_selected === "string" ? campaign?.validation_condition_selected : []
    // );
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

  const selectedObjective = form.watch("campaign_objective_id");
  const budget = Number(form.watch("budget") || 0);

  const estimatedLeads = Number(form.watch("estimated_leads") || 0);

  const objective = useMemo(() => {
    return objectives?.find((obj) => obj.id.toString() === selectedObjective);
  }, [selectedObjective, objectives]);

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

  const handleSubmit = async () => {
    if ((await form.trigger()) === false) {
      return;
    }

    updateCampaign(form.getValues()).then(() => {
      toast.success("Mise à jour effectuée", {
        description: "Campagne mise à jour avec succès",
      });
    });
  };

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
        title: "Mise à jour",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name,
        description: campaign.description,
        start_date: campaign.start_date ? new Date(campaign.start_date) : undefined,
        end_date: campaign.end_date ? new Date(campaign.end_date) : undefined,
        category: campaign.category,
        campaign_objective_id:
          typeof campaign.objective?.id === "string"
            ? campaign.campaign_objective_id
            : campaign.objective?.id?.toString(),
        commission_model: campaign.commission_model,
        commission_value: Number(campaign.commission_value).toString(),
        conversion_rate: Number(campaign.conversion_rate).toString(),
        budget: Number(campaign.budget).toString(),
        estimated_leads: Number(campaign.estimated_leads).toString(),
        // validation_condition_selected:
        //   typeof campaign.validation_condition_selected === "string" ? [] : campaign.validation_condition_selected,
        validation_condition_selected: [],
      });
    }
  }, [campaign, form]);

  return (
    <div className="flex-1 overflow-auto p-6">
      <Form {...form}>
        <div className="max-w-5xl mx-auto space-y-6">
          <PageHeader
            title={campaign?.name || "Mise à jour de la campagne"}
            subtitle="Complétez les étapes ci-dessous pour configurer et activer votre campagne"
            navigateBackTo="/campaigns"
          />

          {isLoading ? (
            <Skeleton className="h-full" />
          ) : campaign ? (
            <>
              <Card className="pt-10 px-8">{renderStepIndicator()}</Card>
              {error?.message && (
                <div className="flex items-center gap-2 text-destructive p-4 min-h-12 text-sm bg-destructive/10 font-medium rounded-lg">
                  <Info className="size-5 text-destructive shrink-0" />
                  <span className="text-sm text-destructive">{error?.message}</span>
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
                                defaultValue={campaign?.start_date ? new Date(campaign.start_date) : undefined}
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
                                defaultValue={campaign?.end_date ? new Date(campaign.end_date) : undefined}
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
                                      <FormLabel htmlFor="commission-model-percentage">
                                        Pourcentage de la vente
                                      </FormLabel>
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
                              <span className="font-semibold text-primary">{formatCurrency(budget)}</span> et prix par
                              lead de{" "}
                              <span className="font-semibold text-primary">
                                {formatCurrency(objective?.price_lead)}
                              </span>
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

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                  <ArrowLeft />
                  Précédent
                </Button>

                {currentStep < FORM_STEPS.length ? (
                  <Button onClick={handleNext}>
                    Suivant
                    <ArrowRight />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} isLoading={isUpdateCampaignLoading}>
                    <Save /> Mettre a jour
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Skeleton className="h-full" />
          )}
        </div>
      </Form>
    </div>
  );
}
