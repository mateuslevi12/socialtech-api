import express from 'express';
import taskRoutes from './taskRoutes/taskRoutes';
import cors from 'cors';
import { GptRouter } from './modules/gpt/gpt.router';
import { UserRouter } from './modules/users/users.router'; 
import { ProfilesRouter } from './modules/profiles/profiles.router'; 
import { ChatsRouter } from './modules/chat/chats.router';
import { authenticateJWT } from './middlewares/authJWT';
import { AuthRouter } from './modules/users/auth/auth.router';
import { PostsRouter } from './modules/posts/postsAndComment.router';

const app = express();
const port = 3000;

// Habilitar CORS
app.use(cors());

// Configuração para aceitar requisições JSON
app.use(express.json());

app.use('/gpt', authenticateJWT, new GptRouter().routes());
app.use('/profile', authenticateJWT, new ProfilesRouter().routes());
app.use('/chats', authenticateJWT, new ChatsRouter().routes());
app.use('/users', authenticateJWT, new UserRouter().routes()); 
app.use('/posts', authenticateJWT, new PostsRouter().routes()); 
app.use('/auth', new AuthRouter().routes());  

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
