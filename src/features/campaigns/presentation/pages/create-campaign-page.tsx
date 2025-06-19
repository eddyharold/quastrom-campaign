"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/presentation/components/ui/card"
import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { Label } from "@/presentation/components/ui/label"
import { Textarea } from "@/presentation/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select"
import { Checkbox } from "@/presentation/components/ui/checkbox"
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
  Users,
} from "lucide-react"

const steps = [
  { number: 1, title: "Informations", icon: FileText, description: "Renseignez les informations principales de votre campagne." },
  { number: 2, title: "Objectif", icon: Target, description: "Choisissez un objectif pour votre campagne." },
  { number: 3, title: "Budget", icon: Calculator, description: "Définissez le budget et les règles de conversion." },
  { number: 4, title: "Créatifs", icon: Palette, description: "Ajoutez les éléments créatifs." },
  { number: 5, title: "Récapitulatif", icon: Package, description: "Vérifiez et validez votre campagne." },
];

const campaignObjectives = [
  {
    id: "lead-generation",
    title: "Génération de leads simples",
    description: "Collecte de contacts qualifiés pour votre entreprise",
    estimatedCost: 35,
    icon: Target,
    tooltip: "Coût estimé par lead généré."
  },
  {
    id: "appointment",
    title: "Rendez-vous qualifiés",
    description: "Génération de RDV commerciaux qualifiés",
    estimatedCost: 45,
    icon: CalendarDays,
    tooltip: "Coût estimé par rendez-vous pris."
  },
  {
    id: "callback",
    title: "Appels / Rappels",
    description: "Demandes de contact téléphonique",
    estimatedCost: 30,
    icon: Phone,
    tooltip: "Coût estimé par appel/rappel."
  },
  {
    id: "quote",
    title: "Demande de devis",
    description: "Collecte de demandes de devis qualifiées",
    estimatedCost: 50,
    icon: Calculator,
    tooltip: "Coût estimé par devis qualifié."
  },
  {
    id: "conversion",
    title: "Conversion commerciale",
    description: "Paiement uniquement sur vente confirmée",
    estimatedCost: 0,
    icon: ShoppingCart,
    tooltip: "Paiement uniquement sur vente confirmée."
  },
]



