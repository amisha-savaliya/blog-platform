module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "nodeuser",
      password: "nodepass123",
      database: "blog_system",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
