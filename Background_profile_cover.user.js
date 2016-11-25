// ==UserScript==
// @name        forum.crossout - Background profile cover
// @namespace   crossout
// @description Добавляет картинку на фон профиля
// @author      SnegoPad815
// @homepage    https://greasyfork.org/ru/scripts/24127
// @include     http://forum.crossout.ru/*
// @include     https://forum.crossout.ru/*
// @include     http://*.forum.crossout.ru/*
// @include     https://*.forum.crossout.ru/*
// @include     http://forum.crossout.net/*
// @include     https://forum.crossout.net/*
// @include     http://*.forum.crossout.net/*
// @include     https://*.forum.crossout.net/*
// @version     0.2.1
// @grant       none
// ==/UserScript==


var avatarsDatabaseURL = 'https://rawgit.com/SnegoPad815/crossout-forum-userscript-and-restyle/master/coverDB.user.js';
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = avatarsDatabaseURL;
$(document.head).append(script);

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main () {

  var allPhotos = document.getElementsByClassName("ipsUserPhoto");
  addListenerTo(allPhotos);

  var k=0;
  var profileLinks = [];
  var allLinks = document.getElementsByClassName("ipsType_break");
  for(var i = 0; i < allLinks.length; i++){
    if (allLinks[i].nodeName=="A"){
      profileLinks[k++]=allLinks[i];
    }
  }

  addListenerTo(profileLinks);
  checkCover();
}

function addListenerTo(target){
  for(var i = 0; i < target.length; i++){
    target[i].addEventListener("mouseenter", function( event ) {
      setTimeout(function() {
        var hc = document.getElementsByClassName("ipsHovercard");
        var ProfileHead = hc[hc.length-1].getElementsByClassName('ipsPageHead_special');

        /*если фон есть, то не менять. + защита от нескольих установок*/
        if (ProfileHead[0].getElementsByClassName("ipsCoverPhoto_container").length===0){

          /*извлечение ID из ссылки на профиль*/
          var ProfileID = ProfileHead[0].dataset.url.match(/\d+/)[0];

          addProfileCover(ProfileHead[0], ProfileID);
          }

      }, 1500);
    }, false);
  }
}


function checkCover(){
  /*если в профиле*/
  if (window.location.search.substr(2,7)=="profile") {
      var ProfileHead = document.getElementById('elProfileHeader');
    /*и если нет фона*/
      if (ProfileHead.getElementsByClassName('ipsCoverPhoto_photo').length === 0) {
        /*извлечение ID из адресной строки*/
        var ProfileID = window.location.search.match(/\d+/)[0];
        addProfileCover(ProfileHead,ProfileID);
        /*выравнивание фона при изменении размера окна*/
        $(window).on('resize', posIMG);
      }
    }
}


function addProfileCover(ProfileHead, ProfileID) {

  /*поиск фона для этого ID*/
  for(var i = 0; i < covers.length; i++) {
    /*если есть совпадение добавляем фон*/
    if (ProfileID==covers[i].id)
    {
      var new_div = document.createElement('div');
      new_div.className = 'ipsCoverPhoto_container';

      ProfileHead.dataset.coveroffset = covers[i].top;

      var url = covers[i].url;
      var ht = '<img style="opacity: 1; position: absolute; left: 0px; top: 0px;" src="'+url+'" class="ipsCoverPhoto_photo" alt="">';
      new_div.innerHTML = ht;
      ProfileHead.insertBefore(new_div, ProfileHead.firstChild);

      var offset = getOffsset(covers[i].top);
      ProfileHead.getElementsByClassName("ipsCoverPhoto_photo")[0].style.top = '-'+offset+'px';
    }
  }
}

function posIMG()
{
/*абсолютное значение смещения*/
	var offset = document.getElementsByClassName('ipsPageHead_special')[0].dataset.coveroffset;
	document.getElementsByClassName('ipsCoverPhoto_photo')[0].style.top = '-'+getOffsset(offset)+'px';
}

/*смещение для уменьшеной картинки (относительно масштаба)*/
function getOffsset(param)
{
	var natHeight = ips.utils.position.naturalHeight($(".ipsCoverPhoto_photo").last());
	var realHeight = $(".ipsCoverPhoto_photo").last().outerHeight();
	return Math.floor(param*realHeight/natHeight);
}
