import Publication from '../publication/publication.model.js';
import Comment from '../comment/comment.model.js'
import jwt from 'jsonwebtoken';

export const commentPost = async (req, res) =>{
    const token = req.header('x-token');
    const { publi } = req.params;
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const {commentText} = req.body;

    const publication = await Publication.findById(publi);

    if (!publication) {
        return res.status(404).json({ message: 'Publication not found' });
    }
    
    const comment = new Comment({ idUser: uid, commentText});

    await comment.save();

    publication.comments.push(comment);

    await publication.save();

    res.status(202).json({
        msg: 'Comment added to the publication',
        publicationId: publication._id,
        comment
    });
}

export const commentsGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const comments = await Comment.find(query)
            .select('-__v -estado')
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'idUser',
                select: 'nombre correo'
            });

        const total = await Comment.countDocuments(query);

        const commentsWithEmail = comments.map(comment => ({
            Id_Comment: comment._id,
            correo: comment.idUser ? comment.idUser.correo : "User not found",
            commentText: comment.commentText,
            commentId: comment.commentId
        }));

        res.status(200).json({
            total,
            commentsWithEmail
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}