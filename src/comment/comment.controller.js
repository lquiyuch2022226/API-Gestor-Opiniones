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
        return res.status(404).json({ message: 'La publicación no fue encontrada' });
    }
    
    const comment = new Comment({ idUser: uid, commentText});

    await comment.save();

    publication.comments.push(comment);

    await publication.save();

    res.status(202).json({
        msg: 'Comentario agregado exitosamente a la publicación',
        publicationId: publication._id, // Devolver el ID de la publicación
        comment
    });
}