# Quản lý hồ sơ xin phép (申請書類管理)

> Tài liệu mô tả nghiệp vụ dành cho end user / khách hàng review.
> Phạm vi: Tab 「オンライン作成書類」(Tạo hồ sơ trực tuyến)

---

## 1. Tổng quan

Hệ thống giúp người dùng **tìm ra danh sách hồ sơ cần nộp** dựa trên thông tin của người xin phép.

**Quy trình cơ bản:**

```
Bước 1: Chọn điều kiện lọc (tư cách lưu trú, loại đơn, cơ quan...)
    ↓
Bước 2: Hệ thống tự động đánh dấu hồ sơ bắt buộc
    ↓
Bước 3: Người dùng xem lại, thêm bớt hồ sơ nếu cần
    ↓
Bước 4: Nhấn「保存」để lưu kết quả
```

**Màn hình chia 2 phần:**
- **Phần trên**: Điều kiện lọc (5 tầng lọc + tìm kiếm, có thể thu gọn/mở rộng)
- **Phần dưới**: Bảng danh sách hồ sơ + công cụ quản lý

**Khi mở trang lần đầu** (chưa có dữ liệu đã lưu): Hiển thị toàn bộ 107 hồ sơ kèm cảnh báo *「在留資格を選択してください」* — nhắc người dùng bắt đầu chọn bộ lọc.

---

## 2. Bộ lọc 5 tầng

Bộ lọc được tổ chức theo **5 tầng từ trên xuống**. Mỗi tầng phụ thuộc vào tầng trên nó.

### 2.1 Bảng tổng quan

| Tầng | Tên gọi | Lựa chọn | Khi nào được chọn? |
|------|---------|----------|-------------------|
| **Tầng 0** | Tư cách lưu trú (在留資格) | Tokutei 1, Tokutei 2, Tokkatsu, Intern, Gijinkoku | **Luôn chọn được** — đây là điều kiện đầu tiên |
| **Tầng 1** | Loại đơn (申請種別) | Nintei (認定), Henko (変更), Koshin (更新) | Sau khi đã chọn Tầng 0 |
| **Tầng 2** | Thông tin cơ quan (機関情報) | Cơ quan: 未定/法人/個人事業主 **và** Category: 1~4 | Sau khi đã chọn Tầng 0 |
| **Tầng 3** | Ngành (分野) | 16 ngành: Kaigo, Xây dựng, Nông nghiệp... | **Chỉ khi** Tầng 0 = Tokutei 1 hoặc 2 |
| **Tầng 4** | Hình thức tuyển dụng (雇用形態) | Tuyển trực tiếp / Phái cử | **Chỉ khi** Tầng 3 = Nông nghiệp hoặc Ngư nghiệp |

### 2.2 Sơ đồ phụ thuộc

```
Tầng 0: Tư cách lưu trú ← Luôn chọn được (bắt buộc)
  │
  ├── Tầng 1: Loại đơn ← Mở khi đã chọn Tầng 0
  │
  ├── Tầng 2: Cơ quan + Category ← Mở khi đã chọn Tầng 0
  │
  └── Tầng 3: Ngành ← Chỉ mở cho Tokutei 1 & 2
        │
        └── Tầng 4: Hình thức tuyển dụng ← Chỉ mở cho Nông nghiệp & Ngư nghiệp
```

**Tầng chưa đủ điều kiện** sẽ bị mờ (không tương tác được) kèm nhãn giải thích:
- Tầng 3 bị khóa → hiển thị *「特定技能のみ」*
- Tầng 4 bị khóa → hiển thị *「農業・漁業のみ」*

### 2.3 Khi thay đổi lựa chọn

