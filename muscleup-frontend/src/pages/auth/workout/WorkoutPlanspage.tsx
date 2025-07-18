import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DynamicDataTable } from "@/components/dynamic-data-table";
import { DynamicModal } from "@/components/dynamic-modal";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { tableConfigs, type WorkoutPlan } from "@/config/table-configs";
import { modalConfigs } from "@/config/modal-configs";
import { useWorkoutPlans } from "@/hooks/useWorkoutPlans";
import { useQueryClient } from "@tanstack/react-query";

export function WorkoutPlansPage() {
    // const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading, error, updateWorkoutPlan, deleteWorkoutPlan } = useWorkoutPlans();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingPlan, setEditingPlan] = React.useState<WorkoutPlan | null>(null);
    
    const handleAddNew = () => {
        setEditingPlan(null);
        setIsModalOpen(true);
    };

    const handleEdit = (plan: WorkoutPlan) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
    };

    const handleDelete = (plan: WorkoutPlan) => {
        if (window.confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`)) {
            deleteWorkoutPlan.mutate(plan.id);
        }
    };

    const handleSubmit = React.useCallback(async (formData: WorkoutPlan) => {
        if (editingPlan) {
            // Modo edição
            await updateWorkoutPlan.mutateAsync({ ...formData, id: editingPlan.id });
        } else {
            // Modo criação
            await modalConfigs.workoutPlans.create.onSubmit(formData);
        }
        // Refetch data after creating/updating
        queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
        // Also invalidate dependent queries
        queryClient.invalidateQueries({ queryKey: ["workout-days"] });
        queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
        handleModalClose();
    }, [queryClient, editingPlan, updateWorkoutPlan]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="ml-64">
                <SiteHeader title="Planos de Treino" />
                <div className="p-4">
                    <DynamicDataTable
                        title={tableConfigs.workoutPlans.title}
                        columns={tableConfigs.workoutPlans.columns(handleEdit, handleDelete)}
                        data={data || []}
                        isLoading={isLoading}
                        error={error}
                        onAddNew={handleAddNew}
                        addButtonText={tableConfigs.workoutPlans.addButtonText}
                        emptyMessage={tableConfigs.workoutPlans.emptyMessage}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </SidebarInset>

            <DynamicModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                config={React.useMemo(() => ({
                    ...(editingPlan ? modalConfigs.workoutPlans.edit : modalConfigs.workoutPlans.create),
                    onSubmit: handleSubmit
                }), [handleSubmit, editingPlan])}
                mode={editingPlan ? "edit" : "create"}
                initialData={editingPlan}
            />
        </SidebarProvider>
    );
}   