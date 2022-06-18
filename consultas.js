const { Pool } = require("pg");

const config = {
  user: "jrodriguez",
  host: "localhost",
  password: "85208520",
  port: 5432,
  database: "repertorio",
};

const pool = new Pool(config);

const insert = async (data) => {
  const consult = {
    text: "INSERT INTO repertorio (cancion, artista, tono) VALUES ($1, $2, $3)",
    values: data,
    rowsMode: "array",
  };
  try {
    const result = await pool.query(consult);
    console.log(
      "AGREGAR: Se ha insertado un nuevo registro en la tabla repertorio."
    );
    return result.rows;
  } catch (error) {
    console.log(error.code);
    throw error;
  }
};

const consult = async () => {
  try {
    const result = await pool.query(
      "SELECT id, cancion, artista, tono FROM repertorio"
    );
    return result;
  } catch (error) {
    console.log(error.code);
    throw error;
  }
};

const edit = async (data) => {
    const consult = {
      text: `UPDATE repertorio SET
      cancion = $1,
      artista = $2,
      tono = $3
      WHERE id = $4 RETURNING *`,
      values: [data[1], data[2], data[3], data[0]],
    };
  
    try {
      const result = await pool.query(consult);
      console.log("EDITAR: Se ha editado un registro en la tabla repertorio.");
      console.log(result)      
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const eliminate = async (id) => {
    const consult = {
      text: "DELETE FROM repertorio WHERE id = $1",
      values: [id],
    };
    try {
      const result = await pool.query(consult);
      console.log("ELIMINAR: Se ha eliminado un registro en la tabla repertorio.");      
      return result;
    } catch (error) {
      console.log(error.code);
      throw error;
    }
  };

module.exports = {
  insert,
  consult,
  edit,
  eliminate
};
