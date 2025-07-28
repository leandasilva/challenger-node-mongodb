# node-mongo-big-file-exercise

- Vamos por parte utilice el mismo nombre de la base de datos de mongodb.
  
- Limpie route para dejarlo más intuitivo quite todo otra funcionalidad dejandolo todo a la funcion upload.
  
- Modifique scripts start y dev para utilizar nodemon(luego de actualizar baje y levanta en gitbash recarga el servicio de manera automatica)
  
- Comando para iniciar npm run dev
  
- Mejore rendimiento de carga y disminucion de tiempo y uso de memoria cache buffer paso de 2,50 minutos a 1,49 minutos de carga en mongodb.
  rendimiento considerable de la mitad de tiempo con registros de 100.000.
  
- Cambio aplicados en primer lugar pude importar el .json de Postman.
  
- Descargué el archivo .csv y probe con un archivo mayor a 80mb que no supere los 200mb donde si llega a sobrepasar los 200mb lanza un mensaje de error
  y no me permite subir un archivo y así cumplir con la fiabilidad de un sistema.


# Consideraciones:

- Mantuve un codigo limpio prolijo y bien claro para que sea una api escalable y mantenible respetando la estructura de controller model y route.

- En un futuro se podria agregar autenticaciones middleware para que sea mas seguro y para que solo pueda acceder a dichos datos solo el propietario
  a traves de un token de auth con jwt, desde el backend.

- Ademas de Express cuento con conocimiento de Nestjs es similar pero cambia en varias cosas.
 
