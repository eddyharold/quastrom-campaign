import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar";
import { Bell, CreditCard, Laptop, Shield, Smartphone, User } from "lucide-react";
import { Switch } from "@/presentation/components/ui/switch";
import { PageHeader } from "@/presentation/components/page-header";
import { Badge } from "@/presentation/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/presentation/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Separator } from "@radix-ui/react-separator";

export default function ProfilPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        hideBackButton
        title="Configuration du compte"
        subtitle="Gérez vos informations personnelles et vos préférences"
      />

      <Tabs defaultValue="informations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="informations" className="w-[18rem] flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </TabsTrigger>
          <TabsTrigger value="paiement" className="w-[18rem] flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Coordonnées de paiement
          </TabsTrigger>
          <TabsTrigger value="securite" className="w-[18rem] flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications" className="w-[18rem] flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/mystical-forest-spirit.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Changer la photo
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Prénom</Label>
                      <Input id="first-name" defaultValue="Jean" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Nom</Label>
                      <Input id="last-name" defaultValue="Dupont" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="jean.dupont@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" defaultValue="123 Rue de la République" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" defaultValue="Paris" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Code postal</Label>
                    <Input id="postal-code" defaultValue="75001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Select defaultValue="france">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Sélectionnez un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="france">France</SelectItem>
                        <SelectItem value="belgium">Belgique</SelectItem>
                        <SelectItem value="switzerland">Suisse</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Informations professionnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Société</Label>
                    <Input id="company" defaultValue="Dupont Consulting" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siret">SIRET</Label>
                    <Input id="siret" defaultValue="123 456 789 00012" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input id="website" defaultValue="https://dupontconsulting.fr" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity">Activité principale</Label>
                    <Select defaultValue="conseil">
                      <SelectTrigger id="activity">
                        <SelectValue placeholder="Sélectionnez une activité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conseil">Conseil en rénovation</SelectItem>
                        <SelectItem value="blog">Blog / Site d'information</SelectItem>
                        <SelectItem value="artisan">Artisan / Entreprise BTP</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paiement" className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-8 bg-card p-6 rounded-lg">
            <h3 className="flex items-center justify-between border-b border-dashed pb-2">
              <div className="flex items-center space-x-3">
                <div className="size-9 rounded-full bg-primary/5 flex items-center justify-center">
                  <CreditCard className="size-4 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-medium text-lg">Carte VISA/MASTERCARD</h3>
              </div>
              <Button>Enregistrer</Button>
            </h3>

            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="account-name">Titulaire du compte</Label>
                <Input id="account-name" placeholder="Ex: Jean Dupont" />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="bank-name">Nom de la banque</Label>
                <Input id="bank-name" placeholder="Ex: Banque Nationale" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" placeholder="Ex: FR76 1234 5678 9123 4567 8912 345" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bic">BIC / SWIFT</Label>
                <Input id="bic" placeholder="Ex: ABCDEFGHIJK" />
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-card p-6 rounded-lg">
            <h3 className="flex items-center justify-between border-b border-dashed pb-2">
              <div className="flex items-center space-x-3">
                <div className="size-9 rounded-full bg-primary/5 flex items-center justify-center">
                  <span className="text-primary font-bold">P</span>
                </div>
                <h3 className="font-medium text-lg">PayPal</h3>
              </div>
              <Button>Enregistrer</Button>
            </h3>

            <div className="space-y-2">
              <Label htmlFor="paypal-email">Email de votre PayPal</Label>
              <Input id="paypal-email" type="email" placeholder="Ex: jean.dupont@example.com" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="securite" className="space-y-6">
          <div className="space-y-8 bg-card p-6 rounded-lg">
            <div className="flex items-center justify-between border-b border-dashed pb-2">
              <h3 className="font-medium text-lg">Modifier le mot de passe</h3>
              <Button>Modifier le mot de passe</Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-card p-6 rounded-lg flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Activer l'authentification à deux facteurs</div>
              <div className="text-sm text-muted-foreground">
                Sécurisez votre compte avec une vérification supplémentaire
              </div>
            </div>
            <Switch />
          </div>

          <div className="space-y-4 bg-card p-6 rounded-lg">
            <h3 className="font-medium text-lg border-b border-dashed pb-2">Sessions actives</h3>

            <div className="space-y-4 divide-y divide-dashed">
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-start space-x-3">
                  <div className="size-8 rounded-full bg-accent flex items-center justify-center transform translate-y-0.5">
                    <Smartphone className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-medium text-sm">iPhone 13</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <p>Lyon, France</p>
                      <span>•</span>
                      <p>Safari</p>
                      <span>•</span>
                      <p>20 avril 2023</p>
                    </div>
                  </div>
                </div>
                <Badge variant="success">Actif</Badge>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-start space-x-3">
                  <div className="size-8 rounded-full bg-accent flex items-center justify-center transform translate-y-0.5">
                    <Laptop className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-medium text-sm">MacBook Pro</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <p>Lyon, France</p>
                      <span>•</span>
                      <p>Chrome</p>
                      <span>•</span>
                      <p>20 avril 2023</p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">Inactif</Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-6 bg-card p-6 rounded-lg">
            <h3 className="font-medium border-b border-dashed pb-2">Notifications par email</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Nouveaux leads</div>
                  <div className="text-sm text-muted-foreground">
                    Recevez un email lorsqu'un nouveau lead est généré
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Conversions</div>
                  <div className="text-sm text-muted-foreground">Recevez un email lorsqu'un lead est converti</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Paiements</div>
                  <div className="text-sm text-muted-foreground">Recevez un email lorsqu'un paiement est effectué</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Actualités et promotions</div>
                  <div className="text-sm text-muted-foreground">
                    Recevez des informations sur les nouveautés et promotions
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-card p-6 rounded-lg">
            <h3 className="font-medium border-b border-dashed pb-2">Notifications sur la plateforme</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Nouveaux leads</div>
                  <div className="text-sm text-muted-foreground">
                    Recevez une notification lorsqu'un nouveau lead est généré
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Conversions</div>
                  <div className="text-sm text-muted-foreground">
                    Recevez une notification lorsqu'un lead est converti
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Paiements</div>
                  <div className="text-sm text-muted-foreground">
                    Recevez une notification lorsqu'un paiement est effectué
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
