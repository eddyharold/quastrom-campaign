import { Button } from "@/presentation/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { LoginDtoSchema, LoginDto } from "../../domain/dto/login-dto";
import { ErrorMessage } from "@/presentation/components/error-message";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../application/use-cases/login-mutation";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "@/presentation/providers/auth-provider";

export default function LoginPage() {
  const { updateUser } = useAuthContext();

  const { mutateAsync: login, isPending: isLoginPending, isError, error } = useLoginMutation();

  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginDtoSchema),
  });

  const navigate = useNavigate();

  const handleLogin = (data: LoginDto) => {
    login(data).then((rs) => {
      if (rs?.data?.user) {
        updateUser(rs.data.user);
        navigate("/", {
          replace: true,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Bon retour👋🏾</CardTitle>
        <CardDescription>Connectez-vous avec vos identifiants</CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="grid gap-6">
            {isError && error && <ErrorMessage message={error.message} />}

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Label htmlFor="password">Mot de passe</Label>
                      <Link
                        to="/forgot-password"
                        className="ml-auto font-medium text-muted-foreground text-xs underline-offset-2 hover:underline decoration-dashed decoration-from-font hover:text-primary"
                      >
                        Mot de passe oublié?
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoginPending}>
              Se connecter
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
