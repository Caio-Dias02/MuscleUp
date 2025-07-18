import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconUser, IconEdit, IconTrash, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useUser } from "@/hooks/useUser";
import { useUpdateUserProfile, useDeleteUserProfile, type UpdateUserProfileData } from "@/hooks/useUserProfile";
import { toast } from "sonner";

export function ProfilePage() {
    const { data: user, isLoading, error } = useUser();
    const updateProfile = useUpdateUserProfile();
    const deleteProfile = useDeleteUserProfile();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateUserProfileData>({});

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
                gender: user.gender,
                height: user.height,
                weight: user.weight,
                activityLevel: user.activityLevel,
                goal: user.goal,
                profilePictureUrl: user.profilePictureUrl
            });
        }
    }, [user]);

    const handleInputChange = (field: keyof UpdateUserProfileData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
                gender: user.gender,
                height: user.height,
                weight: user.weight,
                activityLevel: user.activityLevel,
                goal: user.goal,
                profilePictureUrl: user.profilePictureUrl
            });
        }
        setIsEditing(false);
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
            deleteProfile.mutate();
        }
    };

    if (isLoading) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="ml-64">
                    <SiteHeader />
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (error || !user) {
        return (
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="ml-64">
                    <SiteHeader />
                    <div className="flex items-center justify-center h-64">
                        <p className="text-red-500">Erro ao carregar perfil</p>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="ml-64">
                <SiteHeader title="Perfil do Usuário" />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="max-w-2xl mx-auto w-full space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Perfil do Usuário</h1>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} variant="outline">
                                        <IconEdit className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                ) : (
                                    <>
                                        <Button onClick={handleSave} disabled={updateProfile.isPending}>
                                            <IconDeviceFloppy className="h-4 w-4 mr-2" />
                                            Salvar
                                        </Button>
                                        <Button onClick={handleCancel} variant="outline">
                                            <IconX className="h-4 w-4 mr-2" />
                                            Cancelar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Avatar Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IconUser className="h-5 w-5" />
                                    Foto do Perfil
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={user.profilePictureUrl} alt={user.name} />
                                        <AvatarFallback className="text-lg">
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <div className="flex-1">
                                            <Label htmlFor="profilePictureUrl">URL da Foto</Label>
                                            <Input
                                                id="profilePictureUrl"
                                                value={formData.profilePictureUrl || ''}
                                                onChange={(e) => handleInputChange('profilePictureUrl', e.target.value)}
                                                placeholder="https://exemplo.com/foto.jpg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Pessoais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Nome</Label>
                                        <Input
                                            id="name"
                                            value={formData.name || ''}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                                        <Input
                                            id="birthDate"
                                            type="date"
                                            value={formData.birthDate || ''}
                                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Gênero</Label>
                                        <Select
                                            value={formData.gender || ''}
                                            onValueChange={(value) => handleInputChange('gender', value)}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o gênero" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MALE">Masculino</SelectItem>
                                                <SelectItem value="FEMALE">Feminino</SelectItem>
                                                <SelectItem value="OTHER">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Physical Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Físicas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="height">Altura (cm)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            value={formData.height || ''}
                                            onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                                            disabled={!isEditing}
                                            min="50"
                                            max="300"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="weight">Peso (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            value={formData.weight || ''}
                                            onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                                            disabled={!isEditing}
                                            min="20"
                                            max="500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="activityLevel">Nível de Atividade</Label>
                                        <Select
                                            value={formData.activityLevel || ''}
                                            onValueChange={(value) => handleInputChange('activityLevel', value)}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o nível" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SEDENTARY">Sedentário</SelectItem>
                                                <SelectItem value="LIGHT">Leve</SelectItem>
                                                <SelectItem value="MODERATE">Moderado</SelectItem>
                                                <SelectItem value="HIGH">Alto</SelectItem>
                                                <SelectItem value="VERY_HIGH">Muito Alto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="goal">Objetivo</Label>
                                        <Select
                                            value={formData.goal || ''}
                                            onValueChange={(value) => handleInputChange('goal', value)}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o objetivo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOSE_WEIGHT">Perder Peso</SelectItem>
                                                <SelectItem value="GAIN_WEIGHT">Ganhar Peso</SelectItem>
                                                <SelectItem value="MAINTAIN_WEIGHT">Manter Peso</SelectItem>
                                                <SelectItem value="GAIN_MUSCLE">Ganhar Músculo</SelectItem>
                                                <SelectItem value="STRENGTH_GAIN">Ganhar Força</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações da Conta</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Função</Label>
                                        <Input value={user.role === 'ADMIN' ? 'Administrador' : 'Usuário'} disabled />
                                    </div>
                                    <div>
                                        <Label>Membro desde</Label>
                                        <Input value={new Date(user.createdAt).toLocaleDateString('pt-BR')} disabled />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus dados.
                                </p>
                                <Button
                                    onClick={handleDeleteAccount}
                                    variant="destructive"
                                    disabled={deleteProfile.isPending}
                                >
                                    <IconTrash className="h-4 w-4 mr-2" />
                                    Excluir Conta
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
} 