const btpCategories = [
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

type CampaignData = {
  name: string;
  description: string;
  objectiveType: "qualification" | "classic";
  classicObjective: string;
  hasQualificationFile: boolean;
  qualificationFile: File | null;
  budget: string;
  budgetType: string;
  hasCreatives: boolean;
  commissionModel: string;
  commissionValue: string;
  eligibilityConditions: string[];
  logo: File | null;
  brandGuidelines: File | null;
  websiteUrl: string;
  additionalVisuals: File[];
  creativeSupports: string[];
  creativeElements: string[];
  walletBalance: number;
  conversionStatuses: string[];
  startDate?: string;
  endDate?: string;
  category?: string;
};

export default function CreateCampaign() {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    description: "",
    objectiveType: "classic" as "qualification" | "classic",
    classicObjective: "",
    hasQualificationFile: false,
    qualificationFile: null,
    budget: "",
    budgetType: "total",
    hasCreatives: false,
    commissionModel: "",
    commissionValue: "",
    eligibilityConditions: [],
    logo: null,
    brandGuidelines: null,
    websiteUrl: "",
    additionalVisuals: [],
    creativeSupports: [],
    creativeElements: ["announcement"],
    walletBalance: 1250,
    conversionStatuses: []
  })

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => nextStep();
  const handlePrevious = () => prevStep();

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between gap-2 mt-2">
      {steps.map((step, idx) => {
        // Define the state of each step
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;
        const isPending = currentStep < step.number;
        
        return (
          <div key={step.number} className="flex items-center gap-1 flex-1">
            {/* Step Circle */}
            <div
              className={`rounded-full flex items-center justify-center border-2 transition-all h-8 w-8 shrink-0
                ${isCompleted ? "bg-primary border-primary text-white" : ""}
                ${isCurrent ? "border-primary bg-white text-primary ring-2 ring-primary/20" : ""}
                ${isPending ? "border-gray-300 bg-white text-gray-400" : ""}`}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            
            {/* Step Title */}
            <span 
              className={`text-xs font-medium
                ${isCompleted ? "text-primary" : ""}
                ${isCurrent ? "text-primary font-semibold" : ""}
                ${isPending ? "text-gray-400" : ""}`}
            >
              {step.title}
            </span>
            
            {/* Connector Line */}
            {idx !== steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-1 transition-all
                  ${isCompleted ? "bg-primary" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>
                    Step {currentStep} of {steps.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                {renderStepIndicator()}
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: General Information */}
              {currentStep === 1 && (
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter campaign name"
                      value={campaignData.name}
                      onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">This is the public name of your campaign.</p>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign objectives and target audience"
                      rows={4}
                      value={campaignData.description}
                      onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Describe your campaign objectives and target audience.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={campaignData.startDate}
                        onChange={(e) => setCampaignData({ ...campaignData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={campaignData.endDate}
                        onChange={(e) => setCampaignData({ ...campaignData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">BTP Category</Label>
                    <Select
                      value={campaignData.category}
                      onValueChange={(value) => setCampaignData({ ...campaignData, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select your business sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {btpCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              )}

              {/* Step 2: Campaign Objectives */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold">Choix de l'objectif</h2>
                    <p className="text-muted-foreground">Sélectionnez le type de campagne qui correspond à vos besoins</p>
                  </div>

                  {/* Qualification Option */}
                  <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
                    <div className="flex gap-4">
                      <div className="bg-amber-100 rounded-full p-3 h-12 w-12 flex items-center justify-center">
                        <Users className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-medium text-lg">Qualification de contacts existants</h3>
                        <p className="text-sm text-muted-foreground">Téléversez votre fichier de contacts à qualifier. Aucun lead externe ne sera généré.</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <input 
                            type="radio" 
                            id="qualification-option" 
                            className="rounded-full text-primary"
                            checked={campaignData.objectiveType === "qualification"}
                            onChange={() => setCampaignData({ 
                              ...campaignData, 
                              objectiveType: "qualification",
                              classicObjective: ""
                            })}
                          />
                          <label htmlFor="qualification-option" className="text-sm font-medium">Choisir cette option</label>
                        </div>

                        {campaignData.objectiveType === "qualification" && (
                          <div className="mt-4">
                            <div className="border border-dashed border-amber-300 rounded-lg p-6 bg-white">
                              <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className="text-amber-500">
                                  <Upload className="h-10 w-10" />
                                </div>
                                <div>
                                  <h4 className="font-medium">Glissez votre fichier ici ou cliquez pour sélectionner</h4>
                                  <p className="text-sm text-muted-foreground mt-1">Formats acceptés: .xls, .xlsx, .csv (max 10 Mo)</p>
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                                  onClick={() => {
                                    // This would normally trigger a file input
                                    document.getElementById('file-upload')?.click();
                                  }}
                                >
                                  Sélectionner un fichier
                                </Button>
                                <input 
                                  type="file" 
                                  id="file-upload" 
                                  className="hidden" 
                                  accept=".xls,.xlsx,.csv"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setCampaignData({
                                        ...campaignData,
                                        qualificationFile: e.target.files[0]
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            {campaignData.qualificationFile && (
                              <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                <span>Fichier sélectionné: {campaignData.qualificationFile.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Classic Objectives */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Objectifs classiques</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {campaignObjectives.map((objective) => (
                        <div
                          key={objective.id}
                          className={`border rounded-lg cursor-pointer transition-all relative ${
                            campaignData.objectiveType === "classic" && campaignData.classicObjective === objective.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          }`}
                          onClick={() => setCampaignData({ 
                            ...campaignData, 
                            objectiveType: "classic",
                            classicObjective: objective.id 
                          })}
                        >
                          {campaignData.objectiveType === "classic" && campaignData.classicObjective === objective.id && (
                            <div className="absolute top-2 right-2 text-primary">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="bg-gray-100 rounded-lg p-2 w-10 h-10 flex items-center justify-center mb-3">
                              <objective.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-medium">{objective.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                            <div className="mt-3 text-sm font-medium text-muted-foreground">
                              {objective.estimatedCost > 0 ? `~${objective.estimatedCost} €` : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Commission Model - Only shown when Conversion commerciale is selected */}
                  {campaignData.objectiveType === "classic" && campaignData.classicObjective === "conversion" && (
                    <div 
                      className="bg-primary rounded-lg p-6 border border-amber-100 mt-6 text-white animate-in fade-in slide-in-from-bottom-5 duration-500"
                      style={{ animationFillMode: 'forwards' }}
                    >
                      <h3 className="font-semibold text-lg mb-4">Modèle de commission</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="fixed-amount" 
                            name="commission-model"
                            className="rounded-full text-primary"
                            checked={campaignData.commissionModel === "fixed"}
                            onChange={() => setCampaignData({ 
                              ...campaignData, 
                              commissionModel: "fixed" 
                            })}
                          />
                          <label htmlFor="fixed-amount" className="text-sm font-medium">Montant fixe</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="percentage" 
                            name="commission-model"
                            className="rounded-full text-primary"
                            checked={campaignData.commissionModel === "percentage"}
                            onChange={() => setCampaignData({ 
                              ...campaignData, 
                              commissionModel: "percentage" 
                            })}
                          />
                          <label htmlFor="percentage" className="text-sm font-medium">Pourcentage de la vente</label>
                        </div>
                        
                        {campaignData.commissionModel && (
                          <div className="mt-4">
                            <Label htmlFor="commission-value">
                              {campaignData.commissionModel === "fixed" ? "Montant (€)" : "Pourcentage (%)"}:
                            </Label>
                            <Input
                              id="commission-value"
                              type="number"
                              placeholder={campaignData.commissionModel === "fixed" ? "ex: 50" : "ex: 10"}
                              value={campaignData.commissionValue}
                              onChange={(e) => setCampaignData({ ...campaignData, commissionValue: e.target.value })}
                              className="mt-1 max-w-xs bg-white"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                 
                </div>
              )}

              {/* Step 3: Budget & Lead Validation */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold">Budget & validation du lead</h2>
                    <p className="text-muted-foreground">Définissez votre budget et les conditions de validation</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Budget Section */}
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <h3 className="font-semibold text-lg mb-6">Budget total</h3>
                      
                      <div className="relative">
                        <Input
                          id="budget"
                          type="number"
                          placeholder="Entrez votre budget"
                          value={campaignData.budget}
                          onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                          className="pr-10 h-12 text-right"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>

                    {/* Validation Conditions */}
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                      <h3 className="font-semibold text-lg mb-6">Conditions de validation</h3>
                      
                      <div className="space-y-4">
                        {[
                          {
                            id: "signed-quote",
                            label: "Devis signé",
                            description: "Le prospect a accepté une estimation"
                          },
                          {
                            id: "appointment-booked",
                            label: "RDV pris",
                            description: "Un créneau a été réservé pour échange"
                          },
                          {
                            id: "confirmed-sale",
                            label: "Vente confirmée",
                            description: "Action commerciale réalisée"
                          },
                          {
                            id: "qualified-lead",
                            label: "Fiche qualifiée",
                            description: "Lead validé manuellement ou via scoring"
                          }
                        ].map((condition) => {
                          const isSelected = campaignData.eligibilityConditions.includes(condition.id);
                          return (
                            <div 
                              key={condition.id} 
                              className={`border rounded-lg p-4 transition-all duration-200 ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200'}`}
                              onClick={() => {
                                if (isSelected) {
                                  setCampaignData({
                                    ...campaignData,
                                    eligibilityConditions: campaignData.eligibilityConditions.filter(
                                      (id) => id !== condition.id
                                    ),
                                  });
                                } else {
                                  setCampaignData({
                                    ...campaignData,
                                    eligibilityConditions: [...campaignData.eligibilityConditions, condition.id],
                                  });
                                }
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  id={condition.id}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked && checked !== "indeterminate") {
                                      setCampaignData({
                                        ...campaignData,
                                        eligibilityConditions: [...campaignData.eligibilityConditions, condition.id],
                                      })
                                    } else {
                                      setCampaignData({
                                        ...campaignData,
                                        eligibilityConditions: campaignData.eligibilityConditions.filter(
                                          (id) => id !== condition.id
                                        ),
                                      })
                                    }
                                  }}
                                />
                                <div>
                                  <Label htmlFor={condition.id} className="font-medium cursor-pointer">
                                    {condition.label}
                                  </Label>
                                  <p className="text-sm text-muted-foreground mt-1">{condition.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Creatives */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold">Éléments créatifs & identité visuelle</h2>
                    <p className="text-muted-foreground">Personnalisez l'apparence de votre campagne</p>
                  </div>
                  
                  {/* Info Alert */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                    <div className="text-blue-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <p className="text-sm text-blue-700">
                      Certains éléments créatifs peuvent être nécessaires pour votre campagne. Nous pouvons les réaliser pour vous selon votre charte graphique.
                    </p>
                  </div>
                  
                  {/* Visual Identity Section */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-6">Identité visuelle (obligatoire)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Logo Upload */}
                      <div>
                        <p className="text-sm font-medium mb-2">Téléversement du logo</p>
                        <p className="text-xs text-muted-foreground mb-3">Fichier au format PDF, PNG, JPG ou SVG - max 3 Mo</p>
                        
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          </div>
                          <p className="text-sm font-medium">Sélectionnez un fichier</p>
                          <input
                            type="file"
                            id="logo-upload"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg,.svg"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setCampaignData({
                                  ...campaignData,
                                  logo: e.target.files[0]
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Brand Guidelines Upload */}
                      <div>
                        <p className="text-sm font-medium mb-2">Charte graphique</p>
                        <p className="text-xs text-muted-foreground mb-3">Document de référence contenant vos couleurs, typographies, visuals</p>
                        
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          </div>
                          <p className="text-sm font-medium">Sélectionnez un fichier</p>
                          <input
                            type="file"
                            id="brand-guidelines-upload"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setCampaignData({
                                  ...campaignData,
                                  brandGuidelines: e.target.files[0]
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* OR Divider */}
                    <div className="flex items-center my-6">
                      <div className="flex-grow h-px bg-gray-200"></div>
                      <span className="px-4 text-sm text-gray-500">OU</span>
                      <div className="flex-grow h-px bg-gray-200"></div>
                    </div>
                    
                    {/* Website URL */}
                    <div>
                      <p className="text-sm font-medium mb-2">URL de votre site internet</p>
                      <Input
                        type="url"
                        placeholder="https://votre-site.com"
                        value={campaignData.websiteUrl || ''}
                        onChange={(e) => setCampaignData({ ...campaignData, websiteUrl: e.target.value })}
                        className="h-12"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Auto-extraction possible de vos éléments graphiques</p>
                    </div>
                  </div>
                  
                  {/* Additional Visuals */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-6">Visuels complémentaires</h3>
                    
                    <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <p className="font-medium mb-1">Glissez vos fichiers ici ou cliquez pour sélectionner</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, SVG - max 5 Mo par fichier</p>
                      <input
                        type="file"
                        id="additional-visuals"
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.svg"
                        multiple
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setCampaignData({
                              ...campaignData,
                              additionalVisuals: Array.from(e.target.files)
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Creative Support Selection */}
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-6">Sélection des supports créatifs</h3>
                    
                    <div className="space-y-4">
                      {/* Ad Banner */}
                      <div 
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer
                          ${campaignData.creativeSupports?.includes('ad-banner') 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => {
                          const isSelected = campaignData.creativeSupports?.includes('ad-banner');
                          setCampaignData({
                            ...campaignData,
                            creativeSupports: isSelected
                              ? (campaignData.creativeSupports || []).filter(id => id !== 'ad-banner')
                              : [...(campaignData.creativeSupports || []), 'ad-banner']
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id="ad-banner" 
                              checked={campaignData.creativeSupports?.includes('ad-banner')}
                              onCheckedChange={(checked) => {
                                if (checked && checked !== "indeterminate") {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: [...(campaignData.creativeSupports || []), 'ad-banner']
                                  });
                                } else {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: (campaignData.creativeSupports || []).filter(id => id !== 'ad-banner')
                                  });
                                }
                              }}
                            />
                            <Label htmlFor="ad-banner" className="font-medium cursor-pointer">Annonce</Label>
                          </div>
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Offert</div>
                        </div>
                      </div>
                      
                      {/* Banner */}
                      <div 
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer
                          ${campaignData.creativeSupports?.includes('banner') 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => {
                          const isSelected = campaignData.creativeSupports?.includes('banner');
                          setCampaignData({
                            ...campaignData,
                            creativeSupports: isSelected
                              ? (campaignData.creativeSupports || []).filter(id => id !== 'banner')
                              : [...(campaignData.creativeSupports || []), 'banner']
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id="banner" 
                              checked={campaignData.creativeSupports?.includes('banner')}
                              onCheckedChange={(checked) => {
                                if (checked && checked !== "indeterminate") {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: [...(campaignData.creativeSupports || []), 'banner']
                                  });
                                } else {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: (campaignData.creativeSupports || []).filter(id => id !== 'banner')
                                  });
                                }
                              }}
                            />
                            <Label htmlFor="banner" className="font-medium cursor-pointer">Bannière</Label>
                          </div>
                          <div className="text-gray-700 text-xs font-medium">150 €</div>
                        </div>
                      </div>
                      
                      {/* Landing Page */}
                      <div 
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer
                          ${campaignData.creativeSupports?.includes('landing-page') 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => {
                          const isSelected = campaignData.creativeSupports?.includes('landing-page');
                          setCampaignData({
                            ...campaignData,
                            creativeSupports: isSelected
                              ? (campaignData.creativeSupports || []).filter(id => id !== 'landing-page')
                              : [...(campaignData.creativeSupports || []), 'landing-page']
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id="landing-page" 
                              checked={campaignData.creativeSupports?.includes('landing-page')}
                              onCheckedChange={(checked) => {
                                if (checked && checked !== "indeterminate") {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: [...(campaignData.creativeSupports || []), 'landing-page']
                                  });
                                } else {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: (campaignData.creativeSupports || []).filter(id => id !== 'landing-page')
                                  });
                                }
                              }}
                            />
                            <Label htmlFor="landing-page" className="font-medium cursor-pointer">Landing Page</Label>
                          </div>
                          <div className="text-gray-700 text-xs font-medium">300 €</div>
                        </div>
                      </div>
                      
                      {/* Email Template */}
                      <div 
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer
                          ${campaignData.creativeSupports?.includes('email-template') 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => {
                          const isSelected = campaignData.creativeSupports?.includes('email-template');
                          setCampaignData({
                            ...campaignData,
                            creativeSupports: isSelected
                              ? (campaignData.creativeSupports || []).filter(id => id !== 'email-template')
                              : [...(campaignData.creativeSupports || []), 'email-template']
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id="email-template" 
                              checked={campaignData.creativeSupports?.includes('email-template')}
                              onCheckedChange={(checked) => {
                                if (checked && checked !== "indeterminate") {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: [...(campaignData.creativeSupports || []), 'email-template']
                                  });
                                } else {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: (campaignData.creativeSupports || []).filter(id => id !== 'email-template')
                                  });
                                }
                              }}
                            />
                            <Label htmlFor="email-template" className="font-medium cursor-pointer">Email Template</Label>
                          </div>
                          <div className="text-gray-700 text-xs font-medium">100 €</div>
                        </div>
                      </div>
                      
                      {/* Promotional Video */}
                      <div 
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer
                          ${campaignData.creativeSupports?.includes('promo-video') 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'hover:border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => {
                          const isSelected = campaignData.creativeSupports?.includes('promo-video');
                          setCampaignData({
                            ...campaignData,
                            creativeSupports: isSelected
                              ? (campaignData.creativeSupports || []).filter(id => id !== 'promo-video')
                              : [...(campaignData.creativeSupports || []), 'promo-video']
                          });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id="promo-video" 
                              checked={campaignData.creativeSupports?.includes('promo-video')}
                              onCheckedChange={(checked) => {
                                if (checked && checked !== "indeterminate") {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: [...(campaignData.creativeSupports || []), 'promo-video']
                                  });
                                } else {
                                  setCampaignData({
                                    ...campaignData,
                                    creativeSupports: (campaignData.creativeSupports || []).filter(id => id !== 'promo-video')
                                  });
                                }
                              }}
                            />
                            <Label htmlFor="promo-video" className="font-medium cursor-pointer">Vidéo promotionnelle</Label>
                          </div>
                          <div className="text-gray-700 text-xs font-medium">500 €</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 5: Campaign Summary & Wallet */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold">Récapitulatif & Wallet</h2>
                    <p className="text-muted-foreground">Vérifiez les détails et finalisez votre campagne</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campaign Summary */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                      <h3 className="font-semibold text-lg mb-6">Récapitulatif de la campagne</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">NOM</p>
                          <p className="font-medium">{campaignData.name || "Non défini"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">PÉRIODE</p>
                          <p className="font-medium">
                            {campaignData.startDate && campaignData.endDate
                              ? `${campaignData.startDate} - ${campaignData.endDate}`
                              : "Non définie"}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">OBJECTIF</p>
                          <p className="font-medium">
                            {campaignData.objectiveType === "classic" && campaignData.classicObjective === "conversion"
                              ? "Conversion commerciale"
                              : campaignData.objectiveType === "qualification"
                              ? "Qualification de leads"
                              : "Non défini"}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">BUDGET</p>
                          <p className="font-medium">{campaignData.budget ? `${campaignData.budget} €` : "Non défini"}</p>
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-lg">Total</p>
                            <p className="font-semibold text-lg text-primary">{campaignData.budget ? `${campaignData.budget} €` : "0 €"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Wallet */}
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
                        </div>
                        <h3 className="font-semibold text-lg">Wallet</h3>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-600">Solde actuel</p>
                          <p className="font-bold text-2xl">{campaignData.walletBalance} €</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <p>Budget campagne</p>
                          <p>{campaignData.budget ? `${campaignData.budget} €` : "0 €"}</p>
                        </div>
                        
                        <div className="flex justify-between">
                          <p>Éléments créatifs</p>
                          <p>{campaignData.creativeSupports && campaignData.creativeSupports.length > 0 ? "À calculer" : "0 €"}</p>
                        </div>
                        
                        <div className="flex justify-between font-medium border-t border-gray-200 pt-3 mt-3">
                          <p>Total à charger</p>
                          <p>{campaignData.budget ? `${campaignData.budget} €` : "0 €"}</p>
                        </div>
                        
                        <div className="flex justify-between text-orange-500 font-medium">
                          <p>À débiter maintenant</p>
                          <p>{campaignData.budget ? `${campaignData.budget} €` : "0 €"}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-700 mb-6">
                        Seuls les éléments créatifs sélectionnés seront immédiatement débités de votre wallet. Le reste du montant sera simplement chargé et activé lors du lancement de la campagne.
                      </div>
                      
                      <Button variant="outline" className="w-full mb-3">Recharger mon wallet</Button>
                      <Button className="w-full bg-black hover:bg-gray-800">Valider la campagne</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Launch Campaign & Pay
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
