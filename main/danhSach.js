
const url = window.location.search; 
const urlParams = new URLSearchParams(url);
const param1 = url.match(/\?([^=]*)=/);
const param2 = urlParams.get(param1[1]); 
console.log(`https://phim.nguonc.com/api/films/${param1[1]}/${param2}`);
// console.log("Hành ê".normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-"));

fetch(`https://phim.nguonc.com/api/films/${param1[1]}/${param2}`)
.then(response => response.json())
.then(data =>{
    console.log(data);
    data.items.map((movie)=>{ 
        console.log()
    });
    
    document.querySelector("header").innerHTML=`<h1>${data.cat.title}</h1>`

    let moveList = document.querySelector("#move-list");
    console.log(moveList);
    
    let arr = data.items.map((movie)=>{
        return ` <div class="movie-card" data-genre="drama">
            <img src="${movie.poster_url}" alt="Movie 1">
            <div class="movie-info">
                <span class="rating">PD: 4</span>
                <span class="episodes">TM: 4</span>
            </div>
            <h3>${movie.name}</h3>
            <p>${movie.director}</p>
        </div>  `
        
    })
    let s = "";
    for (let i = 0 ; i<arr.length;i++){
        s+= arr[i];
    }
    moveList.innerHTML = s;
})
  .catch(error => console.error("Lỗi:", error));