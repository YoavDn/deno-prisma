import { PrismaClient } from './generated/client/deno/edge.ts'
import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import { config } from 'https://deno.land/std@0.165.0/dotenv/mod.ts'

const envVars = await config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: envVars.DATABASE_URL
        }
    }
})

const app = new Application()
const router = new Router()

router
    .get("/", (context) => {
        context.response.body = 'Welcome the Dinosaur Api'
    })
    .get("/dinosaur", async (context) => {
        const dinosaurs = await prisma.dinosaur.findMany()
        context.response.body = dinosaurs
    })
    .get("/dinosaur:id", async (context) => {
        const { id } = context.params
        const dinosaur = await prisma.dinosaur.findUnique({
            where: {
                id: Number(id)
            }
        })
        context.response.body = dinosaur
    })
    .post("/dinosaur", async (context) => {
        const { name, description } = await context.request.body("json").value
        const res = await prisma.dinosaur.create({
            data: {
                name,
                description,
            }

        })
        context.response.body = res
    })
    .delete("/dinosaur:id", async (context) => {
        const { id } = context.params
        const dinosaur = await prisma.dinosaur.delete({
            where: {
                id: Number(id)
            }
        })
        context.response.body = dinosaur
    })

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8000 })