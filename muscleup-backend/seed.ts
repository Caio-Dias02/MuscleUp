import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar um usuário de teste
  const user = await prisma.user.upsert({
    where: { email: 'teste@exemplo.com' },
    update: {},
    create: {
      email: 'teste@exemplo.com',
      name: 'João Silva',
      passwordHash: 'senha_hash_teste',
      birthDate: new Date('1990-05-15'),
      gender: 'MALE',
      height: 175,
      weight: 75,
      activityLevel: 'MODERATE',
      goal: 'GAIN_MUSCLE',
      profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
  });

  console.log('✅ Usuário criado:', user.email);

  // Criar um workout plan
  const workoutPlan = await prisma.workoutPlan.upsert({
    where: { id: '61d5731e-b052-4422-901d-51c696c31a97' },
    update: {},
    create: {
      id: '61d5731e-b052-4422-901d-51c696c31a97',
      name: 'Plano de Treino Iniciante',
      userId: user.id,
    },
  });

  console.log('✅ Workout Plan criado:', workoutPlan.name);

  // Criar workout days
  const workoutDays = await Promise.all([
    prisma.workoutDay.upsert({
      where: { id: 'a10f1809-7f7d-4ec6-9b07-8a4237d9373b' },
      update: {},
      create: {
        id: 'a10f1809-7f7d-4ec6-9b07-8a4237d9373b',
        name: 'Costas e Bíceps',
        dayOfWeek: 'MONDAY',
        workoutPlanId: workoutPlan.id,
      },
    }),
    prisma.workoutDay.upsert({
      where: { id: 'a166d019-ff20-440c-a6fc-d6ad5bad8752' },
      update: {},
      create: {
        id: 'a166d019-ff20-440c-a6fc-d6ad5bad8752',
        name: 'Peito e Tríceps',
        dayOfWeek: 'TUESDAY',
        workoutPlanId: workoutPlan.id,
      },
    }),
    prisma.workoutDay.upsert({
      where: { id: 'b277e130-gg31-551d-b7gd-e7be6cbe9863' },
      update: {},
      create: {
        id: 'b277e130-gg31-551d-b7gd-e7be6cbe9863',
        name: 'Pernas',
        dayOfWeek: 'WEDNESDAY',
        workoutPlanId: workoutPlan.id,
      },
    }),
    prisma.workoutDay.upsert({
      where: { id: 'c388f241-hh42-662e-c8he-f8cf7dcf0974' },
      update: {},
      create: {
        id: 'c388f241-hh42-662e-c8he-f8cf7dcf0974',
        name: 'Ombros e Abdômen',
        dayOfWeek: 'THURSDAY',
        workoutPlanId: workoutPlan.id,
      },
    }),
  ]);

  console.log('✅ Workout Days criados:', workoutDays.length);

  // Criar exercícios para cada workout day
  const exercises = await Promise.all([
    // Exercícios para Costas e Bíceps
    prisma.workoutExercise.upsert({
      where: { id: 'ex1-costas-biceps' },
      update: {},
      create: {
        id: 'ex1-costas-biceps',
        name: 'Puxada na Frente',
        sets: 4,
        reps: 12,
        weight: 50,
        workoutDayId: 'a10f1809-7f7d-4ec6-9b07-8a4237d9373b',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex2-costas-biceps' },
      update: {},
      create: {
        id: 'ex2-costas-biceps',
        name: 'Remada Curvada',
        sets: 3,
        reps: 10,
        weight: 40,
        workoutDayId: 'a10f1809-7f7d-4ec6-9b07-8a4237d9373b',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex3-costas-biceps' },
      update: {},
      create: {
        id: 'ex3-costas-biceps',
        name: 'Rosca Direta',
        sets: 3,
        reps: 12,
        weight: 15,
        workoutDayId: 'a10f1809-7f7d-4ec6-9b07-8a4237d9373b',
      },
    }),

    // Exercícios para Peito e Tríceps
    prisma.workoutExercise.upsert({
      where: { id: 'ex1-peito-triceps' },
      update: {},
      create: {
        id: 'ex1-peito-triceps',
        name: 'Supino Reto com Barra',
        sets: 4,
        reps: 10,
        weight: 60,
        workoutDayId: 'a166d019-ff20-440c-a6fc-d6ad5bad8752',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex2-peito-triceps' },
      update: {},
      create: {
        id: 'ex2-peito-triceps',
        name: 'Supino Inclinado',
        sets: 3,
        reps: 12,
        weight: 45,
        workoutDayId: 'a166d019-ff20-440c-a6fc-d6ad5bad8752',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex3-peito-triceps' },
      update: {},
      create: {
        id: 'ex3-peito-triceps',
        name: 'Extensão de Tríceps na Polia',
        sets: 3,
        reps: 15,
        weight: 25,
        workoutDayId: 'a166d019-ff20-440c-a6fc-d6ad5bad8752',
      },
    }),

    // Exercícios para Pernas
    prisma.workoutExercise.upsert({
      where: { id: 'ex1-pernas' },
      update: {},
      create: {
        id: 'ex1-pernas',
        name: 'Agachamento Livre',
        sets: 4,
        reps: 8,
        weight: 80,
        workoutDayId: 'b277e130-gg31-551d-b7gd-e7be6cbe9863',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex2-pernas' },
      update: {},
      create: {
        id: 'ex2-pernas',
        name: 'Leg Press',
        sets: 3,
        reps: 12,
        weight: 120,
        workoutDayId: 'b277e130-gg31-551d-b7gd-e7be6cbe9863',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex3-pernas' },
      update: {},
      create: {
        id: 'ex3-pernas',
        name: 'Extensão de Pernas',
        sets: 3,
        reps: 15,
        weight: 50,
        workoutDayId: 'b277e130-gg31-551d-b7gd-e7be6cbe9863',
      },
    }),

    // Exercícios para Ombros e Abdômen
    prisma.workoutExercise.upsert({
      where: { id: 'ex1-ombros-abdomen' },
      update: {},
      create: {
        id: 'ex1-ombros-abdomen',
        name: 'Desenvolvimento Militar',
        sets: 3,
        reps: 10,
        weight: 35,
        workoutDayId: 'c388f241-hh42-662e-c8he-f8cf7dcf0974',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex2-ombros-abdomen' },
      update: {},
      create: {
        id: 'ex2-ombros-abdomen',
        name: 'Elevação Lateral',
        sets: 3,
        reps: 12,
        weight: 8,
        workoutDayId: 'c388f241-hh42-662e-c8he-f8cf7dcf0974',
      },
    }),
    prisma.workoutExercise.upsert({
      where: { id: 'ex3-ombros-abdomen' },
      update: {},
      create: {
        id: 'ex3-ombros-abdomen',
        name: 'Abdominal Crunch',
        sets: 3,
        reps: 20,
        weight: 0,
        workoutDayId: 'c388f241-hh42-662e-c8he-f8cf7dcf0974',
      },
    }),
  ]);

  console.log('✅ Exercícios criados:', exercises.length);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('📊 Resumo:');
  console.log(`   - 1 Usuário`);
  console.log(`   - 1 Workout Plan`);
  console.log(`   - ${workoutDays.length} Workout Days`);
  console.log(`   - ${exercises.length} Exercícios`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 