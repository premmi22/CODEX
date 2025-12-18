import Fastify from "fastify";
import { demoItems, demoWearEvents, WearEvent } from "@closetclear/shared";

const fastify = Fastify({ logger: true });

fastify.get("/health", async () => ({ status: "ok" }));
fastify.get("/items", async () => demoItems);
fastify.post("/items", async (request, reply) => {
  // Mock: echo back payload
  const body = request.body as unknown;
  return reply.code(201).send({ ok: true, body });
});
fastify.post("/wear-events", async (request, reply) => {
  const body = request.body as WearEvent;
  demoWearEvents.push(body);
  return reply.code(201).send({ ok: true });
});

fastify.listen({ port: 3333, host: "0.0.0.0" }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
