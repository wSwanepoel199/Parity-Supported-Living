const prisma = require("../lib/prisma");

class PostService {
  static async create(data) {
    const post = await prisma.post.create({
      data
    });
    return post;
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
    const allPosts = await prisma.post.findMany();
    return allPosts;
  }
}

module.exports = PostService;