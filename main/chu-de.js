// bạn quan tâm gì category
const category = document.querySelector(".category-grid");
const arrColor = ["marvel", "fantasy", "sitcom", "action", "scifi", "mature"];
const arrCate = ["Hành Động","Cổ Trang","Chiến Tranh","Viễn Tưởng","Kinh Dị","Tài Liệu","Bí Ẩn","Phim 18+","Tình Cảm","Tâm Lý","Thể Thao","Phiêu Lưu","Âm Nhạc","Gia Đình","Học Đường","Hài Hước","Hình Sự","Võ Thuật","Khoa Học","Thần Thoại","Chính Kịch","Kinh Điển"];
const cates = [
    "hanh-dong",
    "co-trang",
    "chien-tranh",
    "vien-tuong",
    "kinh-di",
    "tai-lieu",
    "bi-an",
    "phim-18+",
    "tinh-cam",
    "tam-ly",
    "the-thao",
    "phieu-luu",
    "am-nhac",
    "gia-dinh",
    "hoc-duong",
    "hai-huoc",
    "hinh-su",
    "vo-thuat",
    "khoa-hoc",
    "than-thoai",
    "chinh-kich",
    "kinh-dien"
  ];
let str = "";
// console.log(window.location.pathname);
let length = arrCate.length;
if (!window.location.pathname.includes("/pages/chu-de.html")>0) {
    length -= 16;
}
// console.log(length);
for (let i = 0; i < length; i++) {
    let j = i;
    if (j > 5) {
        j = Math.floor(Math.random() * 5);
        // console.log(cates[i]," - ",arrColor[j]);
    }
    str += `<a href="/pages/danh-sach.html?the-loai=${cates[i]}" class="category-card ${arrColor[j]}">
                    <h3>${arrCate[i]}</h3>
                    <span class="view-more">Xem chủ đề <i class="fas fa-angle-right"></i></span>
                </a>`

}
if (length < 7) {
    str += `<a href="/pages/chu-de.html" class="category-card more" id="more">
    <h3>+chủ đề</h3>
    </a>`;
}
category.innerHTML = str;