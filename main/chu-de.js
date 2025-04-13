// bạn quan tâm gì category
const category = document.querySelector(".category-grid");
const arrColor = ["marvel","fantasy","sitcom","action","scifi","mature"];
const arrCate = ["Hành Động", "Phiêu Lưu", "Hoạt Hình",  "Hình Sự", "Tài Liệu", "Chính Kịch", "Gia Đình", "Giả Tưởng", "Lịch Sử", "Kinh Dị", "Nhạc", "Bí Ẩn", "Lãng Mạn", "Khoa Học Viễn Tưởng", "Gây Cấn", "Chiến Tranh", "Tâm Lý", "Tình Cảm", "Cổ Trang", "Miền Tây", "Phim 18+"];
const cates = ["hanh-dong", "phieu-luu", "hoat-hinh", "hinh-su", "tai-lieu", "chinh-kich", "gia-dinh", "gia-tuong", "lich-su", "kinh-di", "nhac", "bi-an", "lang-man", "khoa-hoc-vien-tuong", "gay-can", "chien-tranh", "tam-ly", "tinh-cam", "co-trang", "mien-tay", "phim-18"];
let str = "";
// console.log(window.location.pathname);
let length =arrCate.length;
if (window.location.pathname!=="/pages/chu-de.html") {
    length -= 15; 
}
// console.log(length);
for (let i = 0; i < length; i++) {
    let j=i;
    if (j>5){
        j=Math.floor(Math.random() * 5);
        // console.log(cates[i]," - ",arrColor[j]);
    }
    str += `<a href="/pages/danh-sach.html?the-loai=${cates[i]}" class="category-card ${arrColor[j]}">
                    <h3>${arrCate[i]}</h3>
                    <span class="view-more">Xem chủ đề <i class="fas fa-angle-right"></i></span>
                </a>`

}
if (length<7){
    str += `<a href="/pages/chu-de.html" class="category-card more">
    <h3>chủ đề khác</h3>
    </a>`;
    }
category.innerHTML=str;