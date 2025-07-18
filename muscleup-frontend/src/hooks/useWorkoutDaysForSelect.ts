import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function useWorkoutDaysForSelect() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["workout-days"],
        queryFn: async () => {
            const response = await api.get("/workout-days");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        enabled: !!localStorage.getItem("token"),
    });

    // Transform data for select options
    const options = React.useMemo(() => 
        data?.map((day: any) => ({
            value: day.id,
            label: `${day.name} (${day.dayOfWeek})`
        })) || [], 
        [data]
    );

    return { options, isLoading, error };
} 