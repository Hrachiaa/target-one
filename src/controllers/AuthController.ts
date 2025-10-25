import { FastifyRequest, FastifyReply } from 'fastify';
import AuthService from '../services/AuthService';

interface Auth {
    email: string;
    password: string;
}

export default class AuthControllers {
    static async registration(
        request: FastifyRequest<{ Body: Auth }>,
        reply: FastifyReply
    ) {
        const { email, password } = request.body;
        const userData = await AuthService.registration(email, password);
        return reply.send(userData);
    }

    static async login(
        request: FastifyRequest<{ Body: Auth }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();
        const password = request.body.password;
        const userData = await AuthService.login(email, password);
        return reply.send(userData);
    }

    static async forgot(
        request: FastifyRequest<{ Body: { email: string } }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();
        const data = await AuthService.forgot(email);
        return reply.send(data);
    }

    static async checkCode(
        request: FastifyRequest<{ Body: { email: string; code: string } }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();

        const { code } = request.body;
        const data = await AuthService.checkCode(email, code);
        return reply.send(data);
    }

    static async reset(
        request: FastifyRequest<{
            Body: { email: string; code: string; password: string };
        }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();

        const { code, password } = request.body;
        const data = await AuthService.reset(email, code, password);
        return reply.send(data);
    }

    static async changePassword(
        request: FastifyRequest<{
            Body: { oldPassword: string; newPassword: string };
        }>,
        reply: FastifyReply
    ) {
        const user = await request.jwtVerify<{ id: string }>();
        const { oldPassword, newPassword } = request.body;
        const changePassword = await AuthService.changePassword(
            user.id,
            oldPassword,
            newPassword
        );
        return reply.send(changePassword);
    }

    static async confirmEmail(request: FastifyRequest, reply: FastifyReply) {
        const user = await request.jwtVerify<{ id: string }>();
        const confirm = await AuthService.confirmEmail(user.id);
        return reply.send(confirm);
    }

    static async confirmCodeEmail(
        request: FastifyRequest<{
            Body: { code: string };
        }>,
        reply: FastifyReply
    ) {
        const user = await request.jwtVerify<{ id: string }>();
        const { code } = request.body;

        const confirm = await AuthService.confirmCodeEmail(user.id, code);
        return reply.send(confirm);
    }

    static async tokenTest(request: FastifyRequest, reply: FastifyReply) {
        await request.jwtVerify();
        return reply.send({ message: 'Token is okay' });
    }
}
