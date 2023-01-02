const prisma = require("../lib/prisma");

class PostService {
  static async create({ post, userId }) {
    const newPost = await prisma.post.create({
      post,
      carerId: userId
    });
    return newPost;
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