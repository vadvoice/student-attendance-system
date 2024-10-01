import { Discipline, DisciplineBody } from '@/types/Discipline';

const disciplinesApi = {
  list: async (): Promise<Discipline[]> => {
    const response = await fetch('/api/disciplines');
    return await response.json();
  },
  create: async (discipline: DisciplineBody) => {
    return await fetch('/api/disciplines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discipline),
    });
  },
  delete: async (id: number) => {
    return await fetch(`/api/disciplines/${id}`, {
      method: 'DELETE',
    });
  },
};

export { disciplinesApi };
