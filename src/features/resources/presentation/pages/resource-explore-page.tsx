import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/presentation/components/ui/accordion";
import { HelpCircle, Download, MessageSquare, TrendingUp, Lightbulb } from "lucide-react";
import { TUTORIALS } from "../../domain/data/tutorial";
import { FAQ } from "../../domain/data/fqa";
import { DOCUMENTS } from "../../domain/data/document";
import { PageHeader } from "@/presentation/components/page-header";
import { useLayoutContext } from "@/presentation/providers/layout-provider";
import { useEffect } from "react";

export default function ResourceExplorePage() {
  const { updateBreadcrumb } = useLayoutContext();

  useEffect(() => {
    updateBreadcrumb([
      {
        title: "Tableau de bord",
        link: "/",
      },
      {
        title: "Ressources",
        isActive: true,
      },
    ]);
  }, [updateBreadcrumb]);

  return (
    <div className="space-y-6">
      <PageHeader
        hideBackButton
        title="Ressources"
        subtitle="Tutoriels, guides et documentation pour optimiser vos performances"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tutoriels et guides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {TUTORIALS.map((tutorial) => (
              <div
                key={`tutorial-${tutorial.title}`}
                className="flex items-center space-x-4 border-b pb-4 last:border-0 last:pb-0 group"
              >
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <tutorial.icon className="size-4 text-primary" />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="font-medium text-base">{tutorial.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <span>{tutorial.type}</span>
                    <span>•</span>
                    <span>{tutorial.duration}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="group-hover:opacity-100 transition-opacity duration-100 ease-in opacity-0"
                >
                  Voir
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conseils pour mieux performer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="size-9 rounded-full bg-success/30 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="size-4 text-success" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Optimisez vos conversions</h3>
                <p className="text-sm text-muted-foreground">
                  Placez vos liens d'affiliation sur des pages à fort trafic et pertinentes pour la rénovation
                  énergétique.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="size-9 rounded-full bg-warning/30 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="size-4 text-warning" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Créez du contenu de qualité</h3>
                <p className="text-sm text-muted-foreground">
                  Rédigez des articles informatifs sur les avantages de MaPrimeRénov' pour attirer un public qualifié.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="size-9 rounded-full bg-info/30 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="size-4 text-info" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Engagez votre audience</h3>
                <p className="text-sm text-muted-foreground">
                  Répondez aux questions sur les réseaux sociaux pour construire votre crédibilité et générer plus de
                  leads.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foire aux questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item) => (
              <AccordionItem key={`faq-${item.key}`} value={item.key}>
                <AccordionTrigger className="underline-offset-4 decoration-dashed data-[state=open]:underline data-[state=open]:text-primary/70">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="bg-accent/20 mb-3 p-3 rounded-md text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents utiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {DOCUMENTS.map((document) => (
              <div
                key={`document-${document.title}`}
                className="border border-dashed rounded-lg p-4 flex items-start space-x-4"
              >
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transform translate-y-1">
                  <document.icon className="size-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="space-y-1">
                    <h3 className="font-medium">{document.title}</h3>
                    <p className="text-sm text-muted-foreground">{document.description}</p>
                  </div>
                  <Button variant="accent" size="sm">
                    <Download />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support et assistance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transform translate-y-1">
              <MessageSquare className="size-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">Chat de support</h3>
              <p className="text-sm text-muted-foreground">
                Notre équipe est disponible du lundi au vendredi de 9h à 18h pour répondre à vos questions.
              </p>

              <Button className="mt-3">
                <MessageSquare />
                Démarrer une conversation
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-4 pt-4 border-t">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transform translate-y-1">
              <HelpCircle className="size-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">Centre d'aide</h3>
              <p className="text-sm text-muted-foreground">
                Consultez notre base de connaissances pour trouver des réponses à vos questions.
              </p>

              <Button variant="accent" className="mt-3">
                <HelpCircle />
                Accéder au centre d'aide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
