let socket = io.connect('https://exorum-server.herokuapp.com/',{'forceNew':false});
//let socket = io.connect('http://localhost:8080',{'forceNew':false});

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

function generateSecretKey(length) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function formattedDate(d = new Date) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;

  return `${day}.${month}.${year}`;
}

function random(num1, num2){
  var number = randomInteger(num1,num2);
  if(number == 1){ return true; } else { return false; }
}

var my_key = generateSecretKey(20);
var enemy_key = null;
var you = {
  "first_name": null,
  "last_name": null,
  "name": null,
  "id": null,
  "avatar": null
};
socket.on('connect', function(data){
  VK.init(function(){
    VK.api('users.get', {fields: "photo_100"}, function(data){
      you.first_name = data.response[0].first_name;
      you.last_name = data.response[0].last_name;
      you.name = data.response[0].first_name+' '+data.response[0].last_name;
      you.id = data.response[0].id;
      you.avatar = data.response[0].photo_100;

      socket.emit('add_user', {key: my_key, info: you});
      $('#vk-name').text(`${you.last_name} ${you.first_name}`);

      socket.emit('sync_stats');

      VK.api('storage.get', {key: "online_users", global: true}, function(response1){
        VK.api('storage.set', {key: "online_users", global: true, value: (response1.response)*1+1}, function(response2){});
      });

      VK.api('storage.get', {key: "tutorial_complited1"}, function(res){
        if(res.response == "1"){
          to_menu('menu');
        } else if(!res.response){
          drawTutorialMap();
          to_menu('tutorial');
          tutorial(0);
        } else {
          alert('Ошибка при загрузке аккаунта!');
        }
      });
    });
  },'5.80');

  // to_menu('menu');
  // socket.emit('add_user', {key: my_key, info: you});
  // $('#vk-name').text(`${you.last_name} ${you.first_name}`);
});
var game = null;

function to_menu(menu){
  $('#game').css('opacity','0');
  $('#menu').css('opacity','0');
  $('#game-search').css('opacity','0');
  $('#tutorial').css('opacity','0');
  $('.wy-tooltip').remove();

  setTimeout(function(){
    $('#game').css('display','none');
    $('#menu').css('display','none');
    $('#game-search').css('display','none');
    $('#tutorial').css('display','none');

    $('#'+menu).css('display','flex');
  }, 500);

  setTimeout(function(){
    $('#'+menu).css('opacity','1');
    if(menu == 'game-search'){
      document.getElementsByClassName('block')[0].style.bottom = '10px'; // C
      document.getElementsByClassName('block')[1].style.bottom = '-60px'; // 1
      document.getElementsByClassName('block')[2].style.bottom = '-60px'; // 2
      document.getElementsByClassName('block')[3].style.bottom = '-60px'; // 3
      document.getElementsByClassName('block')[4].style.bottom = '-60px'; // 4
      document.getElementsByClassName('block')[5].style.bottom = '-60px'; // 5
      document.getElementsByClassName('block')[6].style.bottom = '-60px'; // 6
      document.getElementsByClassName('block')[7].style.bottom = '10px'; // Q
      document.getElementsByClassName('block')[8].style.bottom = '-60px'; // W
      document.getElementsByClassName('block')[9].style.bottom = '-60px'; // E
      document.getElementsByClassName('block')[10].style.bottom = '-60px'; // M
      restartFindGameIntervals();
      setTimeout(function(){
        socket.emit('games_find', {key: my_key, info: you});
      }, 1000);
    } else { stopFindGameIntervals(); }

    if(menu == 'menu'){
      VK.api('storage.get', {key: "all_users", global: true}, function(res){
        $('#all-users').text(`${res.response}`);
      });
    }
  }, 1000);
}

function menu_hover(id){
  var el = document.getElementById('menu-item-'+id);
  el.src = 'assets/img/menu/menu'+id+'_1.png';
}

function menu_unhover(id){
  var el = document.getElementById('menu-item-'+id);
  el.src = 'assets/img/menu/menu'+id+'.png';
}