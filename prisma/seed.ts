import { Prisma, PrismaClient } from '../generated/client/deno/edge.ts'
import { config } from 'https://deno.land/std@0.165.0/dotenv/mod.ts'

const envVars = await config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: envVars.DATABASE_URL
        }
    }
})

const dinosaurData: Prisma.DinosaurCreateInput[] = [
    {
        name: 'Goofie goober',
        description: 'this is the gofie goober'
    },
    {
        name: "Arik",
        description: "this is Arik"
    },
    {
        name: 'Ben',
        description: 'good Times'
    }
]

for (const d of dinosaurData) {
    const dinosaur = await prisma.dinosaur.create({
        data: d
    })
    console.log(`data... created dinosaur with id  ${dinosaur.id}`)
}
console.log(`seeding finished!`)

await prisma.$disconnect()