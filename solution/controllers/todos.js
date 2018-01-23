const router = require("express").Router();

router.get("/", (req, res, next) => {
  const todosData = [
    { id: 1, title: 'Clean Car', description: 'not fun', is_done: false  },
    { id: 2, title: 'Shave cat', description: 'why is that happening', is_done: false  },
    { id: 3, title: 'make pasta', description: 'need food', is_done: true  }
      
  ];
  res.render("todos", { todosData: todosData  });
});

module.exports = router;
