export const getProviderKey = {
  list: (filter?: Record<string, any>) => ['provider', filter ?? {}],
  id: (id: string) => ['provider', id],
};
