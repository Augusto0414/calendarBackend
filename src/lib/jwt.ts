import JWT from "jsonwebtoken";

const generateToken = async (uid: string, name: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const payload = { uid, name };
    if (!process.env.JWT_SECRET) {
      reject("No se ha encontrado el JWT SECRET");
      return;
    }
    JWT.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "2hr",
      },
      (err, token) => {
        if (err) {
          reject("Error generando el token");
          return;
        }
        resolve(token as string);
      }
    );
  });
};

export { generateToken };
