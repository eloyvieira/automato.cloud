## Production Deployment

There are two supported deployment methods:

1. **Manual deployment**
2. **Automated CI/CD deployment with Docker Swarm**

Use the manual process when Docker Swarm is not configured on the server.

Use the CI/CD workflow when the production server is running Docker Swarm and the GitHub Actions pipeline is configured.

---

## Manual Production Deployment

### First Deployment

```bash
git clone <repository-url>
cd automato.cloud/site

npm ci
npx prisma generate
npx prisma migrate deploy

npm run build

pm2 start npm --name automato -- start
pm2 save
```

### Production Update

```bash
cd <project-directory>/site

git pull

npm ci
npx prisma generate
npx prisma migrate deploy

rm -rf .next
npm run build

pm2 restart automato --update-env
```

### Full Rebuild

Use this when the `.next` directory is corrupted or the production build needs to be recreated.

```bash
cd <project-directory>/site

pm2 stop automato

rm -rf .next

npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

pm2 start automato
pm2 save
```

### PM2 Commands

```bash
pm2 list
pm2 restart automato
pm2 restart automato --update-env
pm2 stop automato
pm2 logs automato
pm2 logs automato --lines 100
pm2 save
```

---

## Automated CI/CD Deployment

When the production server is configured with Docker Swarm, deployment is handled automatically by GitHub Actions.

The workflow is:

```text
GitHub Repository
        │
        ▼
GitHub Actions
        │
        ├── Checkout source code
        ├── Install dependencies
        ├── Build Docker image
        ├── Push image to Docker Registry
        │
        ▼
Production Server
        │
        ├── Pull latest Docker image
        ├── Compare image digest
        └── Update Docker Swarm service
```

The production image is built using:

```text
site/Dockerfile
```

The image is published as:

```text
<registry>/automato.cloud:latest
```

The Docker Swarm stack name is:

```text
automato
```

The web service is:

```text
automato_web
```

If the service already exists, the CI/CD pipeline updates it:

```bash
docker service update \
  --with-registry-auth \
  --image "<registry>/automato.cloud:latest" \
  automato_web
```

If the service does not exist yet, the stack is created using:

```bash
docker stack deploy \
  --with-registry-auth \
  -c /opt/automato/docker-compose.yml \
  automato
```

---

## Docker Swarm Production Commands

### List services

```bash
docker service ls
```

### Inspect service

```bash
docker service inspect automato_web
```

### Service status

```bash
docker service ps automato_web
```

### Service logs

```bash
docker service logs automato_web
```

Follow logs:

```bash
docker service logs -f automato_web
```

### Force service redeploy

```bash
docker service update \
  --force \
  automato_web
```

### Stack status

```bash
docker stack services automato
```

### Stack processes

```bash
docker stack ps automato
```

### Remove stack

```bash
docker stack rm automato
```

---

## Deployment Strategy

### Without Docker Swarm

Use:

```text
Git → npm → Prisma → Next.js Build → PM2
```

### With Docker Swarm

Use:

```text
GitHub → GitHub Actions → Docker Registry → Docker Swarm
```

When Docker Swarm CI/CD is enabled, manual PM2 deployment is normally not required.

The manual deployment process should remain documented as a fallback and for servers that are not using Docker Swarm.


## Quick Reference

### Development

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Development with Docker

Start:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  up --build
```

Start in background:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  up -d --build
```

Stop:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  down
```

Logs:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  logs -f
```

---

### Schema Changed

```bash
npx prisma migrate dev --name migration_name
npx prisma generate
```

### Check Migration Status

```bash
npx prisma migrate status
```

---

### Manual Production Start

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 start npm --name automato -- start
pm2 save
```

### Manual Production Update

```bash
git pull
npm ci
npx prisma generate
npx prisma migrate deploy
rm -rf .next
npm run build
pm2 restart automato --update-env
```

### Manual Production Logs

```bash
pm2 logs automato --lines 100
```

### Manual Full Rebuild

```bash
pm2 stop automato
rm -rf .next
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 start automato
pm2 save
```

---

### Docker Swarm Production Start

First deployment:

```bash
docker stack deploy \
  --with-registry-auth \
  -c docker-compose.yml \
  automato
```

If the production Compose is stored in the deploy directory:

```bash
docker stack deploy \
  --with-registry-auth \
  -c /opt/automato/docker-compose.yml \
  automato
```

### Docker Swarm Status

```bash
docker service ls
docker stack services automato
docker service ps automato_web
```

### Docker Swarm Logs

```bash
docker service logs --tail 100 automato_web
```

Follow logs:

```bash
docker service logs -f automato_web
```

### Force Docker Swarm Redeploy

```bash
docker service update --force automato_web
```

### Redeploy Stack

```bash
docker stack deploy \
  --with-registry-auth \
  -c /opt/automato/docker-compose.yml \
  automato
```

### Remove Stack

```bash
docker stack rm automato
```

---

### Deployment Reminder

Development:

```text
Docker Compose
→ docker-compose.yml
+ docker-compose.dev.yml
→ Next.js Development Server
```

Manual production:

```text
Git → npm ci → Prisma → Next.js Build → PM2
```

CI/CD production:

```text
GitHub → GitHub Actions → Docker Registry → Docker Swarm
```
