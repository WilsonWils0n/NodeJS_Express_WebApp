import sqlite3 from "sqlite3";

// class for database interaction
class Interactions {
  constructor(path) {
    this.db = new sqlite3.Database(path, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log("\x1b[34m%s\x1b[0m", "Connected to SQLite3 database");
    });
  }

  // wraps db.get in a promise to avoid callback hell
  get(query, params) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // wraps db.all in a promise to pass on callback hell
  all(query, params) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // js bloat to avoid callback hell
  run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

class Levenshtein {
  static distance(s1, s2) {
    const m = s1.length;
    const n = s2.length;

    const matrix = [];

    for (let i = 0; i <= m; i++) {
      const row = [];
      for (let j = 0; j <= n; j++) {
        row.push(0);
      }
      matrix.push(row);
    }

    for (let i = 1; i <= m; i++) {
      matrix[i][0] = i;
    }

    for (let j = 1; j <= n; j++) {
      matrix[0][j] = j;
    }

    for (let j = 1; j <= n; j++) {
      for (let i = 1; i <= m; i++) {
        let substitutionCost;
        if (s1[i - 1] !== s2[j - 1]) {
          substitutionCost = 1;
        } else {
          substitutionCost = 0;
        }

        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + substitutionCost
        );
      }
    }

    return matrix[m][n];
  }
}

const db = new Interactions("movie.db");

// updates 'tableName.columnName' to 'newValue' where 'tableName.idColumn = idValue'
async function updateRow(tableName, columnName, newValue, idColumn, idValue) {
  await db.run(
    `update ${tableName} set ${columnName} = ? where ${idColumn} = ?`,
    [newValue, idValue]
  );
}

async function checkUsernameExists(username) {
  return await db.get(`
    select exists(
      select 42 from user where name = ?
      ) as user_exists;
    `, [username]);
}

// returns all actors in the movie with 'movieID'
async function getActorsInMovie(movieID) {
  return await db.all(`
        select id as actor_id, actor_image, name 
        from actor
        where movie_id = ?
    `, [movieID]);
}

// returns all movies that are currently running
async function getAllRunningMovies() {
  return await db.all(`
        select distinct movie.id as movie_id, name, description, duration, director, cover_image from movie
        inner join schedule on schedule.movie_id = movie.id 
        where schedule.playing_from > datetime('now')
    `);
}

// returns all movies that are currently running, with options for pagination.
async function getAllRunningMoviesWithOptions(limit, offset, sortBy, sortOrder) {
  console.log(limit, offset, sortBy, sortOrder)

  const validSortColumns = ['name', 'duration', 'director', 'datePublished'];
  const validSortOrders = ['asc', 'desc'];

  if (!validSortColumns.includes(sortBy)) {
    throw new Error(`Invalid sort column`);
  }

  if (!validSortOrders.includes(sortOrder)) {
    throw new Error(`Invalid sort order`);
  }

  return await db.all(
    `
    select distinct movie.id as movie_id, name, description, duration, director, cover_image, datePublished from movie
    inner join schedule on schedule.movie_id = movie.id 
    where schedule.playing_from > datetime('now')
    order by ${sortBy} ${sortOrder} limit ? offset ?;
    `,
    [limit, offset]
  );
}

const getMovie = async (name) => {
  return await db.all(
    `
            select movie.id as movie_id, name, description, duration, director, cover_image from movie
            where movie.name = ? collate NOCASE
        `,
    [name]
  );
}

const levenshteinMovie = async (str) => {
  const names = await db.all(
    `
        select movie.id as movie_id, name, description, duration, director, cover_image from movie
        `
  );

  let distances = names.map(n => {
    return {
      dist: Levenshtein.distance(n.name.split(":")[0], str),
      name: n
    }
  });

  distances = distances.sort((a, b) => {
    return a.dist - b.dist;
  });

  console.log(distances);

  const matches = distances.filter(d => {
    return d.dist < Math.ceil(d.name.name.split(":")[0].length / 1.5);
  });

  return matches.map(m => m.name);
}

// returns the schedule of movie with id 'movieID'
async function getMovieSchedule(movieID) {
  return await db.all(
    `
        select id as schedule_id, playing_from from schedule where movie_id = ?
    `,
    [movieID]
  );
}

