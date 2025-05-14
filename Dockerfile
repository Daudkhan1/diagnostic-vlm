# Dockerfile for React App

# Step 1: Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Build the app for production (use for production build)
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Start the app
cmd ["npm", "start"]
