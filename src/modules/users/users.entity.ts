import { compare, hash } from 'bcrypt';
import prisma from '../../database';
import passport from 'passport';
import jwt from 'jsonwebtoken'
import { profile } from 'console';

export class User {
    id: string;
    name: string;
    email: string;
    password: string;


    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }

    async loginWithGoogle(req, res, next) {
        passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    }

    async handleGoogleCallback(req, res, next) {
        passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
            if (err) return next(err);
            if (!user) return res.redirect('/');
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.redirect('/dashboard'); 
            });
        })(req, res, next);
    }

    async list() {
        return await prisma.user.findMany({
            include: {
                profile: {
                    select: {  
                        id: true,
                        username: true
                    }
                }
            }
        })
    }

    async create() {
        try {
            const hashPassword = await hash(this.password, 6); 
    
            return await prisma.user.create({
                data: {
                    name: this.name,
                    email: this.email,
                    password: hashPassword,
                }
            }) 
        } catch (error) {
            throw new Error('Não foi possível criar o usuário.');
        }
    }

    async login() {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: this.email,
                },
                include: {
                    profile: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            });

            if (!user) {
                throw new Error('Credenciais inválidas.');
            }

            const comparePassword = await compare(this.password, user.password);

            if (!comparePassword) {
                throw new Error('Credenciais inválidas.');
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                process.env.JWT_SECRET!, 
                {
                    expiresIn: '1d',
                }
            );

            return { token, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profile: {
                    id: user?.profile?.id,
                    username: user?.profile?.username
                }
            } };

        } catch (error) {
            throw new Error('Não foi possível fazer o login. Verifique as credenciais.');
        }
    }


    async update() {
        try {
            const dataToUpdate: Partial<User> = {
                name: this.name,
                email: this.email,
            };

            if (this.password) {
                const hashPassword = await hash(this.password, 6);
                dataToUpdate.password = hashPassword;
            }

            await prisma.user.update({
                where: {
                    id: this.id,
                },
                data: dataToUpdate,
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw new Error('Não foi possível atualizar o usuário.');
        }
    }

    async delete() {
        try {
            await prisma.user.delete({
                where: {
                    id: this.id,
                },
            })
        } catch (error) {
            throw new Error('Não foi possível excluir o usuário.');
        }
    }
}