import Publication from './publication.model.js';
import User from '../user/user.model.js'
import Comment from '../comment/comment.model.js'
import jwt from 'jsonwebtoken';

export const commentPost = async (req, res) =>{
    const token = req.header('x-token');
    
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const {commentText} = req.body;

    const comment = new Comment({ idUser: uid, commentText});

    await comment.save();

    res.status(202).json({
        uid,
        comment
    });
}