//TODO: seeds script should come here, so we'll be able to put some data in our local env
const express = require("express");
const mongoose = require("mongoose");
require("../models/User");
require("../models/Item");
require("../models/Comment");
const app = express();

mongoose.connect(process.env.MONGODB_URI);

const User = mongoose.model("User");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");

const dataFake = async () => {
  for (let i = 0; i < 100; i++) {
    //add user
    const user = {
      username: `user${i}`,
      passoword: `user${i}password`,
      email: `user${i}@gmail.com`,
    };
    const createUser = await User.create(user);

    //add item to user
    const item = {
      slug: `slug${i}`,
      title: `title ${i}`,
      description: `description ${i}`,
      seller: createUser,
    };
    const createdItem = await Item.create(item);

    // add comments to item
    if (!createdItem?.comments?.length) {
      let commentIds = [];
      for (let j = 0; j < 100; j++) {
        const comment = new Comment({
          body: `body ${j}`,
          seller: createUser,
          item: createdItem,
        });
        await comment.save();
        commentIds.push(comment._id);
      }
      createdItem.comments = commentIds;
      await createdItem.save();
    }
  }
};

dataFake()
  .then(() => {
    console.log("Finished DB seeding");
    process.exit(0);
  })
  .catch((err) => {
    console.log(`Error while running DB seed:${err.message}`);
    process.exit(1);
  });
