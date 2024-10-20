
/**
 * @jest-environment node
 */
import { GET } from '../../pages/secret/hi';

it('Route test of hi.tsx returned 200', async () => {
  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.length).toBe(2);
});
