import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const taskRoutes = Router();
const prisma = new PrismaClient();

// Listar todas as tarefas
taskRoutes.get('/', async (req, res) => {
  const tasks = await prisma.tasks.findMany();
  res.json(tasks);
});

// Criar uma nova tarefa
taskRoutes.post('/', async (req, res) => {
  const { title } = req.body;
  const task = await prisma.tasks.create({
    data: {
      title,
    },
  });
  res.json(task);
});

// Atualizar uma tarefa
taskRoutes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = await prisma.tasks.update({
    where: { id: Number(id) },
    data: { title, completed },
  });
  res.json(task);
});

// Deletar uma tarefa
taskRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.tasks.delete({
    where: { id: Number(id) },
  });
  res.json({ message: 'Tarefa deletada' });
});

export default taskRoutes;
