
//chuyển tiếng việt sang không dấu
function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
              .replace(/đ/g, "d").replace(/Đ/g, "D") // Chuyển đ -> d, Đ -> D
              .toLowerCase() // Chuyển thành chữ thường
              .replace(/\s+/g, '-') // Thay khoảng trắng bằng "-"
              .replace(/[^a-z0-9-]/g, '') // Loại bỏ ký tự đặc biệt (chỉ giữ a-z, 0-9, "-")
              .replace(/-+/g, '-') // Xóa dấu "-" dư thừa
              .trim(); // Xóa khoảng trắng đầu/cuối
}


//banner
const banner = document.querySelector(".hero");
fetch(`https://phim.nguonc.com/api/films/the-loai/hanh-dong?page=2`)
    .then(response => response.json())
    .then(data => {
        console.log(`https://phim.nguonc.com/api/film/${data.items[0].slug}`);
        let img = data.items[0].poster_url;
        const thumb = document.querySelector(".thumbnails");
        let str = "";
        banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${img}) center/cover`;
        for (let i = 0; i < 7; i++) {
            let temp = "";
            if (i == 0) {
                temp = " active";
            }
            str += `<img class="thumbnail${temp}" id = "${data.items[i].slug}" src="${data.items[i].poster_url}"  ></img>`;
                    
        }
        fetch(`https://phim.nguonc.com/api/film/${data.items[0].slug}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector(".movie-title-hero").innerHTML = data.movie.name;
                document.querySelector(".imdb-rating").textContent = data.movie.quality;
                document.querySelector(".language").textContent = data.movie.language;
                document.querySelector(".created").textContent = data.movie.created.split("-")[0];
                document.querySelector(".current_episode").textContent = data.movie.current_episode;
                document.querySelector(".time").textContent = data.movie.time;
                const genreTag = document.querySelector(".categories");
                let str = "";
                for (let i=0;i<data.movie.category["2"]["list"].length;i++){
                    console.log(data.movie.category["2"]["list"][i]);
                    let cate = data.movie.category["2"]["list"][i]["name"];
                        str += `<a href="/pages/danh-sach.html?the-loai=${removeVietnameseTones(cate)}" class="category">${cate}</a>`;

                }
                genreTag.innerHTML=str;
                document.querySelector(".hero-description").innerHTML = `<p>${data.movie.description}</p>`;
            })
            .catch(error => console.error("Lỗi:", error));


        thumb.innerHTML = str;

        // Thumbnail Selection
        const thumbnails = document.querySelectorAll('.thumbnail');
        console.log("hi",thumbnails);
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
              // console.log(thumb.src);
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                thumb.classList.add('active');
                let img = thumb.src;

                document.querySelector(".hero").style.background = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${img}) center/cover`;

                fetch(`https://phim.nguonc.com/api/film/${thumb.id}`)
                .then(response => response.json())
                .then(data => {
                  document.querySelector(".movie-title-hero").innerHTML = data.movie.name;
                  document.querySelector(".imdb-rating").textContent = data.movie.quality;
                  document.querySelector(".language").textContent = data.movie.language;
                  document.querySelector(".created").textContent = data.movie.created.split("-")[0];
                  document.querySelector(".current_episode").textContent = data.movie.current_episode;
                  document.querySelector(".time").textContent = data.movie.time;
                  const genreTag = document.querySelector(".categories");
                  let str = "";
                    for (let i=0;i<data.movie.category["2"]["list"].length;i++){
                        console.log(data.movie.category["2"]["list"][i]);
                        let cate = data.movie.category["2"]["list"][i]["name"];
                            str += `<a href="/pages/danh-sach.html?the-loai=${removeVietnameseTones(cate)}" class="category">${cate}</a>`;
    
                    }
                    genreTag.innerHTML=str;
                    document.querySelector(".hero-description").innerHTML = `<p>${data.movie.description}</p>`;
                })
                .catch(error => console.error("Lỗi:", error));

            });
        });




    })
    .catch(error => console.error("Lỗi:", error));




let currentIndex = 0;
function nextSlide() {
    const list = document.querySelector(".movie-list");
    if (currentIndex < list.children.length - 2) {
        currentIndex++;
        list.style.transform = `translateX(-${currentIndex * 220}px)`;
    }
}
function prevSlide() {
    const list = document.querySelector(".movie-list");
    if (currentIndex > 0) {
        currentIndex--;
        list.style.transform = `translateX(-${currentIndex * 220}px)`;
    }
}






//example
const infor = document.querySelector(".info-btn");
infor.addEventListener("click", ()=>{
    window.location = "/pages/chi-tiet.html";
})

//demo watch
const play = document.querySelector(".play-btn");
play.addEventListener("click", ()=>{
    window.location = "/pages/watch.html";
})