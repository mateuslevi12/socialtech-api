import prisma from "../../database";
import { openai } from "./openai";

export async function verifyChatExists(userName: string) {
    let chat = await prisma.messagesChatBot.findFirst({
        where: {
            userName
        }
    })

    if (!chat) {
        const thread = await openai.beta.threads.create();

        chat = await prisma.messagesChatBot.create({
            data: {
                threadId: thread.id,
                userName
            }
        })
    }

    return chat;
}