import { openai } from "./openai";

export async function checkStatusAndPrintMessages(threadId: string, runId: string) {
    try {
        let runStatus;
        let attempts = 0;

        do {
            runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
            
            console.log(`Tentativa ${attempts + 1}: Status da execução - ${runStatus.status}`);

            if (runStatus.status === "in_progress") {
                await sleep(2000);
            }

            attempts++;
        } while (runStatus.status !== "completed" && attempts < 10);

        if (runStatus.status === "completed") {
            const messages = await openai.beta.threads.messages.list(threadId);

            const assistantMessage = messages.data.find((msg) => msg.role === 'assistant');

            if (assistantMessage && assistantMessage.content) {
                if (Array.isArray(assistantMessage.content)) {
                    const messageContent = assistantMessage.content[0];

                    if (messageContent.type === 'text' && messageContent.text) {
                        console.log({
                            role: assistantMessage.role,
                            content: messageContent.text
                        })
                        return {
                            role: assistantMessage.role,
                            content: messageContent.text
                        };
                    } else {
                        console.log('Conteúdo não é do tipo texto.');
                    }
                } else {
                    console.log('Mensagem não contém conteúdo esperado.');
                }
            } else {
                console.log('Nenhuma mensagem do assistant encontrada.');
                return null;
            }
        } else {
            console.log('A execução não foi completada após várias tentativas.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao verificar status e imprimir mensagens:', error);
        throw error;
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}