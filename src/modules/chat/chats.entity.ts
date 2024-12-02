import prisma from "../../database";

export class Chat {
    chatId: string;
    content: string;
    senderId: string;
    messageId: string;

    constructor(data: Partial<Chat>) {
        Object.assign(this, data)
    }

    async list() {
        return await prisma.chat.findMany({
            include: {
                profiles: {
                    select: {
                        username: true
                    }
                }
            }
        })
    }

    private async verifyChatExists() {
        let chat = await prisma.chat.findUnique({
            where: {
                id: this.chatId
            }
        })

        if (!chat) {
           await prisma.chat.create({})
        }

        return chat;
    }

    async create() {
        return await this.verifyChatExists();
    }

    async send() {
        let chat = await this.verifyChatExists();

        return await prisma.message.create({
            data: {
                chat: {
                    connect: {
                        id: chat.id
                    }
                },
                content: this.content,
                sender: {
                    connect: {
                        id: this.senderId,
                    }
                }
            }
        })
    }

    async deleteMessage() {
        return await prisma.message.delete({
            where: {
                id: this.messageId
            }
        })
    }

    async listMessage() {
        return await prisma.message.findMany({
            where: {
                chatId: this.chatId
            },
            select: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
                content: true,
                createdAt: true,
            }
        })
    }
}