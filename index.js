const http = require("http");
const fs = require("fs/promises");
const url = require("url");
const { insert, consult, edit, eliminate } = require("./consultas");

const PORT = 3000;

const showError = (res, e) => {
    res.statusCode = 500;
    const respError = {
        error: "Error de servidor",
        message: e.message,
        code: e.code
    }
    res.end(JSON.stringify(respError));
}

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html;chartset=utf8");
      const html = await fs.readFile("index.html", "utf8");
      res.end(html);

    } else if (req.url == "/cancion" && req.method == "POST") {
      let body = "";
      req.on("data", (payload) => {
        body += payload;
      });
      req.on("end", async () => {
          try {
            const bodyJSON = JSON.parse(body);
            const datos = Object.values(bodyJSON);
            const respuesta = await insert(datos);
            res.statusCode = 201;
            res.end(JSON.stringify(respuesta));
          } catch (e) {
              showError(res, e);
          }
      });

    } else if (req.url == "/canciones" && req.method == "GET") {
        try {
            const registros = await consult();
            res.statusCode = 200;
            res.end(JSON.stringify(registros));
        } catch (e) {
            showError(res, e);
        }
        
    } else if (req.url == "/cancion" && req.method == "PUT") {
      let body = "";
      req.on("data", (payload) => {
        body += payload;
      });
      req.on("end", async () => {
          try {
            const datos = Object.values(JSON.parse(body));
            const respuesta = await edit(datos);
            res.statusCode = 201;
            res.end(JSON.stringify(respuesta));
          } catch (e) {
            showError(res, e);
          }
      });
    } else if (req.url.startsWith("/cancion?") && req.method == "DELETE") {
        try {
            const { id } = url.parse(req.url, true).query;
            const respuesta = await eliminate(id);
            res.statusCode = 200;
            res.end(JSON.stringify(respuesta));
        } catch (error) {
            showError(res, e); 
        }
    } else {
      res.statusCode = 404;
      res.end("Recurso no encontrado");
    }
  })
  .listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
