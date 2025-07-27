const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');///Librería para leer archivos CSV instalado con npm install csv-parser
const Records = require('./records.model');///Modelo de Mongoose para la colección de registros
const BATCH_SIZE = 1000; // Tamaño de lote por carga


/**
 *  Configuración de multer para manejar archivos grandes.
 * Los archivos se guardan en una carpeta temporal (_temp) con un nombre único basado en la fecha y hora.
 * El tamaño máximo del archivo permitido es de 200 MB.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '_temp'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

/* * @description
 * Esta configuración de multer permite manejar archivos grandes, guardándolos en una carpeta temporal (_temp).
 * Los archivos se nombran de forma única utilizando la fecha y hora actuales para evitar colisiones.
 * El tamaño máximo del archivo permitido es de 200 MB, lo que ayuda a prevenir problemas de memoria al procesar archivos grandes.
 */
const uploadFile = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
}).single('file');


/**
 * Maneja la carga de archivos CSV y los inserta en MongoDB.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise<void>}
 * @throws {Error} Si ocurre un error al leer el archivo o insertar en MongoDB.
 * * @description
 * Esta función lee un archivo CSV cargado, lo procesa en lotes y lo inserta en la colección de MongoDB.
 * Utiliza streams para manejar archivos grandes y evitar problemas de memoria.
 * Los registros se insertan en lotes para mejorar el rendimiento.
 * Los errores de inserción se manejan para evitar que un error en un registro detenga todo el proceso.
 * El archivo se espera que tenga un formato compatible con el esquema definido en records.model.js.
 * El archivo se guarda temporalmente en la carpeta '_temp' con un nombre único basado en la fecha y hora de carga.
 * El tamaño máximo del archivo permitido es de 200 MB.
 * Si el archivo supera este tamaño, se devuelve un error 400.
 * Si ocurre un error al procesar el archivo, se devuelve un error 500 con el mensaje de error.
 * Si la carga es exitosa, se devuelve un mensaje de éxito con estado 200.
 */
const upload = (req, res) => {
  uploadFile(req, res, async function (err) {
    // Errores de multer
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo supera el tamaño máximo permitido (200MB).' });
    } else if (err) {
      return res.status(500).json({ message: 'Error al procesar el archivo', error: err.message });
    }

    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }

    const filePath = path.join(__dirname, '..', '_temp', file.filename);
    const buffer = [];

    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on('data', async (data) => {
      buffer.push(data);

      if (buffer.length >= BATCH_SIZE) {
        stream.pause();
        try {
          await Records.insertMany(buffer);
          buffer.length = 0;
          stream.resume();
        } catch (error) {
          console.error('Error al insertar lote:', error);
          return res.status(500).json({ message: 'Error al insertar lote en MongoDB', error });
        }
      }
    });

    stream.on('end', async () => {
      if (buffer.length > 0) {
        try {
          await Records.insertMany(buffer, { ordered: false });
        } catch (error) {
          console.error('Error al insertar lote final:', error);
          return res.status(500).json({ message: 'Error al insertar lote final en MongoDB', error });
        }
      }

      return res.status(200).json({ message: 'Archivo cargado correctamente' });
    });

    stream.on('error', (err) => {
      console.error('Error de lectura CSV:', err);
      return res.status(500).json({ message: 'Error al leer archivo CSV', error: err });
    });
  });
};


/**
 * 
  * Lista los últimos 10 registros de la colección de MongoDB.
 * @param {Object} res - Response object.
 * @returns {Promise<void>} 
 * @throws {Error} Si ocurre un error al consultar la base de datos.
 * * @description     
 *  Esta función consulta la colección de MongoDB para obtener los últimos 10 registros.
 *  Utiliza el método `find` para recuperar los registros, ordenándolos por `_id` en orden descendente.
 *  Los resultados se limitan a 10 registros para optimizar la respuesta.
 *  Los registros se devuelven en formato JSON.
 *  Si ocurre un error durante la consulta, se devuelve un error 500 con el mensaje de error.
 */
const list = async (_, res) => {
    try {
        const data = await Records
            .find({})
            .sort({ _id: -1 }) // Orden descendente por _id (últimos primero)
            .limit(10)
            .lean();
        
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};


module.exports = {
    upload,
    list,
};
