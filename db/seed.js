const db = require(".");
const format = require("pg-format");

function seed({ snacksData, categoriesData }) {
	return db
		.query("DROP TABLE IF EXISTS snacks;")
		.then(() => {
			return db.query("DROP TABLE IF EXISTS categories;");
		})
		.then(() => {
			return db.query(`CREATE TABLE categories (
                            category_id SERIAL PRIMARY KEY,
                            category_name VARCHAR NOT NULL
                    );`);
		})
		.then(() => {
			return db.query(`CREATE TABLE snacks (
                            snack_id SERIAL PRIMARY KEY,
                            snack_name VARCHAR NOT NULL,
                            flavour_text TEXT NOT NULL,
                            rating INT CHECK (rating > 0 AND rating <=5),
                            category_id INT REFERENCES categories(category_id) NOT NULL
                     );`);
		})
		.then(() => {
			const insertQuery = format(
				`INSERT INTO categories (category_name) VALUES %L RETURNING *;`,
				categoriesData.map(({ category_name }) => {
					return [category_name];
				})
			);

			return db.query(insertQuery);
		})
		.then(({ rows: insertedCategories }) => {
			const lookup = insertedCategories.reduce(
				(lookup, { category_id, category_name }) => {
					lookup[category_name] = category_id;
					return lookup;
				},
				{}
			);
			const formattedSnacks = snacksData.map(({ category, ...rest }) => {
				return [...Object.values(rest), lookup[category]];
			});

			const insertQuery = format(
				`INSERT INTO snacks 
          (snack_name, flavour_text, rating, category_id) 
          VALUES %L RETURNING *;`,
				formattedSnacks
			);
			return db.query(insertQuery);
		});
}

module.exports = seed;
