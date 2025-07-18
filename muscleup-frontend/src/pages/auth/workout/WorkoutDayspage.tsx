import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DynamicDataTable } from "@/components/dynamic-data-table";
import { DynamicModal } from "@/components/dynamic-modal";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { useWorkoutDays } from "@/hooks/useWorkoutDays";
import { useWorkoutPlansForSelect } from "@/hooks/useWorkoutPlansForSelect";
import { tableConfigs, type WorkoutDay } from "@/config/table-configs";
import { modalConfigs } from "@/config/modal-configs";
import { useQueryClient } from "@tanstack/react-query";

export function WorkoutDaysPage() {
    // const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading, error, updateWorkoutDay, deleteWorkoutDay } = useWorkoutDays();
    const { options: workoutPlanOptions } = useWorkoutPlansForSelect();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingDay, setEditingDay] = React.useState<WorkoutDay | null>(null);
    
    const handleAddNew = () => {
        setEditingDay(null);
        setIsModalOpen(true);
    };

    const handleEdit = (day: WorkoutDay) => {
        setEditingDay(day);
        setIsModalOpen(true);
    };

    const handleDelete = (day: WorkoutDay) => {
        if (window.confirm(`Tem certeza que deseja excluir o dia "${day.name}"?`)) {
            deleteWorkoutDay.mutate(day.id);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingDay(null);
    };

    const handleSubmit = React.useCallback(async (formData: any) => {
        if (editingDay) {
            // Modo edição
            await updateWorkoutDay.mutateAsync({ ...formData, id: editingDay.id });
        } else {
            // Modo criação
            await modalConfigs.workoutDays.create.onSubmit(formData);
        }
        // Refetch data after creating/updating
        queryClient.invalidateQueries({ queryKey: ["workout-days"] });
        // Also invalidate exercises queries since they depend on workout days
        queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
        handleModalClose();
    }, [queryClient, editingDay, updateWorkoutDay]);

    // Configuração do modal com opções dinâmicas
    const modalConfig = React.useMemo(() => ({
        ...(editingDay ? modalConfigs.workoutDays.edit : modalConfigs.workoutDays.create),
        fields: (editingDay ? modalConfigs.workoutDays.edit : modalConfigs.workoutDays.create).fields.map(field => {
            if (field.name === "workoutPlanId") {
                return {
                    ...field,
                    options: workoutPlanOptions
                };
            }
            return field;
        })
    }), [workoutPlanOptions, editingDay]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="ml-64">
                <SiteHeader title="Dias de Treino" />
                <div className="p-4">
                    <DynamicDataTable
                        title={tableConfigs.workoutDays.title}
                        columns={tableConfigs.workoutDays.columns}
                        data={data || []}
                        isLoading={isLoading}
                        error={error}
                        onAddNew={handleAddNew}
                        addButtonText={tableConfigs.workoutDays.addButtonText}
                        expandableContent={tableConfigs.workoutDays.expandableContent}
                        emptyMessage={tableConfigs.workoutDays.emptyMessage}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </SidebarInset>

            <DynamicModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                config={React.useMemo(() => ({
                    ...modalConfig,
                    onSubmit: handleSubmit
                }), [modalConfig, handleSubmit])}
                mode={editingDay ? "edit" : "create"}
                initialData={editingDay}
            />
        </SidebarProvider>
    );
}