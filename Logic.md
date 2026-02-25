# Quản lý hồ sơ xin phép (申請書類管理)

> Tài liệu mô tả nghiệp vụ dành cho end user / khách hàng review.
> Phạm vi: Tab 「オンライン作成書類」(Tạo hồ sơ trực tuyến)

---

## 1. Tổng quan

Hệ thống giúp người dùng **tìm ra danh sách hồ sơ cần nộp** dựa trên thông tin của người xin phép.

**Quy trình cơ bản:**

```
Bước 1: Chọn điều kiện lọc cơ bản (tư cách lưu trú, loại đơn, ngành)
    ↓
Bước 2: Tùy chọn thêm điều kiện (loại cơ quan, category, phái cử...)
    ↓
Bước 3: Hệ thống tự động đánh dấu hồ sơ phù hợp
    ↓
Bước 4: Người dùng xem lại, thêm bớt hồ sơ nếu cần
    ↓
Bước 5: Nhấn「保存」để lưu kết quả
```

**Màn hình chia 2 phần:**
- **Phần trên**: Điều kiện lọc (2 tầng cơ bản + bộ điều kiện tag, có thể thu gọn/mở rộng)
- **Phần dưới**: Bảng danh sách hồ sơ + công cụ quản lý

**Khi mở trang lần đầu** (chưa có dữ liệu đã lưu): Hiển thị toàn bộ 107 hồ sơ kèm cảnh báo *「在留資格を選択してください」* — nhắc người dùng bắt đầu chọn bộ lọc.

---

## 2. Bộ lọc: 2 Tầng cơ bản + Tags

Bộ lọc gồm **2 tầng cơ bản** (dropdown) và **bộ điều kiện tag** (dropdown/checkbox).

### 2.1 Bảng tổng quan

| Phần | Tên gọi | Lựa chọn | Khi nào được chọn? |
|------|---------|----------|-------------------|
| **Tầng 1** | Thông tin cơ bản (基本情報) | Tư cách lưu trú + Loại đơn | **Luôn chọn được** — bắt buộc |
| **Tầng 2** | Ngành (分野) | 16 ngành: Kaigo, Xây dựng, Nông nghiệp... | **Chỉ khi** Tầng 1 = Tokutei 1 hoặc 2 |
| **Tags** | Điều kiện bổ sung (条件) | Loại cơ quan, Category, Phái cử, Ủy thác hỗ trợ | Khi đã chọn tư cách lưu trú |

### 2.2 Chi tiết từng phần

**Tầng 1 — Thông tin cơ bản:**
- **Tư cách lưu trú (在留資格):** Tokutei 1, Tokutei 2, Tokkatsu, Intern, Gijinkoku
- **Loại đơn (申請種別):** Nintei (認定), Henko (変更), Koshin (更新)
- Cả hai đều bắt buộc

**Tầng 2 — Ngành (分野):**
- Chỉ hiển thị khi tư cách = Tokutei 1 hoặc 2
- Tầng bị khóa → hiển thị *「特定技能のみ」*

**Tags — Điều kiện bổ sung:**

| Tag | Loại | Lựa chọn | Hiển thị khi |
|-----|------|----------|-------------|
| **Loại cơ quan** (機関種別) | Dropdown | 法人 / 個人事業主 | Đã chọn tư cách lưu trú |
| **Category** (カテゴリー) | Dropdown | 1 / 2 / 3 / 4 | Đã chọn tư cách lưu trú |
| **Phái cử** (派遣あり) | Checkbox | Bật/Tắt | Ngành = Nông nghiệp hoặc Ngư nghiệp |
| **Ủy thác hỗ trợ** (登録支援機関に委託) | Checkbox | Bật/Tắt | Tư cách = Tokutei 1 |

### 2.3 Sơ đồ phụ thuộc

```
Tầng 1: Tư cách lưu trú + Loại đơn ← Luôn chọn được (bắt buộc)
  │
  ├── Tầng 2: Ngành ← Chỉ mở cho Tokutei 1 & 2
  │
  └── Tags: Điều kiện bổ sung ← Mở khi đã chọn tư cách lưu trú
        ├── Loại cơ quan (dropdown)
        ├── Category (dropdown)
        ├── Phái cử (checkbox) ← Chỉ mở cho Nông nghiệp & Ngư nghiệp
        └── Ủy thác hỗ trợ (checkbox) ← Chỉ mở cho Tokutei 1
```

### 2.4 Khi thay đổi lựa chọn

