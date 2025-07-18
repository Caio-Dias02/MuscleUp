import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DynamicDataTable } from "@/components/dynamic-data-table";
import { DynamicModal } from "@/components/dynamic-modal";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useWorkoutExercises } from "@/hooks/useWorkoutExercises";
import { useWorkoutDaysForSelect } from "@/hooks/useWorkoutDaysForSelect";
import { tableConfigs, type WorkoutExercise } from "@/config/table-configs";
import { modalConfigs } from "@/config/modal-configs";
import { useQueryClient } from "@tanstack/react-query";

export function WorkoutExercisesPage() {
    // const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading, error, updateWorkoutExercise, deleteWorkoutExercise } = useWorkoutExercises();
    const { options: workoutDayOptions } = useWorkoutDaysForSelect();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingExercise, setEditingExercise] = React.useState<WorkoutExercise | null>(null);
    
    const handleAddNew = () => {
        setEditingExercise(null);
        setIsModalOpen(true);
    };

    const handleEdit = (exercise: WorkoutExercise) => {
        setEditingExercise(exercise);
        setIsModalOpen(true);
    };

    const handleDelete = (exercise: WorkoutExercise) => {
        if (window.confirm(`Tem certeza que deseja excluir o exercício "${exercise.name}"?`)) {
            deleteWorkoutExercise.mutate(exercise.id);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingExercise(null);
    };

    const handleSubmit = React.useCallback(async (formData: any) => {
        if (editingExercise) {
            // Modo edição
            await updateWorkoutExercise.mutateAsync({ ...formData, id: editingExercise.id });
        } else {
            // Modo criação
            await modalConfigs.workoutExercises.create.onSubmit(formData);
        }
        // Refetch data after creating/updating
        queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
        handleModalClose();
    }, [queryClient, editingExercise, updateWorkoutExercise]);

    // Configuração do modal com opções dinâmicas
    const modalConfig = React.useMemo(() => ({
        ...(editingExercise ? modalConfigs.workoutExercises.edit : modalConfigs.workoutExercises.create),
        fields: (editingExercise ? modalConfigs.workoutExercises.edit : modalConfigs.workoutExercises.create).fields.map(field => {
            if (field.name === "workoutDayId") {
                return {
                    ...field,
                    options: workoutDayOptions
                };
            }
            return field;
        })
    }), [workoutDayOptions, editingExercise]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="ml-64">
                <SiteHeader title="Exercícios de Treino" />
                <div className="p-4">
                    <DynamicDataTable
                        title={tableConfigs.workoutExercises.title}
                        columns={tableConfigs.workoutExercises.columns}
                        data={data || []}
                        isLoading={isLoading}
                        error={error}
                        onAddNew={handleAddNew}
                        addButtonText={tableConfigs.workoutExercises.addButtonText}
                        emptyMessage={tableConfigs.workoutExercises.emptyMessage}
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
                mode={editingExercise ? "edit" : "create"}
                initialData={editingExercise}
            />
        </SidebarProvider>
    );
}