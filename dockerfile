# Imagen de node
FROM node:20.18.2

# Generar el directorio "app" de forma recursiva
RUN mkdir -p /usr/src/app

# Definir la ruta del workspace
WORKDIR /usr/src/app

# Importa los archivos json necesarios al workspace
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el directorio actual al workspace
COPY . .

# Indica el puerto en el que estará escuchando el contenedor
EXPOSE 8080

# Define el comando que se ejecutará en el contenedor
CMD ["npm", "start"]
