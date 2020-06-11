const sqlite3 = require('sqlite3').verbose();


function create() {
  sqlite3.verbose();
  let db = new sqlite3.Database('memy.db');
  db.run('CREATE TABLE memes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT);');
  db.run('CREATE TABLE prices (id INTEGER PRIMARY KEY AUTOINCREMENT, mem_id INTEGER, price INTEGER);');
  db.close();
}

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

function change_price(id, price, func) {
  let db = new sqlite3.Database('memy.db');
  db.run('INSERT INTO prices VALUES(NULL, ?, ?);', [id, price]);
  db.close();
  func();
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

/*create();
add('Gold', 1000, 'https://i.redd.it/h7rplf9jt8y21.png');
add('Platinum', 1100, 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg');
add('Elite', 1200, 'https://i.imgflip.com/30zz5g.jpg');
add('Studenci', 2000, 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/28279819_2042667492643615_5779301380012323331_n.png?_nc_cat=101&_nc_sid=8024bb&_nc_oc=AQlCAigqlCm7tygMN7cDsPdmk5p3ygmilXtsycBxr8XjikkujJjUDzuggtpHifCTfTA&_nc_ht=scontent-waw1-1.xx&oh=0a4c2d4cca0309d45ec0b6b8af612149&oe=5EECECB8');
add('Usos', 900, 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/84730097_2549641138612912_2019141237692432384_n.jpg?_nc_cat=105&_nc_sid=8024bb&_nc_oc=AQlzeeLEKVVj5HHx_pu-0Sbl_1pdDQXCjphRCs1PnB2BhUqheQyagzP4Ss2-tH1rGRI&_nc_ht=scontent-waw1-1.xx&oh=77b79aad9f91941e12c24bebbffe5457&oe=5EEA63AE');
add('Bugs', 1900, 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/62261323_2350639285179766_55145589079277568_n.jpg?_nc_cat=107&_nc_sid=8024bb&_nc_oc=AQkQ4lQK7NsJuMNZeJZgfLt4vu_hpSJvYmE9DeqaSXIUXaA8lE9wbSgvzx_0iworA3E&_nc_ht=scontent-waw1-1.xx&oh=3c9ef186fe14244331c51b117d819dd0&oe=5EEDD9C1');
*/

module.exports.add = add;
module.exports.change_price = change_price;
module.exports.get_meme = get_meme;
module.exports.get_top = get_top;