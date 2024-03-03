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
        msg: 'Content of the publication: ',
        Text: publication.text,
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
        res.status(500).json({ message: 'Server Error' });
    }
}

export const commentPut = async (req, res) => {
    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { id } = req.params;
    const {_id, idUser, estado, ...resto} = req.body;

    const comment = await Comment.findOne({_id: id});

    if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
    }

    if(uid == comment.idUser){
        await Comment.findByIdAndUpdate(id, resto);
    }else{
        res.status(400).json({
            msg: "You can't EDIT this comment because you din't create this COMMENT",
        });

        return;
    }

    const commentUpdate = await Comment.findOne({_id: id});

    res.status(200).json({
        msg: 'This comment was EDITED',
        commentUpdate
    });
}

export const commentDelete = async (req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { id } = req.params;


        const comment = await Comment.findById({_id: id});

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        if(uid == comment.idUser){
            await Comment.findByIdAndUpdate(id, { estado: false });
        }else{
            res.status(400).json({
                msg: "You can't DELETE this comment because you din't create this COMMENT",
            });
            return;
        }

        res.status(200).json({
            msg: 'This comment was DELETED',
        });
};