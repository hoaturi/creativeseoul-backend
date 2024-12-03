import * as t from 'drizzle-orm/pg-core';
import { pgEnum, pgTable as table } from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('roles', ['candidate', 'employer', 'admin']);

export const users = table('users', {
  id: t.uuid().primaryKey(),
  email: t.text().unique().notNull(),
  password: t.text().notNull(),
  role: rolesEnum().notNull(),
});
