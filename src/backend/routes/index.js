// const { prisma } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

/* GET home page. */
router.get('/', async function (req, res) {
  const posts = await prisma.post.findMany();
  res.status(200).send({
    status: 200,
    msg: "All Available Posts",
    data: posts
  });
});

module.exports = router;
