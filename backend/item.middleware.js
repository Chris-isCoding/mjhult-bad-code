import Items from "./ItemSchema.js";

const item = {
  get: (req, res, next) => {
    Items.find({}, (err, items) => {
      console.log(items);
      if (!items) {
        res.locals.items = [];
        return next();
      }

      res.locals.items = items;
      return next();
    });
  },

  create: (req, res, next) => {
    const { title, desc } = req.body;
    console.log(title, desc);
    Items.create({ title, desc }, (err, item) => {
      console.log(item);
      return next();
    });
  },

  delete: (req, res, next) => {
    const { title } = req.body;
    Items.findOneAndDelete({ title }, (err, item) => {
      return next();
    });
  },
};

export default item;
