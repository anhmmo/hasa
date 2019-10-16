
const painanappi = document.querySelector('.hakunappi');
const input = document.getElementById('hakusyotto');
const showContainer = document.getElementById('container');
const showSearchAPI = 'https://www.food2fork.com/api/search?key=d6bcd1743655615858fc8e459e0caea1&q='



painanappi.addEventListener('click', function(film) {
    film.preventDefault();
    let search = input.value.split(' ').join('+');
    var query = '';
    query = showSearchAPI+search;


    ajax(query);
});




function ajax(url) {
    fetch(url).then(function(vastaus) {
        return vastaus.json();
    }).then(function(json) {
        sendQuery(json);
    }).catch(function(error) {
        console.log(error);
    });

    function sendQuery(query) {
        showContainer.innerHTML="";
input.value = "";
        console.log(query);

        

        var out = '';
       for (let i = 0; i < query.recipes.length; i++) {
        var randomnumero = Math.floor((Math.random() * 6) + 1);
        out+='<div class="frame1">';
        out+='<div class="imgcontent green">';
        out+='<div class="picshadow"></div>';
        out+='<img class="img1" src="'+query.recipes[i].image_url+'" alt=""><i class="fa fa-gratipay" aria-hidden="true"></i></div>';

        out+='<div class="textcontent"><h2>'+query.recipes[i].title+'</h2><div class="stars"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></div>';

        out+= '<p>Consider now provided laughter boy landlord dashwood. Often voice and the spoke. No shewing fertile village equally prepare up females.</p><div class="line">...................................................................................................</div><div class="cooker"><div class="zone1">';

        switch(randomnumero){
            case 1:
                    out+='<img src="img/chef4.svg" alt=""></div>';
                break;
                case 2:
                    out+='<img src="img/chef3.svg" alt=""></div>';
                break;
                case 3:
                    out+='<img src="img/chef2.svg" alt=""></div>';
                break;
                default:
                    out+='<img src="img/chef.svg" alt=""></div>';
                break;
        }

     

        out+='<div class="zone2"><h5>'+query.recipes[i].publisher+'</h5><i class="fa fa-cutlery" aria-hidden="true"></i><i class="fa fa-check-square-o" aria-hidden="true"></i></div><div class="ranking">';

        switch(randomnumero){
            case 1:
                    out+='<img src="img/rank.svg" alt=""></div></div>';
                break;
                case 2:
                    out+='<img src="img/heart.svg" alt=""></div></div>';
                break;
                case 3:
                    out+='<img src="img/badge.svg" alt=""></div></div>';
                break;
                case 4:
                    out+='<img src="img/breakfast.svg" alt=""></div></div>';
                break;
                default:
                    out+='<img src="img/rankit.svg" alt=""></div></div>';
                break;
        }

        out+='<a class="btna" target="_blank" href="'+query.recipes[i].publisher_url+'"><button class="buttonbtn">Kotisivu</button></a><a class="btna" target="_blank" href="'+query.recipes[i].source_url+'"><button class="buttonbtn">Resepti</button></a></div></div>';  
       }

      
       showContainer.innerHTML= out;

       
    }

}


