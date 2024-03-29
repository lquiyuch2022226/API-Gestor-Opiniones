import User from '../user/user.model.js';
import Publication from '../publication/publication.model.js';

export const existenteEmail = async (correo = '') => {
    const existeEmail = await User.findOne({correo});
    if (existeEmail){
        throw new Error(`This email: ${correo} is really used`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if (!existeUsuario){
        throw new Error(`A user with this iD: ${id} don't exists in database`);
    }
}

export const existePublicationById = async (id = '') => {
    const existePublication = await Publication.findById(id);
    if (!existePublication){
        throw new Error(`This ${id} from a PUBLICATION don't exists in database`);
    }
}