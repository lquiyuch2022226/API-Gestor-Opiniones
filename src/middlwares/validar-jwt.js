import jwt from 'jsonwebtoken'
import Usuario from '../user/user.model.js'

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There isn't token in the request"
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const usuario = await Usuario.findById(uid);

    if(!usuario){
      return res.status(401).json({
        msg: "The token has a user that don't exist en database, plis change it"
      })
    }

    if(!usuario.estado){
      return res.status(401).json({
        msg: "The token isn't valid - user with estado: false"
      })
    }

    req.usuario = usuario;

    next();
  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "The token isn't valid",
      });
  }
}