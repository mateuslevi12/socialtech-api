import { checkStatusAndPrintMessages } from './checkStatusAndPrintMessages';
import { verifyChatExists } from './verifyChatExists';
import { openai } from './openai';

const assistant = process.env.ASSISTANT_ID || '';

export async function sendMessageFromAssistant(username: string,  message: string) {
    try {
        let chatRequest = await verifyChatExists(username)
        
        await openai.beta.threads.messages.create(chatRequest.threadId, {
            role: "user",
            content: message
        });

        const run = await openai.beta.threads.runs.create(chatRequest.threadId, {
            assistant_id: assistant
        });

        const messages = await checkStatusAndPrintMessages(chatRequest.threadId, run.id);

        const messageClean = cleanResponse(messages?.content.value)

        const messageSendForUser = {
            role: messages.role,
            content: messageClean
        }

        return messageSendForUser
    } catch (error) {
        console.error('Erro ao enviar mensagem do assistente:', error);
        throw error;
    }
}

function cleanResponse(response?: string) {
    // Expressão regular para remover o padrão de citação com qualquer conteúdo dentro: 【qualquer_coisa†source】
    return response?.replace(/【.+†source】/g, '');
}