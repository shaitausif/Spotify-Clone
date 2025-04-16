
console.log("Let's start to write Javascript..");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(
    `http://127.0.0.1:3000/Project%202%20-%20SPOTIFY%20CLONE/${folder}`
  );
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  

  let songUL = document
  .querySelector(".songList")
  .getElementsByTagName("ul")[0];

  songUL.innerHTML = ""
for (const song of songs) {
  songUL.innerHTML =
    songUL.innerHTML +
    
  `<li>
              <img class="invert" src="img/music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Tausif Shaikh</div>
              </div>
              <div class="playNow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
              </div>  </li>`;
}

//   Attach an event listener to each song

Array.from(
  document.querySelector(".songList").getElementsByTagName("li")
).forEach( e => {
  e.addEventListener("click", () => {
   
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
  });
});



return songs;


}

const playMusic = (track, pause = false) => {
  currentSong.src = `/Project 2 - SPOTIFY CLONE/${currFolder}/` + track;
  if(!pause){
     currentSong.play();
  play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


// Displays all the albums on the page
async function displayAlbums(){

  let a = await fetch(
    `http://127.0.0.1:3000/Project%202%20-%20SPOTIFY%20CLONE/Songs`
  );
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if(e.href.includes("/Songs") ){
      let folder = e.href.split("/").slice("-2")[0]
      console.log(folder)
      // Get the metadata of the folder
      let a = await fetch(
        `Songs/${folder}/info.json`
      );
      let response = await a.json();
      
      cardContainer.innerHTML = cardContainer.innerHTML + `   <div data-folder = "${folder}" class="card rounded">
              <div class="play">
               <img src="img/cardplay.svg" alt="">
              </div>
              <img class="rounded" src="Songs/${folder}/cover.jpg" alt="" />
              <h3>${response.title}</h3>
              <p>${response.description}</p>
            </div>`
    }
  }

     // Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e =>{
      
      e.addEventListener("click",async item=>{
        
        songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
        playMusic(songs[0])
        
      })
    })



  
}



async function main() {
  // get the links of the songs
  await getSongs("Songs/ncs");
  playMusic(songs[0],true)
  // Show all the songs in the playlist


  // Display all the albums on the page
  displayAlbums();

    // Attach an event listener to play,next and previous.
    play.addEventListener("click", () => {
      if (currentSong.paused) {
        currentSong.play();
        play.src = "img/pause.svg";
      } else {
        currentSong.pause();
        play.src = "img/play.svg";
      }
    
  });

  // Listen for update event
  currentSong.addEventListener("timeupdate", () => {
    
    document.querySelector(".songtime").innerHTML = `${(secondsToMinutesSeconds(currentSong.currentTime))} / ${(secondsToMinutesSeconds(currentSong.duration))}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 99 + "%";
})

    // Add an event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click",  e=>{
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left =  percent + "%";
      currentSong.currentTime = ((currentSong.duration)* percent) / 100;

    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=> {
      document.querySelector(".left").style.left = "0"
      document.querySelector(".library").style.height = "75vh"
      document.querySelector(".songList").style.height = "500px"
    })
  
    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=> {
      document.querySelector(".left").style.left = "-110%"
    })

    // Add an event listener for previous
    previous.addEventListener("click", ()=> { 

      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if((index - 1) >= 0){
        playMusic(songs[index - 1]);
      }
      else{
        playMusic(songs[0])
      }
    })

    // Add an event listener for next
    next.addEventListener("click", ()=> { 

      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if((index + 1) < songs.length){
        playMusic(songs[index + 1]);
      }
      else{
        playMusic(songs[0])
      }

      
    })

    // Add an event listener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=> {
      currentSong.volume = parseInt(e.target.value)/100;

      if(e.target.value == 0){
        let mute = document.querySelector(".volimg")
        mute.src = "img/mute.svg";
      }
      else if(e.target.value > 0){
        var volume = document.querySelector(".volimg")
        volume.src = "img/volume.svg"
      }

    })


    // Add an event listener to mute the volume
    document.querySelector(".volume>img").addEventListener("click",e=>{
      console.log(e.target.src)
      if(e.target.src.includes("img/volume.svg")){
        e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else{
        
        e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
        currentSong.volume = 1;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 100
      }
    
    })

    
    
    

  

}

main();