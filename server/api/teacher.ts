import { defineEventHandler, readBody, getQuery } from 'h3';
import { runScript, getAvailableWeeks } from '../scripts/calendar-script';

export default defineEventHandler(async (event) => {
  const { method } = event.req;

  if (method === 'GET') {
    const query = getQuery(event);
    const { teacherName } = query;

    if (!teacherName) {
      event.res.statusCode = 400;
      return { error: 'Teacher name is required' };
    }

    try {
      const weeks = await getAvailableWeeks(teacherName as string);
      return { weeks };
    } catch (error) {
      event.res.statusCode = 500;
      return { error: 'Internal Server Error' };
    }
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const { teacherName, selectedWeeks } = body;

    if (!teacherName) {
      event.res.statusCode = 400;
      return { error: 'Teacher name is required' };
    }

    if (!selectedWeeks || !Array.isArray(selectedWeeks)) {
      event.res.statusCode = 400;
      return { error: 'Selected weeks are required' };
    }

    try {
      const subjects = await runScript(teacherName, selectedWeeks);
      if (subjects.length === 0) {
        event.res.statusCode = 404;
        return { error: `No subjects found for teacher ${teacherName}` };
      }
      return { success: true };
    } catch (error) {
      event.res.statusCode = 500;
      return { error: 'Internal Server Error' };
    }
  }

  event.res.statusCode = 405;
  return { error: 'Method Not Allowed' };
});