- **Đổi tư cách lưu trú (Tầng 0)** → Xóa hết lựa chọn từ Tầng 1 đến Tầng 4. Lý do: mỗi tư cách lưu trú có bộ hồ sơ khác nhau, giữ lại sẽ không chính xác.
- **Đổi ngành (Tầng 3)** → Chỉ xóa hình thức tuyển dụng (Tầng 4). Lý do: hình thức tuyển dụng phụ thuộc vào ngành.
- **Chọn cá nhân kinh doanh (個人事業主)** khi đang chọn Category 1 → Category bị xóa tự động. Lý do: cá nhân kinh doanh không được phép chọn Category 1.

### 2.4 Trường hợp đặc biệt: Cơ quan = "未定"

Khi người dùng chọn "未定" (chưa xác định) cho cơ quan tiếp nhận:
- Hệ thống **không lọc theo loại cơ quan** — hiển thị hồ sơ của tất cả loại cơ quan
- Mục đích: cho phép xem trước danh sách hồ sơ khi chưa biết cơ quan thuộc loại nào

---

## 3. Cách hệ thống tìm hồ sơ phù hợp (Logic ghép nối)

Đây là phần cốt lõi: **hệ thống ghép nối điều kiện lọc với thuộc tính của từng hồ sơ để quyết định hồ sơ nào cần hiển thị**.

### 3.1 Mỗi hồ sơ có gắn "nhãn" thuộc tính

Mỗi hồ sơ trong hệ thống được gắn nhãn cho biết hồ sơ đó **dùng cho trường hợp nào**:

| Ví dụ hồ sơ | Tư cách | Loại đơn | Cơ quan | Ngành | Ý nghĩa |
|-------------|---------|----------|---------|-------|---------|
| Đơn xin cấp (別記第6号の3) | Tokutei 1, 2 | Nintei | Tất cả | Tất cả | Chỉ dùng cho Tokutei + Nintei |
| Bảng 1 chung (参考様式第1-1号) | Tất cả | Tất cả | Tất cả | Tất cả | Dùng chung cho mọi trường hợp |
| Hồ sơ Kaigo (分野参考様式第2-1号) | Tokutei 1, 2 | Tất cả | Tất cả | Kaigo | Chỉ dùng cho ngành Kaigo |

- **"Tất cả"** = hồ sơ dùng chung, không giới hạn điều kiện đó
- **Danh sách cụ thể** (ví dụ "Tokutei 1, 2") = hồ sơ chỉ dùng khi điều kiện lọc nằm trong danh sách

### 3.2 Quy tắc ghép nối: AND giữa các tầng

Khi người dùng chọn bộ lọc, hệ thống so khớp **tất cả điều kiện cùng lúc**. Hồ sơ phải **phù hợp với MỌI điều kiện đã chọn** mới được đưa vào danh sách.

**Ví dụ:** Người dùng chọn: Tokutei 1 + Nintei + Kaigo

```
Hồ sơ A (visa: [Tokutei 1, 2], appType: [Nintei], sector: [Kaigo])
  → Tokutei 1 ∈ [Tokutei 1, 2]?  ✓
  → Nintei ∈ [Nintei]?              ✓
  → Kaigo ∈ [Kaigo]?               ✓
  → Kết quả: ✓ HIỂN THỊ

Hồ sơ B (visa: [Tokutei 1, 2], appType: [Henko], sector: Tất cả)
  → Tokutei 1 ∈ [Tokutei 1, 2]?  ✓
  → Nintei ∈ [Henko]?              ✗ ← Không khớp
  → Kết quả: ✗ ẨN

Hồ sơ C (visa: Tất cả, appType: Tất cả, sector: Tất cả)
  → Tất cả → luôn khớp             ✓
  → Kết quả: ✓ HIỂN THỊ (hồ sơ dùng chung)
```

**Tóm lại:**
- **AND giữa các điều kiện**: Phải khớp visa VÀ loại đơn VÀ cơ quan VÀ ngành VÀ... (mọi điều kiện đã chọn)
- **OR trong từng điều kiện**: Hồ sơ gắn nhiều giá trị (ví dụ visa = Tokutei 1, 2) nghĩa là khớp với Tokutei 1 HOẶC Tokutei 2
- **"Tất cả" = luôn khớp**: Hồ sơ dùng chung không bị loại bởi điều kiện đó
- **Chưa chọn = bỏ qua**: Nếu người dùng chưa chọn ngành → hệ thống không so khớp theo ngành

