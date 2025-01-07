import mongoose from "mongoose";

const conectionDB = async () => {
  try {
    const dbConnectionString = process.env.DB_CNN;
    if (!dbConnectionString) {
      throw new Error("La variable de entorno DB_CNN no está configurada.");
    }

    await mongoose.connect(dbConnectionString);
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error(error);
    throw new Error("Error de conexion a la base de datos");
  }
};

export { conectionDB };
