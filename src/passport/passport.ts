import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../database';
import { User } from '../modules/users/users.entity';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,  // Variável de ambiente com o Client ID do Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // Variável de ambiente com o Client Secret do Google
      callbackURL: '/auth/google/callback',  // Endpoint para onde o Google redireciona após o login
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verificar se o usuário já existe no banco de dados
        let user = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,  // O email é usado como chave única
          },
        });

        // Se o usuário não existir, criar um novo
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: '',  // Para usuários Google, a senha pode ser deixada em branco ou outro tratamento especial
            },
          });
        }

        // Finalizar autenticação e passar o usuário
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serializar e desserializar usuário para sessão
passport.serializeUser((user: User, done) => {
  done(null, user.id);  // Serializa apenas o ID do usuário
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);  // Retorna o usuário completo
  } catch (error) {
    done(error, null);
  }
});
