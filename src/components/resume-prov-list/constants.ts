export const getResumeProvKey = {
  list: (filter?: Record<string, any>) => ['resume-prov', filter ?? {}],
  id: (id: string) => ['resume-prov', id],
};
