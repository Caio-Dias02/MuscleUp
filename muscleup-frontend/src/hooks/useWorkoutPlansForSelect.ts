import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function useWorkoutPlansForSelect() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["workout-plans"],
        queryFn: async () => {
            const response = await api.get("/workout-plans");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        enabled: !!localStorage.getItem("token"),
    });

    // Transform data for select options
    const options = React.useMemo(() => 
        data?.map((plan: any) => ({
            value: plan.id,
            label: plan.name
        })) || [], 
        [data]
    );

    return { options, isLoading, error };
} 