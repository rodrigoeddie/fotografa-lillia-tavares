import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async(event) => {
  const req = event.node.req;

  const prisma = new PrismaClient();
  switch (req.method) {
    case 'POST':
      const formData = await readMultipartFormData(event);

      let dataString = {};

      formData.forEach(async function(item) {
        if(item.name != 'file') {
          const name   = item.name;
          const string = item.data.toString("utf-8");
          dataString[name] = string;
        } else {
          const imagesType: string[] = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', ];
          if (!imagesType.includes(item.type.toString())) throw new Error('Não é imagem png, jpg ou webp');

          const buffer        = Buffer.from(item.data);
          const fileExtension = item.type.split("/").pop();
          const fileName      = uuidv4() + '.' + fileExtension;
          const dir           = process.cwd() + '/src/uploads/';
          const filePath      = path.join(dir, fileName);

          dataString.image = fileName;
          fs.writeFileSync(filePath, buffer);
        }
      });

      // Cria uma nova postagem no banco de dados
      const post = await prisma.post.create({
        data: {
          title: dataString['title'],
          content: dataString['content'],
          published: dataString['published'].toLowerCase() === 'true',
          userId: 1,
          image: dataString['image']
        },
      });

      return post;
      // if(post.id) {
      // } else {
      //   return false;
      // }
    case 'GET':
      const posts = await prisma.post.findMany();

      return {
        posts: posts
      };
    case 'PUT':
      // const { id } = req.params;
      // const { title, body, image } = req.body;
      // await prisma.post.update({
      //   id,
      //   title,
      //   body,
      //   image,
      // });

      // res.status(200).json(post);

      break;
    case 'DELETE':
      const idDeleted = await readBody(event);
      return await prisma.post.delete({
        where: {
          id: idDeleted,
        },
      });
    default:
      // res.status(405).send('Método não permitido');
  }
});
