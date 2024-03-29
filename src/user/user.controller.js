import bcryptjs from 'bcryptjs';
import User from './user.model.js';


export const usuariosPost = async (req, res) => {

    const {nombre, correo, password} = req.body;
    const usuario = new User( {nombre, correo, password} );
   
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(200).json({
        usuario
    });
}

export const usuariosGet = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        usuarios
    });
}

export const getUsuarioById = async (req, res) => {
    const {id} = req.params;
    const usuario = await User.findOne({_id: id});
    
    res.status(200).json({
        usuario
    })
}

export const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const {_id, antiguaClave, nuevaClave, google, correo, ...resto} = req.body;

    const usuario = await User.findById(id);

    const validPassword = bcryptjs.compareSync(antiguaClave, usuario.password);

    if(!validPassword) {
        return res.status(400).json({
            msg: "Old password incorrect, password wasn't updated"
        });
    }

    if(antiguaClave === nuevaClave){
        return res.status(400).json({
            msg: "These passwords are the same, plis change the new password"
        });
    }

    if(nuevaClave) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(nuevaClave, salt);
    }

    await User.findByIdAndUpdate(id, resto);

    const usuarioActualizado = await User.findOne({_id: id});

    res.status(200).json({
        msg: 'Updated User',
        usuarioActualizado
    });
}