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
    const { subjects, fileContent } = await runScript(teacherName);
    if (subjects.length === 0) {
      event.res.statusCode = 404;
      return { error: `No subjects found for teacher ${teacherName}` };
    }
    return { success: true, fileContent };
  } catch (error) {
    event.res.statusCode = 500;
    return { error: 'Internal Server Error' };
  }
});
