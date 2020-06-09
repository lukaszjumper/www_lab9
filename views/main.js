class Mem {
    constructor(id, name, initial_price, url) {
      this.id = id;
      this.name = name;
      this.url = url;
      this.prices = [];
      this.prices.push(initial_price);
      this.current_price = initial_price;
    }
  
    // Zaktualizuj cenę
    change_price(price) {
      this.prices.unshift(price);
      this.current_price = price;
    }
  
    compare(a) {
      if (a === undefined) {
        return true;
      }
      else if (a.current_price < this.current_price) {
        return true;
      }
      else {
        return false;
      }
    }
  }
  
class Memes {
    constructor() {
      this.memes = [];
    }
  
    // Top memów
    get_top() {
      var top = [];
  
      for (var i=0; i<this.memes.length; i++) {
        if (this.memes[i].compare(top[0])) {
          top[0] = this.memes[i];
        }
      }
      for (var i=0; i<this.memes.length; i++) {
        if (this.memes[i].compare(top[1]) && this.memes[i] !== top[0]) {
          top[1] = this.memes[i];
        }
      }
      for (var i=0; i<this.memes.length; i++) {
        if (this.memes[i].compare(top[2]) && this.memes[i] !== top[0] && this.memes[i] !== top[1]) {
          top[2] = this.memes[i];
        }
      }
  
      return top;
    }
  
    // Dodaje mem
    add(name, initial_price, url) {
      var id = this.memes.length;
      var new_meme = new Mem(id, name, initial_price, url);
      this.memes.push(new_meme);
    }
  
    // Zwraca mem o podanym id
    get_meme(id) {
      return this.memes[id];
    }
  }
  
var mem_set = new Memes();
mem_set.add('Gold', 1000, 'https://i.redd.it/h7rplf9jt8y21.png');
mem_set.add('Platinum', 1100, 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg');
mem_set.add('Elite', 1200, 'https://i.imgflip.com/30zz5g.jpg');
mem_set.add('Studenci', 2000, 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/28279819_2042667492643615_5779301380012323331_n.png?_nc_cat=101&_nc_sid=8024bb&_nc_oc=AQlCAigqlCm7tygMN7cDsPdmk5p3ygmilXtsycBxr8XjikkujJjUDzuggtpHifCTfTA&_nc_ht=scontent-waw1-1.xx&oh=0a4c2d4cca0309d45ec0b6b8af612149&oe=5EECECB8');
mem_set.add('Usos', 900, 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/84730097_2549641138612912_2019141237692432384_n.jpg?_nc_cat=105&_nc_sid=8024bb&_nc_oc=AQlzeeLEKVVj5HHx_pu-0Sbl_1pdDQXCjphRCs1PnB2BhUqheQyagzP4Ss2-tH1rGRI&_nc_ht=scontent-waw1-1.xx&oh=77b79aad9f91941e12c24bebbffe5457&oe=5EEA63AE');
mem_set.add('Bugs', 1900, 'https://scontent-waw1-1.xx.fbcdn.net/v/t1.0-9/62261323_2350639285179766_55145589079277568_n.jpg?_nc_cat=107&_nc_sid=8024bb&_nc_oc=AQkQ4lQK7NsJuMNZeJZgfLt4vu_hpSJvYmE9DeqaSXIUXaA8lE9wbSgvzx_0iworA3E&_nc_ht=scontent-waw1-1.xx&oh=3c9ef186fe14244331c51b117d819dd0&oe=5EEDD9C1');
mem_set.get_meme(3).change_price(2100);
mem_set.get_meme(4).change_price(1500);
mem_set.get_meme(4).change_price(1400);
mem_set.get_meme(5).change_price(1800);

  
module.exports = mem_set;