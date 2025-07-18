import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Tipos para configuração do modal
export interface FieldConfig {
  name: string
  label: string
  type: "text" | "email" | "password" | "number" | "select" | "textarea" | "date"
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: (value: any) => string | null
}

export interface ModalConfig {
  title: string
  description?: string
  fields: FieldConfig[]
  onSubmit: (data: any) => Promise<void> | void
  submitButtonText?: string
  cancelButtonText?: string
}

export interface DynamicModalProps {
  isOpen: boolean
  onClose: () => void
  config: ModalConfig
  initialData?: any
  mode?: "create" | "edit"
}

// Componente para renderizar campos dinamicamente
function DynamicField({ 
  field, 
  value, 
  onChange, 
  error 
}: { 
  field: FieldConfig
  value: any
  onChange: (value: any) => void
  error?: string
}) {
  const fieldId = `field-${field.name}`

  const renderField = () => {
    switch (field.type) {
      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Selecione ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "textarea":
        return (
          <Textarea
            id={fieldId}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "date":
        return (
          <Input
            id={fieldId}
            type="date"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      default:
        return (
          <Input
            id={fieldId}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export function DynamicModal({ 
  isOpen, 
  onClose, 
  config, 
  initialData = {}, 
  mode = "create" 
}: DynamicModalProps) {
  const [formData, setFormData] = React.useState(initialData || {})
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Reset form when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {})
      setErrors({})
    }
  }, [isOpen, initialData])

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    config.fields.forEach(field => {
      const value = formData?.[field.name]

      // Required validation
      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = `${field.label} é obrigatório`
        return
      }

      // Custom validation
      if (field.validation && value) {
        const validationError = field.validation(value)
        if (validationError) {
          newErrors[field.name] = validationError
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Convert numeric fields to numbers before submitting
      const processedData = { ...formData }
      config.fields.forEach(field => {
        if (field.type === 'number' && processedData[field.name]) {
          processedData[field.name] = parseInt(processedData[field.name].toString())
        }
      })

      await config.onSubmit(processedData)
      toast.success(
        mode === "create" 
          ? "Item criado com sucesso!" 
          : "Item atualizado com sucesso!"
      )
      onClose()
    } catch (error: any) {
      console.error("Erro ao salvar:", error)
      
      // Extract error message from axios response
      let errorMessage = "Erro ao salvar. Tente novamente."
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.response?.status === 500) {
        errorMessage = "Erro interno do servidor. Tente novamente."
      } else if (error?.response?.status === 404) {
        errorMessage = "Item não encontrado."
      } else if (error?.response?.status === 401) {
        errorMessage = "Não autorizado. Faça login novamente."
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar" : "Editar"} {config.title}
          </DialogTitle>
          {config.description && (
            <DialogDescription>
              {config.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {config.fields.map((field) => (
              <DynamicField
                key={field.name}
                field={field}
                value={formData?.[field.name] || ""}
                onChange={(value) => handleFieldChange(field.name, value)}
                error={errors[field.name]}
              />
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {config.cancelButtonText || "Cancelar"}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                config.submitButtonText || (mode === "create" ? "Criar" : "Salvar")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 