const mongoose = require('mongoose');
const User = require('../models/User'); // Asegúrate de que la ruta de tu modelo de usuario sea correcta

// Conexión a la base de datos (ajusta la URI según tu configuración)
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conectado a la base de datos');

    // Crear un nuevo usuario admin
    const adminUser = new User({
      login: 'admin',
      password: 'admin', // Asegúrate de usar un hash para la contraseña en producción
      rol: 'admin',
    });

    // Guardar el usuario en la base de datos
    adminUser.save()
      .then(() => {
        console.log('Usuario admin creado correctamente');
        mongoose.disconnect(); // Desconectarse de la base de datos una vez que se haya creado el usuario
      })
      .catch((err) => {
        console.error('Error al crear el usuario admin:', err);
        mongoose.disconnect();
      });
  })
  .catch((err) => {
    console.error('Error de conexión:', err);
  });
