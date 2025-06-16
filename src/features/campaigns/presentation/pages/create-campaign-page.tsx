/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { Badge } from "@/presentation/components/ui/badge";
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import { Progress } from "@/presentation/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  ImageIcon,
  Video,
  Globe,
  DollarSign,
  Target,
  Calendar,
  Info,
  CheckCircle,
  Phone,
  AlertTriangle,
} from "lucide-react";

const steps = [
  { id: 1, title: "General Information", description: "Basic campaign details" },
  {
    id: 2,
    title: "Campaign Objectives, Budget & Conversion Rules",
    description: "Define objectives, budget and commission structure",
  },
  { id: 3, title: "Creatives", description: "Upload or create assets" },
  { id: 4, title: "Review & Launch", description: "Final review and launch" },
];

const campaignObjectives = [
  {
    id: "raw-leads",
    title: "Generate Raw Leads",
    description: "Basic leads for initial contact",
    estimatedCost: 15,
    icon: Target,
    tooltip: "Unqualified leads that require follow-up and nurturing. Best for building your prospect database.",
  },
  {
    id: "qualified-appointments",
    title: "Generate Qualified Appointments",
    description: "Pre-screened leads ready for a sales call",
    estimatedCost: 45,
    icon: Calendar,
    tooltip: "Leads that have been pre-qualified and are ready for a sales conversation. Higher conversion potential.",
  },
  {
    id: "callback-requests",
    title: "Callback Requests",
    description: "Prospects requesting a quick phone callback",
    estimatedCost: 25,
    icon: Phone,
    tooltip: "Leads who have expressed immediate interest and want to be contacted by phone within 24 hours.",
  },
  {
    id: "quote-demands",
    title: "Quote Demands",
    description: "Users actively seeking a price quote",
    estimatedCost: 35,
    icon: DollarSign,
    tooltip: "High-intent leads who are actively comparing prices and ready to make a purchasing decision.",
  },
];

const btpCategories = [
  "Technology & Software",
  "Healthcare & Medical",
  "Financial Services",
  "Real Estate",
  "Education & Training",
  "Manufacturing",
  "Professional Services",
  "Retail & E-commerce",
];

