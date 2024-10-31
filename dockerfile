FROM node:lts

WORKDIR /usr/src/app

# Copiar solo los archivos de configuración de npm primero
COPY package*.json ./

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Comando para iniciar la aplicación
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]