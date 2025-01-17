export const getResumeKey = {
  list: (filter?: Record<string, any>) => ['resume', filter ?? {}],
  id: (id: string) => ['resume', id],
};