export default function CreateCampaign() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    category: "",
    objective: "",
    budget: "",
    budgetType: "total",
    dailyBudgetCap: false,
    hasCreatives: null,
    uploadedFiles: [],
    commissionModel: "fixed",
    commissionValue: "",
    conversionStatuses: [],
    walletBalance: 2500, // Mock wallet balance
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedObjective = campaignObjectives.find((obj) => obj.id === formData.objective);
  const estimatedLeads =
    formData.budget && selectedObjective
      ? Math.floor(Number.parseInt(formData.budget) / selectedObjective.estimatedCost)
      : 0;

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl   mx-auto space-y-6">
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
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center text-center ${
                      step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.id < currentStep
                          ? "bg-primary text-primary-foreground"
                          : step.id === currentStep
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                    </div>
                    <div className="mt-2 hidden sm:block">
                      <p className="text-xs font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Enter campaign name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your campaign objectives and target audience"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>BTP Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
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
              </div>
            )}

            {/* Step 2: Campaign Objectives, Budget & Conversion Rules */}
            {currentStep === 2 && (
              <div className="space-y-8">
                {/* Campaign Objective */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">🧭 Campaign Objective</span>
                    <span className="text-sm text-muted-foreground">(select one)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaignObjectives.map((objective) => (
                      <div
                        key={objective.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.objective === objective.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setFormData({ ...formData, objective: objective.id })}
                      >
                        <div className="flex items-start gap-3">
                          <objective.icon className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-medium">{objective.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">~${objective.estimatedCost} per lead</Badge>
                              <div className="group relative">
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
                                  {objective.tooltip}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Budget */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">💰 Campaign Budget</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Total Budget ($)</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="Enter your budget"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="daily-budget-cap"
                          checked={formData.dailyBudgetCap}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, dailyBudgetCap: checked as boolean })
                          }
                        />
                        <Label htmlFor="daily-budget-cap">Enable Daily Budget Cap</Label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formData.budget && selectedObjective && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Budget Breakdown</h4>
                          <div className="space-y-1 text-sm text-blue-800">
                            <p>
                              <strong>Estimated Cost per Lead:</strong> ${selectedObjective.estimatedCost}
                            </p>
                            <p>
                              <strong>Estimated Lead Volume:</strong> ~{estimatedLeads} leads
                            </p>
                            <p className="text-xs text-blue-600 mt-2">
                              Estimates based on historical data for {selectedObjective.title.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Commission Trigger Logic */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">🎯 Commission Trigger Logic</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select the conditions that must be met for a lead to be considered payable to an affiliate.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: "signed-quote",
                        label: "Signed Quote",
                        description: "Customer has signed a quote or contract",
                        tooltip: "Lead becomes payable when customer signs a formal quote or contract document",
                      },
                      {
                        id: "confirmed-sale",
                        label: "Confirmed Sale",
                        description: "Sale has been confirmed and processed",
                        tooltip: "Lead becomes payable when the sale is completed and payment is processed",
                      },
                      {
                        id: "appointment-booked",
                        label: "Appointment Booked",
                        description: "Customer has booked a sales appointment",
                        tooltip: "Lead becomes payable when customer schedules and confirms a sales meeting",
                      },
                      {
                        id: "qualified-lead",
                        label: "Qualified Lead Sheet",
                        description: "Lead has been qualified through our process",
                        tooltip: "Lead becomes payable when it passes your qualification criteria and requirements",
                      },
                    ].map((status) => (
                      <div
                        key={status.id}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50/50"
                      >
                        <Checkbox
                          id={status.id}
                          checked={formData.conversionStatuses.includes(status.id as never)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                conversionStatuses: [...formData.conversionStatuses, status.id as never],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                conversionStatuses: formData.conversionStatuses.filter((s) => s !== status.id),
                              });
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={status.id} className="font-medium">
                              {status.label}
                            </Label>
                            <div className="group relative">
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
                                {status.tooltip}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{status.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commission Model */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">📐 Commission Model</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Select how you want to reward affiliates:</p>

                  <div className="space-y-3">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.commissionModel === "fixed"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setFormData({ ...formData, commissionModel: "fixed" })}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.commissionModel === "fixed" ? "border-primary bg-primary" : "border-gray-300"
                          }`}
                        >
                          {formData.commissionModel === "fixed" && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Fixed amount per conversion</h3>
                          <p className="text-sm text-muted-foreground">e.g., $45 per qualified appointment</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.commissionModel === "percentage"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setFormData({ ...formData, commissionModel: "percentage" })}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            formData.commissionModel === "percentage" ? "border-primary bg-primary" : "border-gray-300"
                          }`}
                        >
                          {formData.commissionModel === "percentage" && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Percentage of sale</h3>
                          <p className="text-sm text-muted-foreground">e.g., 10% for confirmed sale</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commission-value">
                      {formData.commissionModel === "fixed" ? "Fixed Amount ($)" : "Percentage (%)"}
                    </Label>
                    <Input
                      id="commission-value"
                      type="number"
                      placeholder={formData.commissionModel === "fixed" ? "e.g., 45" : "e.g., 10"}
                      value={formData.commissionValue}
                      onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                    />
                  </div>
                </div>

                {/* Wallet Integration & Payment Preview */}
                {formData.budget && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium">💳 Wallet Integration & Payment Preview</span>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium text-blue-900">Payment Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total Budget to Prepay:</span>
                              <span className="font-medium">${Number.parseInt(formData.budget).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Current Wallet Balance:</span>
                              <span className="font-medium">${formData.walletBalance.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-medium">
                              <span>
                                {Number.parseInt(formData.budget) <= formData.walletBalance
                                  ? "Remaining Balance:"
                                  : "Additional Required:"}
                              </span>
                              <span
                                className={
                                  Number.parseInt(formData.budget) <= formData.walletBalance
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                ${Math.abs(formData.walletBalance - Number.parseInt(formData.budget)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {Number.parseInt(formData.budget) > formData.walletBalance ? (
                            <div className="space-y-3">
                              <Alert className="border-amber-200 bg-amber-50">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-amber-700">
                                  Insufficient wallet balance. Please top up to continue.
                                </AlertDescription>
                              </Alert>
                              <Button className="w-full bg-green-600 hover:bg-green-700">
                                Top up your Wallet (+$
                                {(Number.parseInt(formData.budget) - formData.walletBalance).toLocaleString()})
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-700">
                                  Sufficient balance available. Ready to launch!
                                </AlertDescription>
                              </Alert>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">💬 How it works:</p>
                          <p>
                            You define which actions are meaningful to your business — only those will trigger payouts
                            to affiliates. This ensures your budget is used on real results, and motivates affiliates to
                            deliver qualified outcomes that match your expectations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Creatives */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Do you have your own creatives?</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={formData.hasCreatives === true ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, hasCreatives: true as any })}
                    >
                      Yes, I have creatives
                    </Button>
                    <Button
                      variant={formData.hasCreatives === false ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, hasCreatives: false as any })}
                    >
                      No, create them for me
                    </Button>
                  </div>
                </div>

                {formData.hasCreatives === true && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Your Creatives</h3>
                      <p className="text-muted-foreground mb-4">Drag and drop files or click to browse</p>
                      <Button>Choose Files</Button>
                      <p className="text-xs text-muted-foreground mt-2">Supported: JPEG, PNG, MP4, HTML files, URLs</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <ImageIcon className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Images</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Video className="h-5 w-5 text-red-500" />
                        <span className="text-sm">Videos</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <FileText className="h-5 w-5 text-green-500" />
                        <span className="text-sm">HTML</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 border rounded-lg">
                        <Globe className="h-5 w-5 text-purple-500" />
                        <span className="text-sm">URLs</span>
                      </div>
                    </div>
                  </div>
                )}

                {formData.hasCreatives === false && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Creative Services Available</p>
                        <p>Our design team can create professional creatives for your campaign:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                          <li>Banner ads (static & animated)</li>
                          <li>Video advertisements</li>
                          <li>Landing page design</li>
                          <li>Email templates</li>
                        </ul>
                        <p className="text-sm font-medium">Starting at $299 - Add to cart at checkout</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 4: Review & Launch */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Campaign Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Campaign Name</Label>
                        <p className="font-medium">{formData.name || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                        <p className="font-medium">{formData.category || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Campaign Period</Label>
                        <p className="font-medium">
                          {formData.startDate && formData.endDate
                            ? `${formData.startDate} to ${formData.endDate}`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Objective</Label>
                        <p className="font-medium">{selectedObjective?.title || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                        <p className="font-medium">
                          ${formData.budget || "0"} ({formData.budgetType})
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Estimated Leads</Label>
                        <p className="font-medium">~{estimatedLeads} leads</p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Ready to Launch</p>
                        <p>
                          Your campaign is configured and ready to go live. You'll be charged when leads start
                          converting.
                        </p>
                        {formData.hasCreatives === false && (
                          <p className="text-sm">
                            <strong>Note:</strong> Creative services will be added to your invoice separately.
                          </p>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
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
  );
}
