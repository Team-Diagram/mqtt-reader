# Utilisez une image de base appropriée pour votre application Node.js
FROM node:16.17

# Définir le répertoire de travail dans l'image Docker
WORKDIR /app

# Copiez les fichiers de package.json et package-lock.json dans l'image Docker
COPY package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application dans l'image Docker
COPY . .

# Définir la commande par défaut pour exécuter l'application
CMD ["npm", "start"]

