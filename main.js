import './style.css'
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

const API_URL = "https://fhu-faculty-api.netlify.app/faculty.v2.json";


//const data = ["zero","one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen"];
const carousel = document.getElementsByClassName("carousel")[0];
// var activeIndex = Math.floor(data.length/2);

let people = [];
var activeIndex;

const classForFieldOfStudy = {
  "Computer Science": "cs",
  "Engineering": "eng",
  "Mathematics": "math",
  "Cybersecurity": "cyb"

}

window.addEventListener('load', async ()=>{
  initializeIndex();
  await addCards();
  updateCards();
});


function initializeIndex() {
  const searchParams = new URLSearchParams(window.location.search);
  activeIndex = parseInt(searchParams.get('card'))
  
  if (!activeIndex || activeIndex > people.length) {
    activeIndex = 0;
    updateUrlParameter();
  }
}

function generateCardHTML(person)
{
  
  return `
  <div class="card ${classForFieldOfStudy[person.FieldofStudy.trim()]}">
        <div class="header">
            <div class="">
                <p class="title"> ${person.Rank}</p>
                <p class="name">${person.FirstName} ${person.LastName} </p>
            </div>
            <div class=""> 
                <p class="credentials">
                    <span>${person.EducationLevel}</span>, ${person.FieldofStudy}
                </p>
                <p class="hp"> ${person.HitPoints} HP</p>
            </div>
        </div>

        <div class="profile-image">
            <img src="/headshots/${person.Image} " alt="${person.FirstName} ${person.LastName}">

            <p class="image-text">
                Damage Type: ${person.DamageType} • Height: ${person.Height} 
            </p>
        </div>

        <div class="attacks">
            <div class="attack">
                <p class="description"> <span class="attack-name">${person.Attack1}</span> ${person.Attack1Description}</p>
                <p class="damage">${person.Attack1Damage}</p>
            </div>

            <div class="attack">
                <p class="description"> <span class="attack-name">${person.Attack2}</span> ${person.Attack2Description}</p>
                <p class="damage">${person.Attack2Damage}</p>
            </div>

        </div>

        <div class="row">

                <div class="weaknesses">
                    <h2>weaknesses</h2>
                    <p>${person.Weaknesses}</p>
                </div>

                <div class="resistances">
                    <h2>resistances</h2>
                    <p>${person.Resistances}</p>
                </div>

                <div class="cost">
                    <h2>cost</h2>
                    <p> ${person.Cost} <img src="lion.svg" alt=""></p>
                </div>

        </div>

        <div class="bottom-description">
            <p>Nickname: ${person.NickName} &nbsp; Stamina: ${person.Stamina}</p>
            <!--<p class="">#dobetter</p>-->
            
            <!-- <p>
                Jared "Mathmortician" Collins, is an Infernal type known for the hashtag <b>#dobetter</b>. High Stamina LV. 47 
            </p> -->

        </div>

        <footer>  
            <div class="row">
                <p >&copy; 2023</p>
                <p>${person.HashTag}</p>
                <p><b>${person.id}/${people.length} </b> α.0</p>
            </div>                     
        </footer>
        <!--<a href="#" class="downloadbutton"> <i class="fa fa-download" aria-hidden="true"></i> </a>-->

    </div>
    
  `

}

async function addCards() {
  
  let response = await fetch(API_URL);
  people = await response.json();  

  people.forEach( (item, index) => {
      let div = document.createElement('div');
      div.classList.add("card-container");
  
      div.innerHTML = generateCardHTML(item);

      // div.innerHTML = `
      // <div class="card">
      //   ${index} ${item} 
      //   <a href="#" class="downloadbutton"> <i class="fa fa-download" aria-hidden="true"></i> </a>
      // </div>`;

      carousel.appendChild(div);
  });

  const downloadButtons = document.getElementsByClassName("downloadbutton");

  Array.from(downloadButtons).forEach( button => {
    
    button.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(button);
      console.log(button.parentNode)

      button.parentNode.style.transition = "all 0s"
      button.parentNode.style.transform = 'scale(100%)'

      toPng( button.parentNode )
      .then(function (dataUrl) { 
        button.parentNode.style.transform = 'scale(120%)'
        button.parentNode.style.transition = "all 1s ease-in-out"

        download(dataUrl, 'card.png');
      });
  
    })
  })

}

function updateCards() {
  const length = people.length;

  const cards = document.querySelectorAll(".carousel .card");
  
  cards.forEach( (div, index) => {
      if( index < activeIndex){
          // left
          div.classList.remove("active");
          div.style.zIndex = index;
          const offset = 100+(length-index)*2;
          div.style.transform = `translateX(-${offset}%) scale(100%)`;
      }
      else if(index === activeIndex)
      {
          // middle
          div.classList.add("active");
          div.style.zIndex = 300;
          div.style.transform = `translateX(0) scale(120%)`;
      }
      else {
          //right 
          div.classList.remove("active");
          div.style.zIndex = (length - index);
          const offset = 100+(index)*2;
          div.style.transform = `translateX(${offset}%) scale(100%)`;
      }
  });
}

window.addEventListener("resize", updateCards);


document.getElementById("prevButton").addEventListener("click", (e)=>{
  e.preventDefault();

  if( activeIndex >= 0)
  {
      activeIndex--;
      updateCards();
      updateUrlParameter();
    }
  
});

document.getElementById("nextButton").addEventListener("click", (e)=>{
  e.preventDefault();

  if( activeIndex < people.length)
  {
      activeIndex++;
      updateCards();
      updateUrlParameter();
  }
  
});

function updateUrlParameter() {
  const url = new URL(window.location.href);
  url.searchParams.set("card", activeIndex);
  window.history.replaceState({}, document.title, url.toString());
}

