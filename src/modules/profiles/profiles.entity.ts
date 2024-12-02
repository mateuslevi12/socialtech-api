import prisma from "../../database";
import { Post } from "../posts/posts.entity";

export class Profile {
    username: string;
    description: string;
    userId: string;
    targetUserId: string
    followingId: string;
    action: "follow" | "unfollow"

    constructor(data: Partial<Profile>) {
        Object.assign(this, data)
    }

    async getDetails() {
        const details = await prisma.profile.findUnique({
            where: {
                userId: this.userId
            },
            select: {
                id: true,
                username: true,
                posts: true,
                description: true,
                followers: {
                    select: {
                        followerId: true
                    }
                },
                following: {
                    select: {
                        followerId: true
                    }
                }
            }
        })

        const responseDetails = {
            id: details.id,
            username: details.username,
            posts: details.posts,
            description: details.description,
            followersCount: details.followers.length,
            followingCount: details.following.length,
        }

        return responseDetails
    }

    async findByUserId() {
        const profile = await prisma.profile.findUnique({
            where: {
                userId: this.userId
            },
            include: {
                user: {
                    select: {
                        name: true,
                    }
                },
                posts: {
                    include: {
                        comments: true,
                        likes: true,
                    }
                },
                followers: {
                    select: {
                        follower: {
                            select: {
                                username: true,
                            }
                        }
                    }
                },
                following: {
                    select: {
                        following: {
                            select: {
                                username: true,
                            }
                        }
                    }
                },
            },
        });

        console.log(this.userId)

        const postInstance = new Post({
            userId: this.userId,
        })

        const postsIliked = await postInstance.ILiked()
        
        console.log(postsIliked)

        const postsWithCounts = profile.posts.map(post => ({
            ...post,
            likes: post.likes.length,
            comments: post.comments.length,
        }));

        const profileWithPostsLiked = {
            id: profile.id,
            username: profile.username,
            user: profile.user,
            posts: postsWithCounts,
            description: profile.description,
            followers: profile.followers,
            following: profile.following,
            postsLiked: postsIliked,
        }

        return profileWithPostsLiked
    }

    async create() {
        console.log("this");
        console.log(this);

        const userExists = await prisma.user.findUnique({
            where: {
                id: this.userId,
            },
        });

        console.log(userExists)

        if (!userExists) {
            throw new Error("User not found. Cannot create profile without a valid user.");
        }

        return await prisma.profile.create({
            data: {
                username: this.username,
                description: this.description,
                user: {
                    connect: {
                        id: this.userId,
                    },
                },
            },
        });
    }

    async update() {
        await prisma.profile.update({
            where: {
                id: this.userId,
            },
            data: {
                username: this.username,
            },
        })
    }

    async delete() {
        await prisma.profile.delete({
            where: { 
                id: this.userId,
            },
        })
    }

    async findByUsername() {
        const profile = await prisma.profile.findUnique({
            where: {
                username: this.username,
            },
            include: {
                posts: true,
                followers: {
                    select: {
                        following: true
                    }
                },
                following: {
                    select: {
                        follower: true
                    }
                },
            },
        })

        return profile
    }

    async toggleFollow() {
        // Validação para impedir auto-follow
        if (this.userId === this.followingId) {
            throw new Error('A user cannot follow themselves.');
        }

        console.log('userId:', this.userId);
        console.log('followingId:', this.followingId);
        console.log('action:', this.action);


        // Verificar se os perfis existem
        const profileExists = await prisma.profile.findUnique({ where: { id: this.userId } });
        const targetExists = await prisma.profile.findUnique({ where: { id: this.followingId } });

        if (!profileExists || !targetExists) {
            throw new Error('One of the profiles does not exist.');
        }

        const connectOrDisconnect = this.action === 'follow' ? 'connect' : 'disconnect';

        if (this.action === 'follow') {
            // Criar relação se não existir
            await prisma.follows.upsert({
                where: {
                    followerId_followingId: {
                        followerId: this.followingId,
                        followingId: this.userId,
                    },
                },
                create: {
                    followerId: this.followingId,
                    followingId: this.userId,
                },
                update: {}, // Update vazio
            });
        } else if (this.action === 'unfollow') {
            // Deletar relação
            await prisma.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: this.followingId,
                        followingId: this.userId,
                    },
                },
            });
        } else {
            throw new Error('Invalid action. Use "follow" or "unfollow".');
        }
    }




}
