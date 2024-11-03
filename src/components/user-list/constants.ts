export const getUserKey = {
  list: (filter?: Record<string, any>) => ['users', filter],
  id: (id: string) => ['users', id],
};
