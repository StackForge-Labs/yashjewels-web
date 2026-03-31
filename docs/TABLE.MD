## Tổng quan hệ thống bảng

Toàn bộ 17 bảng này phục vụ cho một **hệ thống mua sắm trang sức online**. Tôi sẽ nhóm theo chức năng để dễ hiểu hơn.

---

## Nhóm 1 - Xác thực & Người dùng

**`AdminLoginMst`** - Lưu tài khoản đăng nhập của **quản trị viên** (admin). Chỉ có username + password, không cần gì thêm vì admin chỉ cần vào để quản lý hệ thống.

**`UserRegMst`** - Lưu thông tin **khách hàng** đăng ký tài khoản: họ tên, địa chỉ, SĐT, email, ngày sinh, mật khẩu. Đây là bảng profile của người mua hàng.

---

## Nhóm 2 - Danh mục & Phân loại sản phẩm

Đây là nhóm các bảng **"danh mục tra cứu"** - tức là lưu các giá trị cố định để sản phẩm tham chiếu vào.

**`CatMst`** - Danh mục sản phẩm. Ví dụ: Nhẫn, Vòng cổ, Bông tai, Lắc tay...

**`ProdMst`** - Loại sản phẩm. Tương tự CatMst nhưng phân loại theo kiểu khác. Ví dụ: Trang sức cưới, Trang sức thường ngày...

**`BrandMst`** - Danh sách **thương hiệu**. Ví dụ: Asmi, D'damas...

**`JewelTypeMst`** - Loại trang sức theo chất liệu hoặc phong cách. Ví dụ: Trang sức vàng, trang sức bạch kim...

**`GoldKrtMst`** - Các loại **carat vàng** có bán. Ví dụ: 18K, 22K, 24K...

**`CertifyMst`** - Các loại **chứng nhận chất lượng**. Ví dụ: 916, 918, 920... (đây là tiêu chuẩn chứng nhận vàng ở Ấn Độ)

---

## Nhóm 3 - Thông tin Kim cương & Đá quý

**`DimQltyMst`** - Danh sách **cấp độ chất lượng kim cương**. Ví dụ: VVS (Very Very Slightly Included), FD (Flawless Diamond)...

**`DimQltySubMst`** - Phân loại **chi tiết hơn** của chất lượng kim cương. Bảng này bổ sung thêm tầng phân cấp phụ bên dưới `DimQltyMst`.

**`DimInfoMst`** - Bảng **thông tin chi tiết từng loại kim cương** dùng để hiển thị lên website cho khách xem. Có ảnh, giá, loại, carat - giống như trang "Tìm hiểu về kim cương" trên web.

**`StoneQltyMst`** - Danh sách **loại đá quý**. Ví dụ: Ruby, Emerald, Meena...

---

## Nhóm 4 - Sản phẩm (core)

**`ItemMst`** - Đây là bảng **quan trọng nhất** của toàn hệ thống. Mỗi record là một **sản phẩm trang sức cụ thể**, lưu đầy đủ:

- Thuộc thương hiệu nào, danh mục nào, chứng nhận nào
- Trọng lượng vàng, trọng lượng đá
- Phí gia công vàng, phí gia công đá, phí khác
- Giá niêm yết cuối cùng (MRP)

**`DimMst`** - Lưu thông tin **kim cương được gắn trong từng sản phẩm cụ thể**. Một sản phẩm có thể gắn nhiều viên kim cương với carat, kích thước, giá khác nhau.

**`StoneMst`** - Tương tự `DimMst` nhưng cho **đá quý** (không phải kim cương). Lưu số viên, trọng lượng, giá từng viên đá trong sản phẩm.

---

## Nhóm 5 - Giao dịch & Tương tác

**`CartList`** - Bảng **giỏ hàng**. Lưu tạm sản phẩm mà khách đang chọn trước khi thanh toán.

**`Inquiry`** - Bảng **liên hệ / hỏi đáp**. Khi khách hàng gửi câu hỏi hoặc yêu cầu tư vấn qua form trên web, dữ liệu sẽ vào đây.

---

## Sơ đồ quan hệ tổng quát

```
UserRegMst ──────────────────── CartList
                                    │
AdminLoginMst                    ItemMst ◄──── BrandMst
                                    │      ◄──── CatMst
                                    │      ◄──── CertifyMst
                                    │      ◄──── ProdMst
                                    │      ◄──── GoldKrtMst
                                    │
                                 DimMst ◄──── DimQltyMst
                                    │    ◄──── DimQltySubMst
                                 StoneMst ◄── StoneQltyMst

DimInfoMst  (hiển thị thông tin kim cương cho khách xem)
JewelTypeMst (phân loại trang sức)
Inquiry     (form liên hệ độc lập)
```

---

**Tóm lại một câu:** `ItemMst` là trung tâm, các bảng "Mst" xung quanh là danh mục tra cứu, `DimMst`/`StoneMst` là chi tiết vật liệu của sản phẩm, còn `CartList` + `Inquiry` là phần tương tác với khách hàng.