- **Đổi tư cách lưu trú** → Reset loại đơn, ngành, và **tất cả tags**. Lý do: mỗi tư cách lưu trú có bộ hồ sơ khác nhau.
- **Đổi ngành** → Reset tag phái cử (nếu ngành mới không phải Nông nghiệp/Ngư nghiệp). Lý do: phái cử chỉ áp dụng cho 2 ngành này.
- **Chọn 個人事業主** → Không thể chọn Category 1 (bị loại khỏi dropdown). Lý do: quy định nghiệp vụ.

### 2.5 Khác biệt so với tags: Tags KHÔNG ảnh hưởng override key

**Quan trọng:** Tags chỉ **thêm hồ sơ** vào danh sách, không tạo "bộ lọc mới". Khi thay đổi tag:
- Overrides (chỉnh sửa thủ công) **không bị mất**
- Không hiện cảnh báo chưa lưu
- Override key chỉ phụ thuộc: `tư cách lưu trú | loại đơn | ngành`

---

## 3. Cách hệ thống tìm hồ sơ phù hợp (Logic ghép nối)

### 3.1 Mỗi hồ sơ có 2 loại thuộc tính

**a) Thuộc tính cơ bản (base filters):**

| Thuộc tính | Ý nghĩa | Giá trị |
|-----------|---------|---------|
| visa | Tư cách lưu trú | Mảng giá trị hoặc rỗng (= tất cả) |
| appType | Loại đơn | Mảng giá trị hoặc rỗng (= tất cả) |
| sector | Ngành | Mảng giá trị hoặc rỗng (= tất cả) |

**b) Tags (điều kiện bổ sung):**

| Giá trị tags | Ý nghĩa |
|-------------|---------|
| `[]` (rỗng) | Luôn hiển thị khi base filter khớp |
| `["common"]` | Luôn hiển thị khi base filter khớp |
| `["org:hojin"]` | Chỉ hiển thị khi user chọn tag 法人 |
| `["org:hojin", "category:3", "category:4"]` | Cần 法人 VÀ (Category 3 HOẶC 4) |
| `["dispatch"]` | Chỉ hiển thị khi user tích phái cử |

**c) Nhóm hiển thị (form_group):**

| Nhóm | Tên | Nội dung |
|------|-----|----------|
| A | 共通 (Chung) | Hồ sơ chung, biểu mẫu cơ bản |
| B | 分野 (Ngành) | Hồ sơ theo ngành |
| C | 条件別 (Theo điều kiện) | Hồ sơ phụ thuộc điều kiện đặc biệt |

### 3.2 Quy tắc ghép nối base filters: AND giữa các điều kiện

Hồ sơ phải **phù hợp với MỌI điều kiện cơ bản đã chọn**:

```
Hồ sơ hiển thị ← visa khớp VÀ appType khớp VÀ sector khớp VÀ searchText khớp
```

- **Mảng rỗng** ở hồ sơ = "dùng cho tất cả" → luôn khớp
- **Chưa chọn** ở bộ lọc = "không lọc" → luôn khớp
- **Danh sách cụ thể** → giá trị user chọn phải nằm trong danh sách

**Ví dụ:** User chọn Tokutei 1 + Nintei + Kaigo

```
Hồ sơ A (visa: [tokutei1, tokutei2], appType: [nintei], sector: [kaigo])
  → tokutei1 ∈ [tokutei1, tokutei2]?  ✓
  → nintei ∈ [nintei]?                  ✓
  → kaigo ∈ [kaigo]?                   ✓
  → Kết quả: ✓ HIỂN THỊ

Hồ sơ B (visa: [tokutei1, tokutei2], appType: [henko], sector: [])
  → tokutei1 ∈ [tokutei1, tokutei2]?  ✓
  → nintei ∈ [henko]?                  ✗ ← Không khớp
  → Kết quả: ✗ ẨN

Hồ sơ C (visa: [], appType: [], sector: [])
  → Tất cả rỗng → luôn khớp           ✓
  → Kết quả: ✓ HIỂN THỊ (hồ sơ dùng chung)
```

### 3.3 Quy tắc ghép nối tags: AND giữa nhóm, OR trong nhóm

Sau khi base filter khớp, hệ thống kiểm tra tags:

**Bước 1:** Nhóm tags của hồ sơ theo group (org_type, category, dispatch...)
**Bước 2:** Mỗi nhóm: **ít nhất 1 tag** trong nhóm phải được user chọn
**Bước 3:** **Tất cả nhóm** phải thỏa mãn (AND)

**Trường hợp đặc biệt:**
- Tags = `[]` hoặc `["common"]` → **luôn pass** (không cần kiểm tra tag)

**Ví dụ:**

