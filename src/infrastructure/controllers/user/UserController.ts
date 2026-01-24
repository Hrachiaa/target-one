import { FastifyRequest, FastifyReply } from 'fastify';
import UserService from '../../../domain/user/UserService';
import { fastify } from '../../../server';
import { GoogleUserDto } from '../../../domain/user/dtos/GoogleUserDto';

interface Auth {
    email: string;
    password: string;
}

export default class UserController {
    constructor(readonly userService: UserService){}
    async registration(
        request: FastifyRequest<{ Body: Auth }>,
        reply: FastifyReply
    ) {
        const { email, password } = request.body;
        const userData = await this.userService.registration(email, password);
        return reply.send(userData);
    }

    async login(
        request: FastifyRequest<{ Body: Auth }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();
        const password = request.body.password;
        const userData = await this.userService.login(email, password);
        return reply.send(userData);
    }

    async forgot(
        request: FastifyRequest<{ Body: { email: string } }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();
        const data = await this.userService.forgot(email);
        return reply.send(data);
    }

    async checkCode(
        request: FastifyRequest<{ Body: { email: string; code: string } }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();

        const { code } = request.body;
        const data = await this.userService.checkCode(email, code);
        return reply.send(data);
    }

    async reset(
        request: FastifyRequest<{
            Body: { email: string; code: string; password: string };
        }>,
        reply: FastifyReply
    ) {
        const email = request.body.email.trim().toLowerCase();

        const { code, password } = request.body;
        const data = await this.userService.reset(email, code, password);
        return reply.send(data);
    }

    async changePassword(
        request: FastifyRequest<{
            Body: { oldPassword: string; newPassword: string };
        }>,
        reply: FastifyReply
    ) {
        const user = await request.accessJwtVerify<{ id: string }>();
        const { oldPassword, newPassword } = request.body;
        const changePassword = await this.userService.changePassword(
            user.id,
            oldPassword,
            newPassword
        );
        return reply.send(changePassword);
    }

    async confirmEmail(request: FastifyRequest, reply: FastifyReply) {
        const user = await request.accessJwtVerify<{ id: string }>();
        const confirm = await this.userService.confirmEmail(user.id);
        return reply.send(confirm);
    }

    async confirmCodeEmail(
        request: FastifyRequest<{
            Body: { code: string };
        }>,
        reply: FastifyReply
    ) {
        const user = await request.accessJwtVerify<{ id: string }>();
        const { code } = request.body;

        const confirm = await this.userService.confirmCodeEmail(user.id, code);
        return reply.send(confirm);
    }

    async deleteUser(request: FastifyRequest, reply: FastifyReply) {
        const user = await request.accessJwtVerify<{ id: string }>();
        const deleted = await this.userService.deleteUser(user.id);
        return reply.send(deleted);
    }

    async callback(request: FastifyRequest, reply: FastifyReply) {
            const { token } =
                await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
                    request
                );
            const userInfo = await fastify.googleOAuth2.userinfo(token.access_token);
            const googleUserDto = new GoogleUserDto(userInfo)
            const userData = await this.userService.auth(googleUserDto);
            return reply.send(userData);
        }
}
