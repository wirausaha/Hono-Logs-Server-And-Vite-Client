// Source adapted from hono-api-template
// Original repo: https://github.com/Aditya-Jyoti/Hono-API-Template
// Modified by @Bisfren (Fajrie R Aradea)
import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { type JwtVariables } from "hono/jwt";
import { serveStatic } from '@hono/node-server/serve-static'
//import { serveStatic } from 'hono/bun' // atau 'hono/no

type Variables = JwtVariables;

const app = new OpenAPIHono<{ Variables: Variables }>();

app.use('/images/*', serveStatic({ root: './public' }))

// JWT setup
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET not set");
}

// Middlewares
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});
app.use("*", cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || [] }));

// Documentation and server start
app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "0.0.1",
    title: "JWT Management API",
  },
});

const port = 3001;  // ubah disini 
console.log(`Server is running on http://localhost:${port}`);

import { writelogs } from '@routes/writelogs'
app.route('/api/', writelogs)

import { readlogs } from '@routes/readlogs'
app.route('/api/', readlogs)

import { sourceapps } from '@routes/sourceapplist'
app.route('/api/', sourceapps)

import { deletelogs } from '@routes/deletelogs'
app.route('/api/', deletelogs)

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" });

