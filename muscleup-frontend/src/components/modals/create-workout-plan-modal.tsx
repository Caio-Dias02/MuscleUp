import { useState } from "react"
import { useForm, type ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/modal"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useWorkoutPlansPage, type CreateWorkoutPlanData } from "@/hooks/useWorkoutPlansPage"


const createWorkoutPlanSchema = z.object({
  name: z.string().min(3, "O nome do plano deve ter pelo menos 3 caracteres"),
})

type CreateWorkoutPlanForm = z.infer<typeof createWorkoutPlanSchema>

interface CreateWorkoutPlanModalProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}


export function CreateWorkoutPlanModal({ onSuccess, trigger }: CreateWorkoutPlanModalProps) {
  const [open, setOpen] = useState(false)
  const { createWorkoutPlan, isCreating } = useWorkoutPlansPage()

  const form = useForm<CreateWorkoutPlanForm>({
    resolver: zodResolver(createWorkoutPlanSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (data: CreateWorkoutPlanForm) => {
    try {
      const workoutPlanData: CreateWorkoutPlanData = {
        name: data.name,
      }
      
      await createWorkoutPlan(workoutPlanData)
      
      setOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error) {
      toast.error("Erro ao criar plano de treino")
      console.error(error)
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo plano
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Plano de Treino</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }: { field: ControllerRenderProps<CreateWorkoutPlanForm, "name"> }) => (
                  <FormItem>
                    <FormLabel>Nome do Plano</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Treino A - Superior" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
        
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar Plano"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 