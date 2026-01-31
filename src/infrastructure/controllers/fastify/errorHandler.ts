import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export default function errorHandler(
  err: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(err);
  // return reply.status(500).send({ status: 500, message: 'Error' });
}