### 3.3 Quy tắc ghép nối theo tầng: UNION giữa các tầng

Danh sách hồ sơ hiển thị cuối cùng là **tập hợp (UNION)** của hồ sơ từ tất cả các tầng đã mở:

```
Danh sách hiển thị = Hồ sơ Tầng 1 (phù hợp) + Hồ sơ Tầng 2 (phù hợp) + Hồ sơ Tầng 3 (phù hợp) + Hồ sơ Tầng 4 (phù hợp)
                     ├── Luôn có nếu       ├── Có khi đã chọn    ├── Có khi Tokutei    ├── Có khi Nông nghiệp
                         đã chọn visa            cơ quan/category       + đã chọn ngành       /Ngư nghiệp + tuyển dụng
```

**Quan trọng:**
- Tầng nào **chưa chọn đủ điều kiện** → hồ sơ của tầng đó **hoàn toàn không hiển thị** (ẩn cả dòng, không chỉ ẩn checkbox)
- Hồ sơ được **gom nhóm theo tầng** trong bảng, mỗi nhóm có tiêu đề riêng

### 3.4 Ví dụ minh họa từng bước

**Người dùng lần lượt chọn:**

| Bước | Thao tác | Kết quả |
|------|---------|---------|
| 1 | Chọn Tokutei 1 | Hiển thị ~12 hồ sơ Tầng 1 phù hợp Tokutei 1 |
| 2 | Chọn Nintei | Danh sách Tầng 1 được lọc thêm → còn ~8 hồ sơ (chỉ Nintei) |
| 3 | Chọn 法人 + Category 3 | **Thêm** hồ sơ Tầng 2 phù hợp 法人 + Cat 3 → danh sách = Tầng 1 + Tầng 2 |
| 4 | Chọn Kaigo | **Thêm** hồ sơ Tầng 3 ngành Kaigo → danh sách = Tầng 1 + Tầng 2 + Tầng 3 |

→ Mỗi lần chọn thêm điều kiện ở tầng mới → hồ sơ tầng đó được **cộng thêm (ADD)** vào danh sách.
→ Mỗi lần chọn chi tiết hơn trong cùng tầng → danh sách tầng đó được **lọc chính xác hơn**.

---

## 4. Tự động đánh dấu hồ sơ bắt buộc

Khi bộ lọc thay đổi, hệ thống tự động:
1. Tìm tất cả hồ sơ phù hợp (theo logic mục 3)
2. **Tự động đánh dấu (check)** những hồ sơ này là "bắt buộc"

Người dùng **không cần thao tác gì** — checkbox tự động được tích.

---

## 5. Chỉnh sửa thủ công (thêm / bỏ hồ sơ)

Người dùng có thể **bỏ** hồ sơ bắt buộc hoặc **thêm** hồ sơ tùy chọn bằng cách click checkbox.

### 5.1 Thao tác và trạng thái

| Thao tác | Kết quả | Nhận biết trên màn hình |
|---------|---------|------------------------|
| Bỏ tích hồ sơ bắt buộc | Hồ sơ bị đánh dấu "đã bỏ" | Badge **「-」** đỏ, dòng mờ nền hồng |
| Tích vào hồ sơ tùy chọn | Hồ sơ được đánh dấu "đã thêm" | Badge **「+」** xanh lá, dòng nền xanh nhạt |
| Click lần nữa | Hủy chỉnh sửa, trở về trạng thái ban đầu | Badge biến mất, dòng trở lại bình thường |

### 5.2 Chỉnh sửa chỉ có hiệu lực khi đã lưu

