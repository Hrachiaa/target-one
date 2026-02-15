import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import ApiError from '../../../domain/utils/errors/ApiError';

export default function errorHandler(
  err: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send(new ApiError(err.statusCode, err.message))
  // return reply.send(err);
  // return reply.status(500).send({ status: 500, message: 'Error' });
}
