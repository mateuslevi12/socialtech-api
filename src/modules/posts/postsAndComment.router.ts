
import { Request, Response, Router } from "express";
import { IJPRoutes, VerboHTTPType } from "../../jp-api/i-routes";
import { RouterBuilder } from "../../jp-api/router-builder";
import { ExpressAppResponse } from "../../utils/express-app-response";
import { Post } from "./posts.entity";
import { Comment } from "./comments/comments.entity";


export class PostsRouter implements IJPRoutes {
    routes(): Router {
        return new RouterBuilder()
            .add({
                path: '/:profileId',
                acao: this.create,
                verbo: VerboHTTPType.POST
            })
            .add({
                path: '/:profileId',
                acao: this.list,
                verbo: VerboHTTPType.GET
            })
            .add({
                path: '/details/:postId',
                acao: this.findPostDetails,
                verbo: VerboHTTPType.GET
            })
            .add({
                path: '/:postId',
                acao: this.update,
                verbo: VerboHTTPType.PUT
            })
            .add({
                path: '/:postId',
                acao: this.delete,
                verbo: VerboHTTPType.DELETE
            })
            .add({
                path: '/like/:postId/:userId',
                acao: this.toggleLike,
                verbo: VerboHTTPType.PUT
            })
            .add({
                path: '/iLiked',
                acao: this.iLiked,
                verbo: VerboHTTPType.GET
            })
            .add({
                path: '/:postId/comments',
                acao: this.getAllCommentsByPostId,
                verbo: VerboHTTPType.GET
            })
            .add({
                path: '/:postId/comments/:profileId',
                acao: this.comment,
                verbo: VerboHTTPType.POST
            })
            .add({
                path: '/comments/:commentId',
                acao: this.updateComment,
                verbo: VerboHTTPType.PUT
            })
            .add({
                path: '/comments/:commentId',
                acao: this.deleteComment,
                verbo: VerboHTTPType.DELETE
            })
            .add({
                path: '/:postId/comments/like/:commentId',
                acao: this.likeComment,
                verbo: VerboHTTPType.PUT
            })
            .add({
                path: '/:postId/comments/unlike/:commentId',
                acao: this.unlikeComment,
                verbo: VerboHTTPType.PUT
            })

            .builder()
    }


    private create = async (req: Request, res: Response) => {
        const post = new Post({
            profileId: req.params.profileId,
            ...req.body
        })
        const response = await post.create()
        return ExpressAppResponse(res).success({ response: response });
    };

    private list = async (req: Request, res: Response) => {
        const post = new Post({
            profileId: req.params.profileId
        })
        const response = await post.list()
        console.log("chamdnooo", response)
        return ExpressAppResponse(res).success({ response: response });
    };

    private findPostDetails = async (req: Request, res: Response) => {
        const post = new Post({
            postId: req.params.postId
        })
        const response = await post.findById()
        return ExpressAppResponse(res).success({ response: response });
    };

    private update = async (req: Request, res: Response) => {
        const post = new Post({
            postId: req.params.postId,
            ...req.body
        })
        const response = await post.update()
        return ExpressAppResponse(res).success({ response: response });
    };

    private delete = async (req: Request, res: Response) => {
        const post = new Post({
            postId: req.params.postId
        })
        const response = await post.delete()
        return ExpressAppResponse(res).success({ response: response });
    };

    private iLiked = async (req: Request, res: Response) => {
        const post = new Post(req.body)
        const response = await post.ILiked()
        return ExpressAppResponse(res).success({ response: response });
    };

    private toggleLike = async (req: Request, res: Response) => {
        const post = new Post({
            postId: req.params.postId,
            userId: req.params.userId
        })
        const response = await post.toggleLike()
        return ExpressAppResponse(res).success({ response: response });
    };

    // ---------------- COMMENTS ---------------- //

    private comment = async (req: Request, res: Response) => {
        const comment = new Comment({
            postId: req.params.postId,
            profileId: req.params.profileId,
            content: req.body.content
        })
        const response = await comment.create()
        return ExpressAppResponse(res).success({ response: response });
    };

    private getAllCommentsByPostId = async (req: Request, res: Response) => {
        const comment = new Comment({
            postId: req.params.postId
        })
        const response = await comment.getAllCommentsByPostId()
        return ExpressAppResponse(res).success({ response: response });
    };

    private likeComment = async (req: Request, res: Response) => {
        const comment = new Comment({
            id: req.params.commentId
        })
        const response = await comment.like()
        return ExpressAppResponse(res).success({ response: response });
    }

    private unlikeComment = async (req: Request, res: Response) => {
        const comment = new Comment({
            id: req.params.commentId
        })
        const response = await comment.unlike()
        return ExpressAppResponse(res).success({ response: response });
    }

    private updateComment = async (req: Request, res: Response) => {
        const comment = new Comment({
            id: req.params.commentId,
            ...req.body
        })
        const response = await comment.update()
        return ExpressAppResponse(res).success({ response: response });
    }

    private deleteComment = async (req: Request, res: Response) => {
        const comment = new Comment({
            id: req.params.commentId
        })
        const response = await comment.delete()
        return ExpressAppResponse(res).success({ response: response });
    }

}