Mọi thay đổi (thêm/bỏ hồ sơ) chỉ là **tạm thời** cho đến khi nhấn「保存」. Nếu chuyển bộ lọc mà chưa lưu → **thay đổi bị hủy**.

*Ví dụ: Chọn Nintei → bỏ form #7 → **không nhấn lưu** → chuyển sang Henko → quay lại Nintei → form #7 **vẫn được tích** (vì chưa lưu).*

*Ví dụ: Chọn Nintei → bỏ form #7 → **nhấn lưu** → chuyển sang Henko → quay lại Nintei → form #7 **vẫn bị bỏ** (đã lưu).*

### 5.3 Chỉnh sửa độc lập theo bộ lọc

Mỗi tổ hợp bộ lọc có **bộ chỉnh sửa riêng**, không ảnh hưởng lẫn nhau.

*Ví dụ: Lưu chỉnh sửa cho Nintei không ảnh hưởng gì đến Henko. Hai bộ lọc là hai bản ghi độc lập.*

### 5.4 Cảnh báo khi chuyển bộ lọc

Khi có thay đổi chưa lưu và người dùng chuyển sang bộ lọc khác, hệ thống hiển thị cảnh báo:

> *「未保存の変更があります。変更を破棄して切り替えますか？」*
> (Có thay đổi chưa lưu. Bạn có muốn hủy thay đổi và chuyển không?)

- **OK** → Hủy thay đổi, chuyển sang bộ lọc mới
- **Cancel** → Ở lại bộ lọc hiện tại, giữ nguyên thay đổi

---

## 6. Nút「追加表示」(Hiển thị thêm)

### 6.1 Mục đích

Mặc định, bảng chỉ hiển thị hồ sơ **bắt buộc** (đã tích). Nút「追加表示」cho phép xem thêm các hồ sơ **tùy chọn** — phù hợp điều kiện lọc nhưng không bắt buộc — để người dùng có thể chọn thêm nếu cần.

### 6.2 So sánh TẮT / BẬT

| | TẮT (mặc định) | BẬT |
|---|---|---|
| **Hiển thị gì?** | Chỉ hồ sơ bắt buộc + hồ sơ đã bỏ thủ công | Tất cả hồ sơ phù hợp điều kiện lọc (gồm cả chưa tích) |
| **Dùng khi nào?** | Xem danh sách hồ sơ cần nộp | Tìm hồ sơ tùy chọn để thêm |

### 6.3 Ràng buộc quan trọng

- **Chỉ hiển thị hồ sơ phù hợp điều kiện lọc hiện tại**: Chọn ngành Kaigo → bật追加表示 → chỉ hiện thêm hồ sơ Kaigo (không hiện hồ sơ ngành Nông nghiệp, Xây dựng...)
- **Tầng chưa chọn → không hiện**: Chưa chọn ngành → không hiện hồ sơ Tầng 3, dù追加表示 đang bật
- Hồ sơ hiển thị thêm ở trạng thái chưa tích — người dùng cần tự tích nếu muốn thêm

### 6.4 Ví dụ

**Bộ lọc:** Tokutei 1 + Nintei + Kaigo (chưa chọn cơ quan)

| Tầng | TẮT | BẬT |
|------|-----|-----|
| Tầng 1 (共通) | 15 hồ sơ (đã tích) | 15 hồ sơ (đã tích) |
| Tầng 2 (機関) | Không hiện (chưa chọn cơ quan) | Không hiện (chưa chọn cơ quan) |
| Tầng 3 (分野) | 5 hồ sơ Kaigo (đã tích) | 5 đã tích + 3 chưa tích = **8 hồ sơ Kaigo** |
| **Tổng** | **20 hồ sơ** | **23 hồ sơ** |

→ 3 hồ sơ thêm ở Tầng 3 là hồ sơ Kaigo tùy chọn. Người dùng tích vào nếu cần nộp thêm.

---

## 7. Chế độ xem (View Mode)

Thanh công cụ phía trên bảng có 2 nút lọc hiển thị:

