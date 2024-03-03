import Publication from './publication.model.js';
import User from '../user/user.model.js'
import jwt from 'jsonwebtoken';

export const publicationPost = async (req, res) =>{
    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { title, category, text} = req.body;

    const publication = new Publication({ title, category, text, idUser: uid});

    await publication.save();

    res.status(202).json({
        uid,
        publication
    });
}

export const publicationsGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const publications = await Publication.find(query)
            .select('-__v -estado')
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'comments',
                populate: {
                    path: 'idUser',
                    select: 'nombre correo'
                }
            });

        const publicationsWithComments = publications.map(publication => {
            const comentarios = publication.comments.map(comment => ({
                idUser: comment.idUser ? comment.idUser.nombre : "Usuario no encontrado",
                commentText: comment.commentText
            }));
            return {
                ...publication.toObject(),
                idUser: publication.idUser ? publication.idUser.correo : "Usuario no encontrado",
                comments: comentarios
            };
        });

        const total = await Publication.countDocuments(query);

        res.status(200).json({
            total,
            publications: publicationsWithComments,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}


export const publicationPut = async (req, res) => {
    const token = req.header('x-token');

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { id } = req.params;
    const {_id, idUser, ...resto} = req.body;

    const publication = await Publication.findOne({_id: id});

    if(uid == publication.idUser){
        await Publication.findByIdAndUpdate(id, resto);
    }else{
        res.status(400).json({
            msg: "You can't EDIT this publication because you din't create this post",
        });

        return;
    }

    const publicationUpdate = await Publication.findOne({_id: id});

    res.status(200).json({
        msg: 'This publication was edited',
        publicationUpdate
    });
}

export const publicationDelete = async (req, res) => {
    const token = req.header('x-token');
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const { id } = req.params;


        const publication = await Publication.findById({_id: id});

        if(uid == publication.idUser){
            await Publication.findByIdAndUpdate(id, { estado: false });
        }else{
            res.status(400).json({
                msg: "You can't DELETE this publication because you din't create this post",
            });
            return;
        }

        res.status(200).json({
            msg: 'This publication was deleted',
        });
};