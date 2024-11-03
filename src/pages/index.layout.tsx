import { customErrorMap } from '@lib/zod';
import { Outlet } from 'react-router-dom';
import { z } from 'zod';
z.setErrorMap(customErrorMap);

function IndexLayout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default IndexLayout;