```
Hồ sơ có tags: ["org:hojin", "category:3", "category:4"]
  → Nhóm org_type: ["org:hojin"] — cần user chọn 法人
  → Nhóm category: ["category:3", "category:4"] — cần user chọn Cat 3 HOẶC Cat 4

User chọn tags: [org:hojin, category:3]
  → org_type: org:hojin ∈ user tags? ✓
  → category: category:3 ∈ user tags? ✓
  → Kết quả: ✓ HIỂN THỊ

User chỉ chọn: [category:3]
  → org_type: org:hojin ∈ user tags? ✗ ← Thiếu
  → Kết quả: ✗ ẨN (phải chọn cả 法人)
```

### 3.4 Tổng hợp logic lọc

```
Hồ sơ hiển thị = base filter khớp (visa + appType + sector + search)
                  VÀ tags khớp (Group-AND)

Hồ sơ auto-checked = hồ sơ hiển thị (tất cả hồ sơ phù hợp đều được tự động tích)
```

### 3.5 Ví dụ minh họa từng bước

**Người dùng lần lượt chọn:**

| Bước | Thao tác | Kết quả |
|------|---------|---------|
| 1 | Chọn Tokutei 1 | Hiển thị hồ sơ chung (common + tags rỗng) |
| 2 | Chọn Nintei | Lọc thêm theo loại đơn → danh sách chính xác hơn |
| 3 | Chọn Kaigo | **Thêm** hồ sơ ngành Kaigo (Group B) |
| 4 | Tích tag 法人 | **Thêm** hồ sơ yêu cầu 法人 (ví dụ: form 18) |
| 5 | Chọn Category 3 | **Thêm** hồ sơ yêu cầu Category 3 (ví dụ: form 20, 32) |
| 6 | Tích phái cử | **Thêm** hồ sơ phái cử cho ngành hiện tại |

→ Tags **cộng thêm** hồ sơ vào danh sách. Bỏ tích tag → hồ sơ liên quan biến mất.

---

## 4. Tự động đánh dấu hồ sơ

Khi bộ lọc hoặc tag thay đổi, hệ thống tự động:
1. Tìm tất cả hồ sơ phù hợp (theo logic mục 3)
2. **Tự động đánh dấu (check)** tất cả hồ sơ này

Người dùng **không cần thao tác gì** — checkbox tự động được tích.

---

## 5. Chỉnh sửa thủ công (thêm / bỏ hồ sơ)

### 5.1 Thao tác

Người dùng có thể **bỏ** hồ sơ đã tích hoặc **thêm** hồ sơ chưa tích bằng cách click checkbox.

Hồ sơ bị chỉnh sửa thủ công có badge đánh dấu:
- **Badge「+」** (xanh): Hồ sơ được thêm thủ công (hệ thống không tự động tích nhưng user tích)
- **Badge「-」** (đỏ): Hồ sơ bị bỏ thủ công (hệ thống tự động tích nhưng user bỏ tích)

### 5.2 Save-to-commit

Mọi thay đổi (thêm/bỏ hồ sơ) chỉ là **bản nháp tạm thời**. Chỉ khi nhấn「保存」mới được ghi nhận chính thức.

*Ví dụ: Chọn Nintei → bỏ form #7 → **không nhấn lưu** → chuyển sang Henko → quay lại Nintei → form #7 **vẫn được tích** (vì chưa lưu).*

*Ví dụ: Chọn Nintei → bỏ form #7 → **nhấn lưu** → chuyển sang Henko → quay lại Nintei → form #7 **vẫn bị bỏ** (đã lưu).*

### 5.3 Chỉnh sửa độc lập theo bộ lọc cơ bản

Mỗi tổ hợp bộ lọc cơ bản (`tư cách | loại đơn | ngành`) có **bộ chỉnh sửa riêng**, không ảnh hưởng lẫn nhau.

**Quan trọng:** Override key = `visa|appType|sector`. Tags KHÔNG nằm trong key → thay đổi tag không mất override.

*Ví dụ: Lưu chỉnh sửa cho Nintei + Kaigo không ảnh hưởng đến Henko + Kaigo. Hai bộ lọc là hai bản ghi độc lập.*

*Ví dụ: Chỉnh sửa cho Nintei + Kaigo, sau đó tích thêm tag 法人 → thêm hồ sơ mới nhưng override cũ vẫn giữ nguyên.*

### 5.4 Cảnh báo khi chuyển bộ lọc

Khi có thay đổi chưa lưu và người dùng thay đổi bộ lọc cơ bản (visa/appType/sector), hệ thống hiển thị cảnh báo:

> *「未保存の変更があります。変更を破棄して切り替えますか？」*
> (Có thay đổi chưa lưu. Bạn có muốn hủy thay đổi và chuyển không?)

- **OK** → Hủy thay đổi, chuyển sang bộ lọc mới
- **Cancel** → Ở lại bộ lọc hiện tại, giữ nguyên thay đổi

**Lưu ý:** Thay đổi tags KHÔNG kích hoạt cảnh báo này (tags không ảnh hưởng override key).

