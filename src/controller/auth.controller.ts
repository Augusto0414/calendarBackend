import { Request, Response } from "express";
import { IUsuario, Usuario } from "../models/usuario";
import { comparePassword, hashPassword } from "../lib/email-validator";
import { generateToken } from "../lib/jwt";

export class authController {
  static createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      let usuario = (await Usuario.findOne({ email })) as IUsuario | null;
      if (usuario) {
        res.status(400).json({
          ok: false,
          error: "El correo ya está registrado!",
        });
        return;
      }
      const hash = await hashPassword(password, 10);
      usuario = new Usuario({ name, email, password: hash });
      await usuario.save();
      res.status(201).json({ message: "Usuario creado!", data: { name, email } });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: "error al crear un usuario",
      });
    }
  };

  static loginUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      let usuario = (await Usuario.findOne({ email })) as IUsuario | null;
      if (!usuario) {
        res.status(204).json({
          ok: false,
          error: "El correo no está registrado!",
        });
        return;
      }
      const validPassword = await comparePassword(password, usuario.password);
      if (!validPassword) {
        res.status(400).json({
          ok: false,
          message: "constrasela incorrecta",
        });
        return;
      }
      const token = await generateToken(usuario.id, usuario.name);
      res.status(200).json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token,
        message: "Autenticado com sucesso!",
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: "Error en el servidor al intentar iniciar sesión",
      });
    }
  };

  static revalidateToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { uid, name } = req;

      if (!uid || !name) {
        res.status(401).json({
          ok: false,
          error: "Token no válido",
        });
        return;
      }

      const token = await generateToken(uid, name);
      if (!token) {
        res.status(401).json({
          ok: false,
          error: "Error al generar nuevo token",
        });
        return;
      }

      res.status(200).json({
        ok: true,
        uid,
        name,
        token,
        message: "Token renovado exitosamente",
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: "Error al revalidar token",
      });
    }
  };
}
