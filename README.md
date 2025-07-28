# node-mongo-big-file-exercise

- Vamos por parte utilice el mismo nombre de la base de datos de mongodb.
  
- Limpie route para dejarlo más intuitivo dejandole todo el trabajo a la funcion upload.
  
- Modifique scripts start y dev para utilizar nodemon que ya se encontraba instalado esto me permmite luego de   actualizar cada file el controlador de versiones
  se vuelve a recargar actualizando automaticamente el API.
  
- Comando para levantar servicio: npm run dev.
  
- Mejore rendimiento de carga y disminucion de tiempo paso de 2,50 minutos a 1,49 minutos de carga en mongodb.
  rendimiento considerable de la mitad de tiempo con registros de 100.000.
  
- Importe el json de Postman que ya tenia instalado en mi pc.
  
- Descargué el archivo csv del drive y probe con un archivo mayor a 80mb que no supere los 200mb donde si llega a sobrepasar los 200mb lanza un mensaje de error
  y no me permite subir un archivo y así cumplir con la fiabilidad de un sistema.

- El uso de la libreria csv-parser no utiliza todo el espacio de memoria RAM ya que solo lo utiliza para cargar linea por linea unos 10-20mb de un archivo de 80 o 200mb.


# Consideraciones

- Mantuve un codigo limpio prolijo y bien claro para que sea una api escalable y mantenible respetando la estructura de CONTROLLER, MODELS, ROUTE.

- En un futuro se podria agregar autenticaciones middleware para que sea mas seguro y para que solo pueda acceder a dichos datos solo el propietario a traves de un token de auth con jwt, desde el backend.

- Ademas de Express cuento con conocimiento de Nestjs es similar para la generar API REST(post,get,delete,put)pero cambia en varias cosas como ser la utilización de decoradores.
 