| Nút | Hiển thị | Dùng khi |
|-----|---------|----------|
| **「選択のみ」** (Chỉ đã chọn) | Chỉ hiện hồ sơ đã tích | Xem danh sách hồ sơ cần nộp |
| **「未選択のみ」** (Chỉ chưa chọn) | Chỉ hiện hồ sơ chưa tích | Tìm hồ sơ cần thêm hoặc xem hồ sơ đã bỏ |

### Kết hợp với「追加表示」

| Tình huống | Ý nghĩa thực tế |
|-----------|-----------------|
| 追加表示 TẮT + 選択のみ | Xem danh sách hồ sơ bắt buộc + thêm thủ công |
| 追加表示 TẮT + 未選択のみ | Xem hồ sơ bắt buộc đã bị bỏ (badge「-」) |
| 追加表示 BẬT + 選択のみ | Giống trường hợp 1 |
| 追加表示 BẬT + 未選択のみ | **Xem tất cả hồ sơ tùy chọn** có thể thêm |

### Số lượng hiển thị

- **該当: X件** — Tổng số hồ sơ trong bảng
- **選択: X件** — Số hồ sơ đã tích
- **未選択: X件** — Số hồ sơ chưa tích

---

## 8. Tìm kiếm

- Tìm theo **mã biểu mẫu** (様式番号) hoặc **tên hồ sơ** (書類名)
- Không phân biệt chữ hoa/thường
- Nhấn Enter hoặc nút「検索」để tìm
- Tìm kiếm **trong phạm vi hồ sơ đang hiển thị** (kết hợp với bộ lọc)

---

## 9. Bảng danh sách hồ sơ

### 9.1 Các cột

| Cột | Nội dung |
|-----|---------|
| No. | Số thứ tự (đánh lại từ 1 cho mỗi nhóm tầng) |
| 必須 | Checkbox + badge trạng thái (xem mục 5.1) |
| 様式番号 | Mã biểu mẫu chính thức |
| 書類名 | Tên đầy đủ của hồ sơ |
| 更新者 | Người cập nhật gần nhất |
| 更新日時 | Ngày cập nhật gần nhất |

### 9.2 Phân nhóm

Hồ sơ được nhóm theo tầng với tiêu đề phân tách:

| Nhóm | Tiêu đề | Nội dung |
|------|---------|----------|
| Tầng 1 | **共通** — 別記様式・参考様式・第1表 | Hồ sơ chung, áp dụng rộng |
| Tầng 2 | **機関** — 第2表（所属機関に関する書類） | Hồ sơ liên quan cơ quan |
| Tầng 3 | **分野** — 分野参考様式・第3表 | Hồ sơ theo ngành |
| Tầng 4 | **派遣** — 派遣用書類 | Hồ sơ phái cử |

Mỗi tiêu đề hiển thị: badge màu + tên nhóm + số lượng (X件).

### 9.3 Thanh「設定モード」

Phía trên bảng luôn hiển thị thanh nhắc nhở:
- Bên trái: *「設定モード」* (kèm dấu chấm nhấp nháy)
- Bên phải: *「チェックを変更して「保存」で確定」* — Nhắc người dùng nhấn「保存」sau khi chỉnh sửa

---

## 10. Lưu và khôi phục dữ liệu

### 10.1 Cơ chế lưu (Save-to-commit)

Mọi chỉnh sửa checkbox chỉ là **bản nháp tạm thời**. Chỉ khi nhấn「保存」mới được ghi nhận chính thức.

| Hành vi | Mô tả |
|---------|-------|
| **Chỉnh sửa checkbox** | Thay đổi ngay trên màn hình nhưng **chưa được lưu** |
| **Chuyển bộ lọc khi chưa lưu** | Hiện cảnh báo → OK = hủy thay đổi, Cancel = ở lại |
| **Nhấn「保存」** | Ghi nhận chỉnh sửa cho tổ hợp bộ lọc hiện tại. Hiện thông báo *「保存しました。選択件数: X件」* |
| **Mở lại trang** | Khôi phục bộ lọc cuối cùng + chỉnh sửa **đã lưu** của từng tổ hợp |
| **Chưa từng lưu / Xóa dữ liệu trình duyệt** | Bắt đầu từ trạng thái mặc định (chưa chọn gì) |

