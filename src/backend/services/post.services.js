const prisma = require("../lib/prisma");

class PostService {
  static async create(data) {
    console.log(data);
    await prisma.post.create({
      data
    });
    return;
  }
  static async remove(data) {
    const post = await prisma.post.findUnique({
      where: {
        id: data.id
      }
    });
    if (post) {
      await prisma.post.delete({
        where: {
          id: data.id
        }
      });
    }
    return;
  }
  static async all() {
    const allPosts = await prisma.post.findMany({
      include: {
        carer: true
      }
    });
    return allPosts;
  }
}

module.exports = PostService;