
 

function getMovies() {
    
    hideMap();
    hideHideButton();
    if (!isSelectHidden()) toggleTheatreSelectVisibility();

  var raaka = document.getElementById("pvm").value;
  
  var aika = raaka.slice(8, 10) + "." + raaka.slice(5, 7) + "." + raaka.slice(0, 4);
  var numero = raaka.slice(8, 10);
  var teatteri = document.getElementById("teatteri").value;

  var date = new Date();

var day = date.getDate();
var month = date.getMonth()+1;
var year = date.getFullYear();

var paiva = raaka.slice(8, 10) - day;
var kuukausi = raaka.slice(5, 7) - month;
var vuosi = raaka.slice(0, 4) - year;

if(vuosi>=1|| kuukausi>=1&&vuosi>=0 ||vuosi===0&&paiva>=0&&kuukausi===0){

  if(teatteri > 1000 && +numero >= 1){

    
    var url = "https://www.finnkino.fi/xml/Schedule/?area=" + teatteri + "&dt=" + aika;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.send()
  
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var xmlDoc = xmlhttp.responseXML;
  
      show = xmlDoc.getElementsByTagName("Show");
      pic = xmlDoc.getElementsByTagName("EventLargeImageLandscape");
      title = xmlDoc.getElementsByTagName("Title");
      theatre = xmlDoc.getElementsByTagName("TheatreAndAuditorium");
      showstart = xmlDoc.getElementsByTagName("dttmShowStart");
      showend = xmlDoc.getElementsByTagName("dttmShowEnd");
      riu = xmlDoc.getElementsByTagName("RatingImageUrl");
      esitysLinkit = xmlDoc.getElementsByTagName("ShowURL");
      tietoLinkit = xmlDoc.getElementsByTagName("EventURL");
      icon = xmlDoc.getElementsByTagName("ImageURL");
     
      if(show.length<=0){
       
        document.getElementById("ilmoitus").setAttribute('class','notfound');
        document.getElementById("ilmoitus").innerHTML = 'Valitettavasti ei tälle päivälle löydy leffaa';
        document.getElementById("leffa").innerHTML = ' ';
      }
      else{
        getUserLocation();
        var out = '';
        for (i = 0; i < show.length; i++) {
          var luku = i + 1;
          var aika = showstart[i].innerHTML.slice(11, 16);
          var loppu = showend[i].innerHTML.slice(11, 16);
          out += '<div class="one-film">';
          out += '<i class="fa fa-play-circle" aria-hidden="true"></i>';
          out += '<img class="picture" src="'+ pic[i].childNodes[0].nodeValue + '" alt="Elokuvan kuva">';
          out += '<h2>' + title[i].childNodes[0].nodeValue + '</h2>';
          out += '<p>' + theatre[i].childNodes[0].nodeValue + '</p>';
          out += '<p>' + aika + ' - ' + loppu + '</p>';
          out += '<div class="nappi">';
          out += '<button class="green buttonactive"><a target="_blank" href="' + esitysLinkit[i].innerHTML + '">Osta lippu</a></button>';
          out += '<button class="blue"><a target="_blank" href="' + tietoLinkit[i].innerHTML + '">Elokuvan tiedot</a></button>';
          out += '</div>';
          out += '<div class="film-icon">';
          out += '<img class="age" src="'+riu[i].childNodes[0].nodeValue+'" alt="">';
          out += '<img class="age" src="'+icon[i].childNodes[0].nodeValue+'" alt="">';
          out += '</div>';
          if(luku%2==0){
            out += '<div class="line2"></div>';
          }
          else{
            out += '<div class="line"></div>';
          }
         
          out += '</div>';
        };
         
        document.getElementById("leffa").innerHTML = out;
        document.getElementById("ilmoitus").setAttribute('class','null');
        document.getElementById("ilmoitus").innerHTML = '';


	  initMap(teatteri);
      }
        
      
  
  
    }
  }

  }


  else{
    alert('Valitse teatteri');
    document.getElementById("leffa").innerHTML = ' ';
  }

}

else{
  alert('Päivämäärä eivät oikein');
  document.getElementById("leffa").innerHTML = ' ';
}
  
};