### 10.2 Nguyên tắc quan trọng

- Chỉnh sửa thủ công được lưu **riêng biệt cho từng tổ hợp bộ lọc** — lưu Nintei không ảnh hưởng Henko
- Dữ liệu lưu trong trình duyệt (localStorage) — chỉ tồn tại trên thiết bị đang dùng
- **Chưa nhấn「保存」= chưa lưu** — tắt trang hoặc chuyển bộ lọc sẽ mất thay đổi

---

## 11. Dữ liệu hồ sơ

| Tầng | Số lượng | Nội dung |
|------|----------|----------|
| Tầng 1 | 24 hồ sơ | Biểu mẫu chung, mẫu tham khảo, Bảng 1 |
| Tầng 2 | 3 hồ sơ | Bảng 2 (hồ sơ cơ quan) |
| Tầng 3 | 71 hồ sơ | Mẫu theo ngành, Bảng 3 |
| Tầng 4 | 3 hồ sơ | Hồ sơ phái cử |
| **Tổng** | **107 hồ sơ** | |

---

## 12. Tổng hợp các quy tắc nghiệp vụ

| # | Quy tắc | Giải thích |
|---|---------|------------|
| 1 | Chưa chọn tư cách lưu trú → hiển thị toàn bộ 107 hồ sơ + cảnh báo | Nhắc người dùng bắt đầu chọn bộ lọc |
| 2 | Cá nhân kinh doanh không được chọn Category 1 | Nếu đang chọn Category 1, sẽ bị xóa tự động |
| 3 | Cơ quan = "未定" → không lọc theo cơ quan | Cho phép xem trước khi chưa xác định loại cơ quan |
| 4 | Ngoài Tokutei → Tầng 3, 4 bị khóa | Chỉ Tokutei 1 & 2 mới có hồ sơ theo ngành |
| 5 | Ngoài Nông nghiệp/Ngư nghiệp → Tầng 4 bị khóa | Chỉ 2 ngành này có hồ sơ phái cử |
| 6 | Đổi tư cách lưu trú → xóa toàn bộ tầng dưới | Đảm bảo không giữ lại lựa chọn không hợp lệ |
| 7 | Đổi ngành → chỉ xóa hình thức tuyển dụng | Hình thức tuyển dụng phụ thuộc ngành |
| 8 | 追加表示 chỉ hiện hồ sơ phù hợp bộ lọc hiện tại | Không hiện hồ sơ ngành khác |
| 9 | Chỉnh sửa thủ công độc lập theo tổ hợp bộ lọc | Nintei và Henko có bộ chỉnh sửa riêng, không ảnh hưởng lẫn nhau |
| 10 | Chỉnh sửa chỉ có hiệu lực khi nhấn「保存」 | Chưa lưu mà chuyển bộ lọc hoặc tắt trang → thay đổi bị hủy |
| 11 | Cảnh báo khi chuyển bộ lọc có thay đổi chưa lưu | Hiện hộp thoại xác nhận, người dùng chọn hủy hoặc ở lại |
| 12 | Hồ sơ dùng chung luôn phù hợp mọi điều kiện | Không bị loại bởi bất kỳ bộ lọc nào |
| 13 | Hồ sơ so khớp theo AND giữa các điều kiện, OR trong từng điều kiện | Phải khớp mọi điều kiện đã chọn; nhưng hồ sơ gắn nhiều giá trị thì khớp bất kỳ giá trị nào |
| 14 | Danh sách hiển thị = UNION các tầng đã mở | Mỗi tầng đủ điều kiện → hồ sơ tầng đó được cộng thêm vào danh sách |
