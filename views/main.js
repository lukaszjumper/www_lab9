const sqlite3 = require('sqlite3').verbose();

function add(name, initial_price, url) {
  let db = new sqlite3.Database('memy.db');
  db.run('INSERT INTO memes VALUES(NULL, ?, ?);', [name, url], (err) => {
    if (err) {
      console.log(err);
    }
    db.all('SELECT MAX(id) AS id FROM memes', [], (err, rows) => {
      if (err) {
        console.log(err);
      }
      rows.forEach((row) => {
        console.log(row);
        db.run('INSERT INTO prices VALUES(NULL, ?, ?);', [row.id, initial_price]);
      });
    });
  });
  
  db.close();
}

function change_price(id, price, user, func) {
  let db = new sqlite3.Database('memy.db');
  db.run('INSERT INTO prices VALUES(NULL, ?, ?, ?);', [id, price, user], (err) => {
    func();
  });
  db.close();
}

function get_meme(id, func) {
  let db = new sqlite3.Database('memy.db');
  let mem;
  db.all('SELECT * FROM memes WHERE id=?;', [id], (err, rows) => {
    if (err) {
      console.log(err);
    }
    rows.forEach((row) => {
      mem = row; //Jest tylko jeden
    });
    db.all('SELECT price FROM prices WHERE mem_id=? ORDER BY id;', [id], (err, list) => {
        if (err) {
          console.log(err);
        }
        if (mem !== undefined) {
          mem.prices = list;
        }
        func(mem);
    });
  });
  db.close();
}

function get_top(func) {
  let db = new sqlite3.Database('memy.db');
  db.all('SELECT mem_id, price FROM (SELECT MAX(id) AS current FROM prices GROUP BY mem_id) A JOIN prices B ON A.current = B.id ORDER BY price DESC LIMIT 3;', [], (err, rows) => {
    if (err) {
      console.log(err);
    }
    let memes = new Array();
    count = 0;
    rows.forEach((row) => {
      get_meme(row.mem_id, (new_meme) => {
        new_meme.current_price = row.price;
        memes.push(new_meme);
        count++;
        if (count === 3) {
          func(memes);
        } 
      });
    });
  });
  db.close();
}

function new_user(login, password, func) {
  let db = new sqlite3.Database('memy.db');
  db.run('INSERT INTO users VALUES(?, ?);', [login, password], (err) => {
    func();
  });
  db.close(); 
}

function check(login, password, func) {
  let db = new sqlite3.Database('memy.db');
  db.all('SELECT * FROM users WHERE login=? AND password=?;', [login, password], (err, rows) => {
    anything = false;
    rows.forEach(() => {
      anything = true;
    });
    if (!anything) {
      func(false);
    }
    else {
      func(true);
    }
  });
  db.close();
}

function exists(login, func) {
  let db = new sqlite3.Database('memy.db');
  db.all('SELECT * FROM users WHERE login=?;', [login], (err, rows) => {
    anything = false;
    rows.forEach(() => {
      anything = true;
    });
    if (!anything) {
      func(false);
    }
    else {
      func(true);
    }
  });
  db.close();
}

module.exports.add = add;
module.exports.change_price = change_price;
module.exports.get_meme = get_meme;
module.exports.get_top = get_top;
module.exports.new_user = new_user;
module.exports.check = check;
module.exports.exists = exists;