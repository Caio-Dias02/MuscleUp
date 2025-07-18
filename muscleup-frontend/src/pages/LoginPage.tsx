import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    });

    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(data: LoginData) {
        try {
            await login(data.email, data.password);
            navigate({ to: "/app/dashboard" });
        } catch (error) {
            setError("Email ou senha inválidos");
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl shadow"
          >
            <h1 className="text-2xl font-bold">Entrar no MuscleUp</h1>
    
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {formState.errors.email.message}
                </p>
              )}
            </div>
    
            <div>
              <Label>Senha</Label>
              <Input type="password" {...register("password")} />
              {formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
    
            {error && <p className="text-red-600">{error}</p>}
    
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </div>
      ); 
} 