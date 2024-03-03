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
            .limit(Number(limite));

        // Obtener la lista de mascotas con nombres de propietarios
        const publicacionesConUsuario = await Promise.all(publications.map(async (publication) => {
            const user = await User.findById(publication.idUser);
            return {
                ...publication.toObject(),
                idUser: user ? user.correo : "Usuario no encontrado",
            };
        }));

        // Obtener el total de mascotas
        const total = await Publication.countDocuments(query);

        // Responder con la lista de mascotas y su total
        res.status(200).json({
            total,
            publications: publicacionesConUsuario,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}