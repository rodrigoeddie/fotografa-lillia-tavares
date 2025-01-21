
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const theuser = await prisma.user.upsert({
        where: { email: 'ti@luego.com.br' },
        update: {},
        create: {
            email: 'ti@luego.com.br',
            name: 'Ti Luego',
            posts: {
                create: {
                    title: 'lorem',
                    content: 'lorem impsum',
                    published: false,
                },
            },
        },
    });

    console.log({ theuser })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