---

## 6. Chế độ xem (View Mode)

Thanh công cụ phía trên bảng có 2 nút lọc hiển thị:

| Nút | Hiển thị | Dùng khi |
|-----|---------|----------|
| **「選択のみ」** (Chỉ đã chọn) | Chỉ hiện hồ sơ đã tích | Xem danh sách hồ sơ cần nộp |
| **「未選択のみ」** (Chỉ chưa chọn) | Chỉ hiện hồ sơ chưa tích | Tìm hồ sơ đã bị bỏ thủ công |

### Số lượng hiển thị

- **該当: X件** — Tổng số hồ sơ trong bảng
- **選択: X件** — Số hồ sơ đã tích
- **未選択: X件** — Số hồ sơ chưa tích

---

## 7. Tìm kiếm

- Tìm theo **mã biểu mẫu** (様式番号) hoặc **tên hồ sơ** (書類名)
- Không phân biệt chữ hoa/thường
- Nhấn Enter hoặc nút「検索」để tìm
- Tìm kiếm **trong phạm vi hồ sơ đang hiển thị** (kết hợp với bộ lọc)

---

## 8. Bảng danh sách hồ sơ

### 8.1 Các cột

| Cột | Nội dung |
|-----|---------|
| No. | Số thứ tự (đánh lại từ 1 cho mỗi nhóm) |
| 必須 | Checkbox + badge trạng thái (+/-) |
| 様式番号 | Mã biểu mẫu chính thức |
| 書類名 | Tên đầy đủ của hồ sơ |
| 更新者 | Người cập nhật gần nhất |
| 更新日時 | Ngày cập nhật gần nhất |

### 8.2 Phân nhóm

Hồ sơ được nhóm theo `form_group` với tiêu đề phân tách:

| Nhóm | Tiêu đề | Nội dung |
|------|---------|----------|
| A | **共通** — Hồ sơ chung | Biểu mẫu cơ bản, mẫu tham khảo |
| B | **分野** — Hồ sơ ngành | Mẫu theo ngành cụ thể |
| C | **条件別** — Hồ sơ theo điều kiện | Hồ sơ phụ thuộc tag (cơ quan, phái cử...) |

Mỗi tiêu đề hiển thị: badge màu + tên nhóm + số lượng (X件).

### 8.3 Thanh「設定モード」

Phía trên bảng luôn hiển thị thanh nhắc nhở:
- Bên trái: *「設定モード」* (kèm dấu chấm nhấp nháy)
- Bên phải: *「チェックを変更して「保存」で確定」* — Nhắc người dùng nhấn「保存」sau khi chỉnh sửa

---

## 9. Lưu và khôi phục dữ liệu

### 9.1 Cơ chế lưu (Save-to-commit)

Mọi chỉnh sửa checkbox chỉ là **bản nháp tạm thời**. Chỉ khi nhấn「保存」mới được ghi nhận chính thức.

| Hành vi | Mô tả |
|---------|-------|
| **Chỉnh sửa checkbox** | Thay đổi ngay trên màn hình nhưng **chưa được lưu** |
| **Thay đổi tag** | Thêm/bớt hồ sơ theo tag, override **không bị ảnh hưởng** |
| **Chuyển bộ lọc cơ bản khi chưa lưu** | Hiện cảnh báo → OK = hủy thay đổi, Cancel = ở lại |
| **Nhấn「保存」** | Ghi nhận chỉnh sửa. Hiện *「保存しました。選択件数: X件」* |
| **Mở lại trang** | Khôi phục bộ lọc + tags cuối cùng + chỉnh sửa **đã lưu** |
| **Chưa từng lưu** | Bắt đầu từ trạng thái mặc định (chưa chọn gì) |

### 9.2 Dữ liệu lưu trữ (localStorage)

```
{
  version: 4,
  lastFilters: { visa, appType, sector, searchText },
  lastTags: ["org:hojin", "category:3", ...],
  allOverrides: {
    "tokutei1|nintei|kaigo": { 18: false, 25: true },
    "tokutei1|henko|": { ... }
  }
}
```

- **Override key** = `visa|appType|sector` — đơn giản, ổn định
- Tags không nằm trong key → tích/bỏ tag không mất override

---

## 10. Dữ liệu hồ sơ

| Nhóm | Số lượng | Nội dung |
|------|----------|----------|
| A (共通) | ~50 hồ sơ | Biểu mẫu chung, mẫu tham khảo |
| B (分野) | ~40 hồ sơ | Mẫu theo ngành |
| C (条件別) | ~17 hồ sơ | Hồ sơ phụ thuộc điều kiện đặc biệt |
| **Tổng** | **107 hồ sơ** | |

---
