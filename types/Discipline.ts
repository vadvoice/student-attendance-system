type Discipline = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type DisciplineBody = {
  name: string;
  description: string;
};

export type { Discipline, DisciplineBody };
