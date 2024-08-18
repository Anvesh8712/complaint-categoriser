/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("complaints", function (table) {
    table.increments("id").primary();
    table.string("complaint_id").unique().notNullable();
    table.text("complaint_text").notNullable();
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories");
    table.string("company").notNullable();
    table.string("state");
    table.string("zip_code");
    table.string("timely");
    table.string("complaints_what_happened");
    table.string("consumer_consent_provided");
    table.string("company_response");
    table.string("submitted_via");
    table.string("company_public_response");
    table.timestamp("date_received");
    table.timestamp("date_sent_to_company");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("complaints");
};
