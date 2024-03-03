import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "The name is required"],
  },
  correo: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: true,
  }
});

UserSchema.methods.toJSON = function(){
  const { __v, password, _id, ...usuario} = this.toObject();
  usuario.user_id = _id;
  return usuario;
}

export default mongoose.model('User', UserSchema);