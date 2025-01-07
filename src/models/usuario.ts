import { Schema, model, Document } from "mongoose";

export interface IUsuario extends Document {
  name: string;
  email: string;
  password: string;
}
const UsuarioSchema = new Schema<IUsuario>({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El email es obligatorio"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "El email no es válido"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [7, "La contraseña debe tener al menos 7 caracteres"],
  },
});

export const Usuario = model<IUsuario>("Usuario", UsuarioSchema);
