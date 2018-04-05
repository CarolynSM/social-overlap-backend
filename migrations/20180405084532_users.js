exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.text("userName");
    table.text("fullName");
    table.text("userId");
    table.integer("totalFollowers");
    table.text("profileImg");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
