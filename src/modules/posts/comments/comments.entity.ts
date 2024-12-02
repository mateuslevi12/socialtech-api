import prisma from "../../../database"

export class Comment {
    id: string
    content: string
    postId: string
    profileId: string

    constructor(data: Partial<Comment>) {
        Object.assign(this, data)
    }

    async getAllCommentsByPostId() {
        return await prisma.comments.findMany({
            where: {
                postId: this.postId
            },
            include: {
                profile: {
                    select: {
                        username: true
                    }
                }
            }
        })
    }

    async like() {
        return await prisma.comments.update({
            where: {
                id: this.id
            },
            data: {
                likes: {
                    increment: 1
                }
            }
        })
    }

    async unlike() {
        return await prisma.comments.update({
            where: {
                id: this.id
            },
            data: {
                likes: {
                    decrement: 1
                }
            }
        })
    }

    async create() {
        return await prisma.comments.create({
            data: {
                content: this.content,
                post: {
                    connect: {
                        id: this.postId
                    }
                },
                profile: {
                    connect: {
                        id: this.profileId
                    }
                }
            }
        })
    }

    async update() {
        return await prisma.comments.update({
            where: {
                id: this.id
            },
            data: {
                content: this.content
            }
        })
    }

    async delete() {
        return await prisma.comments.delete({
            where: {
                id: this.id
            }
        })
    }
}