import { defineEventHandler, readBody } from 'h3';
import { runScript } from '../scripts/calendar-script';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { teacherName } = body;

  if (!teacherName) {
    event.res.statusCode = 400;
    return { error: 'Teacher name is required' };
  }

  try {
    await runScript(teacherName);
    return { success: true };
  } catch (error) {
    event.res.statusCode = 500;
    return { error: 'Internal Server Error' };
  }
});
