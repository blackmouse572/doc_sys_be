# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json 
COPY package*.json ./

# Install dependencies (excluding devDependencies) if package-lock.json is present
RUN npm ci --only=production

# Copy source code
COPY . .

# Build app
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:dVRknH0rZW3gwpmt@db.sxqwpdixxdwfxwrmivma.supabase.co:5432/postgres
ENV JWT_SECRET=dVRknH0rZW3gwpmt

# Start server using production build
CMD ["npm", "run", "start:prod"]
# Expose port 3000
EXPOSE 3000