// returns the schedule of movie with id 'movieID', with options for pagination.
async function getMovieScheduleWithOptions(movieID, limit, offset, sortBy, sortOrder) {
  const validSortColumns = ['playing_from'];
  const validSortOrders = ['asc', 'desc'];

  if (!validSortColumns.includes(sortBy)) {
    throw new Error(`Invalid sort column`);
  }

  if (!validSortOrders.includes(sortOrder)) {
    throw new Error(`Invalid sort order`);
  }

  return await db.all(
    `
    select id as schedule_id, playing_from from schedule where movie_id = ?
    order by ${sortBy} ${sortOrder} limit ? offset ?;
    `,
    [movieID, limit, offset]
  );
}

// returns all schedules with options for pagination.
async function getAllSchedulesWithOptions(limit, offset, sortBy, sortOrder) {
  const validSortColumns = ['playing_from'];
  const validSortOrders = ['asc', 'desc'];

  if (!validSortColumns.includes(sortBy)) {
    throw new Error(`Invalid sort column`);
  }

  if (!validSortOrders.includes(sortOrder)) {
    throw new Error(`Invalid sort order`);
  }

  return await db.all(
    `
    select id as schedule_id, movie_id, playing_from from schedule
    order by ${sortBy} ${sortOrder} limit ? offset ?;
    `,
    [limit, offset]
  );
}


// get all info from the user table for 'username'
async function getUserInfo(username) {
  return await db.get(
    `
        select * from user 
        where name = ?
        `,
    [username]
  );
}

// updates the 'username' user with all values specified in update for userKeys
async function updateUser(username, update) {
  const userKeys = [
    "user",
    "password",
    "email",
    "address",
    "credit_card",
    "first_name",
    "last_name",
  ];

  for (const key of userKeys) {
    if (key in update) {
      await updateRow("user", key, update[key], "name", username);
    }
  }
}

// creates a new user
async function createUser(data) {
  await db.run(
    `insert into user (name, password, email, address, credit_card) values (?, ?, ?, ?, ?)`,
    [data.username, data.password, data.email, data.address, data.creditCard]
  );
}

// checks if a password is correct
async function checkPassword(username, password) {
  const res = await db.get(
    `select exists(select 1 from user where name = ? and password = ?) as row_exists`,
    [username, password]
  );
  return res.row_exists === 1;
}

// makes a ticket order
// expect a dict where the keys are schedule id's and numbers are acmount of tickets:
// { 5 : 4, 2: 5 }
async function makeOrder(username, order) {
  db.db.serialize(async () => {
    await db.run("BEGIN TRANSACTION");
    try {
      const res = await db.get(
        `insert into ticket_order (user, order_date) values (?, datetime('now')) returning id`,
        [username]
      );
      const orderID = res.id;
      for (const scheduleID in order) {
        for (let i = 0; i < order[scheduleID]; i++) {
          await db.run(
            `insert into ticket (order_id, schedule_id) values (?, ?)`,
            [orderID, scheduleID]
          );
        }
      }
      await db.run("COMMIT");
    } catch (error) {
      console.log("error", error);
      await db.run("ROLLBACK");
      throw error;
    }
  });
}

// get all orders that the 'username' user made
async function getOrders(username) {
  const order_list = [];
  const orders = await db.all("select id from ticket_order where user is ?", [
    username,
  ]);

  for (const order of orders) {
    const tickets = await db.all(
      `
        select 
            ticket.id as ticket_id,
            movie.id as movie_id,
            schedule.id as schedule_id,
            movie.name,
            movie.description,
            movie.duration,
            movie.director,
            movie.cover_image,
            schedule.playing_from
            from ticket
        inner join schedule on schedule.id = ticket.schedule_id 
        inner join movie on movie.id = schedule.movie_id 
        where ticket.order_id = ?
        `,
      [order.id]
    );
    order_list.push({
      [order.id]: { order_datetime: order.order_date, tickets: tickets },
    });
  }
  return order_list;
}

async function saveLog(log) {
  await db.run(
    `insert into log (
        "timestamp", 
        "method", 
        url, 
        headers, 
        body, 
        ip, 
        response_time, 
        error_msg, 
        status_code) values (DATETIME('now'), ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      log.method,
      log.url,
      log.headers,
      log.body,
      log.ip,
      log.responseTime,
      log.error,
      log.statusCode,
    ]
  );
}

export default {
  checkUsernameExists,
  getAllSchedulesWithOptions,
  getAllRunningMovies,
  getAllRunningMoviesWithOptions,
  levenshteinMovie,
  getMovieSchedule,
  getMovieScheduleWithOptions,
  getActorsInMovie,
  createUser,
  updateUser,
  getUserInfo,
  checkPassword,
  makeOrder,
  getOrders,
  saveLog,
  getMovie,
};
