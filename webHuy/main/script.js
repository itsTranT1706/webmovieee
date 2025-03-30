

function removeVietnameseTones(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
              .replace(/đ/g, "d").replace(/Đ/g, "D") // Chuyển đ -> d, Đ -> D
              .toLowerCase() // Chuyển thành chữ thường
              .replace(/\s+/g, '-') // Thay khoảng trắng bằng "-"
              .replace(/[^a-z0-9-]/g, '') // Loại bỏ ký tự đặc biệt (chỉ giữ a-z, 0-9, "-")
              .replace(/-+/g, '-') // Xóa dấu "-" dư thừa
              .trim(); // Xóa khoảng trắng đầu/cuối
}

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const overlayBg = document.getElementById('overlayBg');

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    overlayBg.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Event Listeners
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
overlayBg.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        e.target !== mobileMenuBtn) {
        toggleMobileMenu();
    }
});


//banner
const banner = document.querySelector("#banner");
fetch(`https://phim.nguonc.com/api/films/the-loai/kinh-di`)
    .then(response => response.json())
    .then(data => {
        console.log(`https://phim.nguonc.com/api/film/${data.items[0].slug}`);
        let img = data.items[0].poster_url;
        const thumb = document.querySelector(".thumbnails");
        let str = "";
        banner.style.background = `url(${img}) no-repeat center center/cover `;
        for (let i = 0; i < 7; i++) {
            let temp = "";
            if (i == 0) {
                temp = " active";
            }
            str += `<div class="thumbnail${temp}" id = "${data.items[i].slug}">
                        <img src="${data.items[i].poster_url}">
                    </div>`;
        }
        fetch(`https://phim.nguonc.com/api/film/${data.items[0].slug}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector(".hero-title").innerHTML = `<h1>${data.movie.name}</h1>`;
                document.querySelector(".rating").textContent = data.movie.quality;
                document.querySelector(".age-rating").textContent = data.movie.language;
                document.querySelector(".year").textContent = data.movie.created.split("-")[0];
                document.querySelector(".season").textContent = data.movie.current_episode;
                document.querySelector(".episode").textContent = data.movie.time;
                const genreTag = document.querySelector(".genre-tags");
                let str = "";
                for (let i=0;i<data.movie.category["2"]["list"].length;i++){
                    console.log(data.movie.category["2"]["list"][i]);
                    let cate = data.movie.category["2"]["list"][i]["name"];
                        str += `<a href="/webHuy/pages/danh-sach.html?the-loai=${removeVietnameseTones(cate)}" class="tag">${cate}</a>`;

                }
                genreTag.innerHTML=str;
                document.querySelector(".hero-description").innerHTML = `<p>${data.movie.description}</p>`;
            })
            .catch(error => console.error("Lỗi:", error));


        thumb.innerHTML = str;

        // Thumbnail Selection
        const thumbnails = document.querySelectorAll('.thumbnail');
        // console.log(thumbnails);
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                thumb.classList.add('active');
                let img = thumb.querySelector("img").src;

                console.log(thumb.id)
                document.querySelector("#banner").style.background = `url(${img}) no-repeat center center/cover `;

                fetch(`https://phim.nguonc.com/api/film/${thumb.id}`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector(".hero-title").innerHTML = `<h1>${data.movie.name}</h1>`;
                    document.querySelector(".rating").textContent = data.movie.quality;
                    document.querySelector(".age-rating").textContent = data.movie.language;
                    document.querySelector(".year").textContent = data.movie.created.split("-")[0];
                    document.querySelector(".season").textContent = data.movie.current_episode;
                    document.querySelector(".episode").textContent = data.movie.time;
                    const genreTag = document.querySelector(".genre-tags");
                    let str = "";
                    for (let i=0;i<data.movie.category["2"]["list"].length;i++){
                        console.log(data.movie.category["2"]["list"][i]);
                        let cate = data.movie.category["2"]["list"][i]["name"];
                            str += `<a href="/webHuy/pages/danh-sach.html?the-loai=${removeVietnameseTones(cate)}" class="tag">${cate}</a>`;
    
                    }
                    genreTag.innerHTML=str;
                    document.querySelector(".hero-description").innerHTML = `<p>${data.movie.description}</p>`;
                })
                .catch(error => console.error("Lỗi:", error));

                // Here you would typically update the hero background
                // For a full implementation, this would change the hero image
                // const imgSrc = thumb.querySelector('img').src;
                // document.querySelector('.hero-section').style.backgroundImage = `linear-gradient(to right, rgba(14, 17, 23, 0.9), rgba(14, 17, 23, 0.8), transparent), url('${imgSrc}')`;
            });
        });




    })
    .catch(error => console.error("Lỗi:", error));






// Carousel Navigation
// const carousel = document.querySelector('.carousel');
// const nextButton = document.querySelector('.carousel-arrow.next');

// nextButton.addEventListener('click', () => {
//     carousel.scrollBy({
//         left: 400,
//         behavior: 'smooth'
//     });
// });







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