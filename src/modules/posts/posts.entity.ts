import prisma from "../../database"

export class Post {
    // id: string
    title: string
    content: string
    profileId: string
    page: number
    userId: string
    postId: string

    constructor(data: Partial<Post>) {
        Object.assign(this, data)
    }

    async findById() {
       return await prisma.posts.findUnique({
            where: {
                id: this.postId,
            },
            include: {
                profile: {
                    include: {
                        user: true
                    }
                },
                comments: {
                    include: {
                        profile: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                likes: true
            },
        })
    }

    async list() {
        const page = this.page || 1;
        const pageSize = 20;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        try {
            const posts = await prisma.posts.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                where: {
                    OR: [
                        {
                            AND: [
                                {
                                    profile: {
                                        following: {
                                            some: {
                                                followerId: this.userId
                                            }
                                        }
                                    }
                                },
                                {
                                    createdAt: {
                                        gte: sevenDaysAgo
                                    }
                                },
                            ]
                        },
                        {
                            profile: {
                                id: this.profileId
                            }
                        }
                    ]

                },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    profile: {
                        select: {
                            username: true,
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            comments: true,
                            likes: true,
                        }
                    },
                    likes: {
                        where: {
                            userId: this.userId,
                        },
                        select: {
                            id: true,
                        }
                    },

                },

                orderBy: {
                    createdAt: 'desc'
                }
            });

            console.log("posts", posts)

            const formattedPosts = posts.map(post => ({
                id: post.id,
                likes: post._count.likes,
                content: post.content,
                profile: post.profile,
                comments: post._count.comments,
                createdAt: post.createdAt,
                liked: post.likes.length > 0,
                user: {
                    name: post.profile.user.name
                }
            }));

            return formattedPosts;

        } catch (error) {
            throw new Error('Não foi possível listar os posts dos perfis seguidos.');
        }
    }

    async ILiked() {
        return await prisma.like.findMany({
            where: {
                user: {
                    user: {
                        id: this.userId
                    }
                }
            },
            include: {
                post: {
                    include:{
                        _count: {
                            select: {
                                comments: true,
                                likes: true,
                            }
                        },
                        profile: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        })
    }

    async myPosts() {
        return await prisma.posts.findMany({
            where: {
                profileId: this.profileId,
            }
        })
    }

    async toggleLike() {
        try {
            // Verificar se já existe um "like" para este post e usuário
            const existingLike = await prisma.like.findUnique({
                where: {
                    postId_userId: {
                        postId: this.postId,
                        userId: this.userId,
                    },
                },
            });
    
            if (existingLike) {
                // Se já existe, remove o "like" (unlike)
                await prisma.like.delete({
                    where: {
                        postId_userId: {
                            postId: this.postId,
                            userId: this.userId,
                        },
                    },
                });
    
                return { message: 'Post descurtido com sucesso.' };
            } else {
                // Se não existe, adiciona o "like"
                await prisma.like.create({
                    data: {
                        post: {
                            connect: {
                                id: this.postId,
                            },
                        },
                        user: {
                            connect: {
                                id: this.userId,
                            },
                        },
                    },
                });
    
                return { message: 'Post curtido com sucesso.' };
            }
        } catch (error) {
            console.error('Erro ao alternar o estado de curtida:', error);
            throw new Error('Não foi possível alternar o estado de curtida.');
        }
    }
    


    async create() {
        await prisma.posts.create({
            data: {
                content: this.content,
                profile: {
                    connect: {
                        id: this.profileId,
                    },
                },
            },
        })
    }

    async update() {
        await prisma.posts.update({
            where: {
                id: this.postId,
            },
            data: {
                content: this.content,
            },
        })
    }

    async delete() {
        await prisma.posts.delete({
            where: {
                id: this.postId,
            },
        })
    }
}