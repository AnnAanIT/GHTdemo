# SRS: Tab オンライン作成書類 (Tài liệu tạo trực tuyến)

**Phiên bản:** 1.0 | **Ngày:** 2026-02-26 | **Trạng thái:** Draft

---

## 1. Mô tả màn hình

### 1.1 Overview

Tab **オンライン作成書類** là tab thứ 3 trong màn hình **申請書類管理** (Quản lý tài liệu đơn xin). Mục đích của tab này là giúp người dùng xác định và chọn các **mẫu biểu cần nộp cho cơ quan quản lý xuất nhập cảnh**, dựa trên điều kiện của từng đương sự (tư cách lưu trú, loại đơn, lĩnh vực ngành nghề, v.v.).

Tab này có **~107 mẫu biểu** được phân loại theo 3 nhóm (A/B/C). Hệ thống sẽ **tự động check** các mẫu biểu phù hợp với điều kiện người dùng chọn, đồng thời cho phép người dùng **điều chỉnh thủ công** từng mẫu biểu. Kết quả chọn lựa được **lưu vào localStorage** và phục hồi khi mở lại.

**Điểm khác biệt so với 2 tab còn lại:**

| | オンライン作成書類 | 申請人書類 / 所属機関書類 |
|---|---|---|
| Số lượng tài liệu | ~107 mẫu biểu | 6 mẫu (sample) |
| Cột サンプルファイル | ❌ Không có | ✅ Có (upload file) |
| Cột 操作 (edit/delete) | ❌ Không có | ✅ Có |
| Bộ lọc | 2 lớp + Tags (đầy đủ) | Cơ bản |
| Nhóm tài liệu A/B/C | ✅ Có | ❌ Không có |

### 1.2 Cấu trúc màn hình

```
┌────────────────────────────────────────────────────────────┐
│  申請書類管理                                      [保存]   │  ← Page Header
├────────────────────────────────────────────────────────────┤
│ [申請人書類] [所属機関書類] [オンライン作成書類*]             │  ← Tab Bar
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ▼ 絞り込み条件                       クリックで折りたたむ│  │  ← Bộ lọc
│ │                                                      │  │
│ │  基本情報  在留資格 [-- 選択 --▼]  + 申請種別 [-- 選択 --▼] │  │  ← Layer 1
│ │            分野   [-- 選択 --▼]                       │  │  ← Layer 2
│ │            機関種別 [-- 選択 --▼]  カテゴリー [-- 選択 --▼] │  │  ← Layer 3
│ │                                                      │  │
│ │  [様式名で検索...]               該当:X件 選択:Y件/未:Z件 │  │  ← Tìm kiếm
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ⚙ 設定モード            チェックを変更して「保存」で確定   │  │  ← Setting Bar
│ │ 書類一覧  [選択のみ (X)]  [未選択のみ (Y)]              │  │  ← Toolbar
│ │ ┌──────────────────────────────────────────────────┐ │  │
│ │ │ No. │ 必須 │  様式番号  │      書類名      │更新者│更新日時│ │  │  ← Header
│ │ ├───── Group A: 共通 省令様式・参考様式  (XX件) ──────┤ │  │
│ │ │  1  │ [✓] │ 別記第6号  │ 申請書（在留資格...）│田中太郎│2024/01/15│ │  │
│ │ │  2  │ [✓] │ 別記第30号 │ 申請書（在留資格...）│田中太郎│2024/01/15│ │  │
│ │ ├───── Group B: 分野参考様式  (XX件) ────────────────┤ │  │
│ │ │ ... │ ... │    ...    │       ...        │  ... │   ...  │ │  │
│ │ ├───── Group C: 別表・派遣用書類  (XX件) ─────────────┤ │  │
│ │ │ ... │ ... │    ...    │       ...        │  ... │   ...  │ │  │
│ │ └──────────────────────────────────────────────────┘ │  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Bộ lọc (絞り込み条件)

### 2.1 Tổng quan

Phần bộ lọc được đặt ở trên cùng của tab panel, trong một khung có tiêu đề **「絞り込み条件」**. Người dùng có thể **click vào tiêu đề để thu gọn/mở rộng** phần này. Khi thu gọn, chỉ còn hiển thị tiêu đề, nội dung phía dưới bị ẩn.

Bộ lọc có cấu trúc **2 lớp + Tags**, hoạt động theo mô hình phụ thuộc tuần tự từ trên xuống: lớp trên phải được chọn trước thì lớp dưới mới được kích hoạt.

### 2.2 Layer 1 — Thông tin cơ bản (基本情報)

Layer 1 luôn hiển thị và là điểm bắt đầu bắt buộc.

#### 在留資格 (Tư cách lưu trú)

| Thuộc tính | Chi tiết |
|-----------|---------|
| Loại | Dropdown (select) |
| Giá trị mặc định | `-- 選択してください --` (chưa chọn) |
| Bắt buộc | Có — nếu chưa chọn, toàn bộ tài liệu hiển thị kèm cảnh báo |

**Các lựa chọn:**

| Hiển thị | Giá trị nội bộ |
|---------|---------------|
| 特定技能1号 | `tokutei1` |
| 特定技能2号 | `tokutei2` |
| 特定活動 | `tokkatsu` |
| インターン | `intern` |
| 技術・人文知識・国際業務 | `gijinkoku` |

**Hành vi khi thay đổi:**
- Reset toàn bộ các trường phía dưới: 申請種別, 分野, tất cả tags (機関種別, カテゴリー, 雇用形態)
- Nếu có thay đổi chưa lưu → hiện confirm dialog trước khi reset

#### 申請種別 (Loại đơn)

| Thuộc tính | Chi tiết |
|-----------|---------|
| Loại | Dropdown (select) |
| Trạng thái | **Disabled** khi chưa chọn 在留資格 |

**Các lựa chọn:**

| Hiển thị | Giá trị nội bộ |
|---------|---------------|
| 認定 (Cấp mới) | `nintei` |
| 変更 (Thay đổi) | `henko` |
| 更新 (Gia hạn) | `koshin` |

### 2.3 Layer 2 — 分野 (Lĩnh vực ngành nghề)

| Thuộc tính | Chi tiết |
|-----------|---------|
| Loại | Dropdown (select) |
| Điều kiện hiển thị hoạt động | Visa = `tokutei1` hoặc `tokutei2` **VÀ** đã chọn 申請種別 |
| Trạng thái khi không thỏa | Disabled + hiển thị nhãn **「特定技能のみ」** |

**16 lĩnh vực:**

| Nhóm | Lĩnh vực |
|------|---------|
| Dịch vụ | 介護 / ビルクリーニング / 宿泊 / 外食業 |
| Sản xuất | 工業製品製造業 / 造船・舶用工業 / 飲食料品製造業 / 木材産業 |
| Xây dựng & Vận tải | 建設 / 自動車整備 / 航空 / 自動車運送業 / 鉄道 |
| Nông lâm thủy sản | 農業 / 漁業 / 林業 |

**Hành vi khi thay đổi:**
- Nếu chuyển sang ngành **không phải** 農業/漁業 → reset tag 雇用形態

### 2.4 Layer 3 — Tags (Điều kiện bổ sung)

Layer 3 chỉ hiển thị khi **đã chọn cả 在留資格 lẫn 申請種別**.

#### 機関種別 (Loại tổ chức)

| Thuộc tính | Chi tiết |
|-----------|---------|
| Loại | Dropdown (chọn độc quyền — chỉ 1 giá trị) |
| Hiển thị | Luôn hiển thị khi Layer 3 active |

| Lựa chọn | Tag |
|---------|-----|
| 法人 | `org:hojin` |
| 個人事業主 | `org:kojin` |

**Hành vi đặc biệt:** Khi chọn **個人事業主** → カテゴリー1 bị ẩn/disabled khỏi danh sách カテゴリー.

#### カテゴリー (Danh mục)

| Thuộc tính | Chi tiết |
|-----------|---------|
| Loại | Dropdown (chọn độc quyền) |
| Điều kiện hiển thị | Chỉ khi visa = `gijinkoku` (技術・人文知識・国際業務) |

| Lựa chọn | Tag | Điều kiện |
|---------|-----|----------|
| カテゴリー1 | `category:1` | Ẩn nếu 機関種別 = 個人事業主 |
| カテゴリー2 | `category:2` | Luôn hiện |
| カテゴリー3 | `category:3` | Luôn hiện |
| カテゴリー4 | `category:4` | Luôn hiện |

#### 雇用形態 (Hình thức tuyển dụng)

| Thuộc tính | Chi tiết |
|-----------|---------|
| Loại | Dropdown (chọn độc quyền) |
| Điều kiện hiển thị | Chỉ khi visa = `tokutei1`/`tokutei2` **VÀ** 分野 = `農業` hoặc `漁業` |

| Lựa chọn | Tag |
|---------|-----|
| 直接雇用 | `employment:direct` |
| 派遣 | `employment:dispatch` |

### 2.5 Tóm tắt quy tắc phụ thuộc

```
在留資格 thay đổi
  → Reset: 申請種別, 分野, 機関種別, カテゴリー, 雇用形態

在留資格 chưa chọn
  → 申請種別: disabled

在留資格 ≠ tokutei1/tokutei2  HOẶC  申請種別 chưa chọn
  → 分野: disabled + label "特定技能のみ"

分野 thay đổi sang ≠ 農業/漁業
  → Reset: 雇用形態

機関種別 = 個人事業主
  → カテゴリー1: ẩn/disabled

visa ≠ gijinkoku
  → カテゴリー: ẩn

visa ≠ tokutei1/tokutei2  HOẶC  分野 ≠ 農業/漁業
  → 雇用形態: ẩn
```

### 2.6 Logic lọc tài liệu

Mỗi tài liệu chỉ được hiển thị khi **tất cả** điều kiện sau đều thỏa:

```
HIỂN THỊ = visaMatch AND appTypeMatch AND sectorMatch AND tagMatch AND searchMatch
```

| Điều kiện | Logic |
|----------|-------|
| **visaMatch** | `form.visa == null` → pass luôn; ngược lại: `filters.visa` phải nằm trong `form.visa[]` |
| **appTypeMatch** | `form.appType == null` → pass luôn; ngược lại: `filters.appType` phải nằm trong `form.appType[]` |
| **sectorMatch** | `form.sector == null` → pass luôn; nếu có sector: visa phải là tokutei VÀ sector đã chọn VÀ `filters.sector` ∈ `form.sector[]` |
| **tagMatch** | `form.tags` rỗng hoặc chứa `"common"` → pass luôn; ngược lại: AND giữa các nhóm tag, OR trong cùng nhóm |
| **searchMatch** | `searchText` rỗng → pass; ngược lại: searchText ⊆ `form_no` hoặc ⊆ `form_name` (không phân biệt hoa/thường) |

**Ví dụ tagMatch:**
- Form có `tags: ["org:hojin"]` → chỉ hiển thị khi user chọn 機関種別 = 法人
- Form có `tags: ["category:3", "category:4"]` → hiển thị khi カテゴリー = 3 **hoặc** 4
- Form có `tags: ["org:hojin", "category:3"]` → hiển thị khi 法人 **AND** カテゴリー3

### 2.7 Thanh tìm kiếm và hiển thị số lượng

Nằm dưới cùng của phần bộ lọc.

- **Ô tìm kiếm**: placeholder `様式名で検索...`, tìm kiếm realtime theo 様式番号 và 書類名
- **Hiển thị số lượng** (bên phải): `該当: X件　選択: Y件 / 未選択: Z件`
  - **X** = tổng số tài liệu thỏa bộ lọc hiện tại
  - **Y** = số tài liệu đang được check trong X
  - **Z** = số tài liệu chưa được check trong X
  - Cập nhật realtime mỗi khi filter hoặc checkbox thay đổi
- **Lưu ý**: searchText **không được lưu** vào localStorage khi bấm 保存 (luôn bị xóa)

---

## 3. Logic Checkbox

### 3.1 Auto-check (Tự động chọn)

Khi người dùng chọn bộ lọc, hệ thống tự động tính toán danh sách tài liệu phù hợp và **check tất cả** chúng.

- Nếu chưa chọn 在留資格 → **không có** tài liệu nào được auto-check
- Khi filter thay đổi → danh sách auto-check được tính lại ngay lập tức

### 3.2 Manual override (Ghi đè thủ công)

Người dùng có thể click vào checkbox của bất kỳ tài liệu nào để thay đổi trạng thái:

```
Người dùng click checkbox của form.no = X:

  Nếu trạng thái mới == trạng thái auto-check:
    → XÓA override của X (trạng thái "sạch", không cần lưu riêng)

  Nếu trạng thái mới ≠ trạng thái auto-check:
    → LƯU override: overrides[X] = trạng thái mới (true/false)
```

### 3.3 Trạng thái hiển thị cuối cùng

```
finalChecked(form.no) =
  Nếu tồn tại override[form.no] → dùng override[form.no]
  Ngược lại                     → dùng autoCheck[form.no]
```

### 3.4 Badge hiển thị trên checkbox

| Trường hợp | Badge | Màu |
|----------|-------|-----|
| Auto-check = false, user check = true | **[+]** | Xanh lá |
| Auto-check = true, user check = false | **[-]** | Đỏ |
| Không có override | (không badge) | — |

### 3.5 Phạm vi override

Override được quản lý **độc lập theo từng filterKey**:

```
filterKey = "visa|appType|sector"
  Ví dụ: "tokutei1|nintei|kaigo"
          "gijinkoku|henko|"
```

- Override của filterKey này **không ảnh hưởng** đến filterKey khác
- Tất cả overrides của tất cả filterKey đều được lưu cùng nhau trong localStorage

---

## 4. Bảng 書類一覧

### 4.1 Mô tả chung

Bảng danh sách tài liệu hiển thị tất cả mẫu biểu phù hợp với bộ lọc đang chọn, được phân thành các **nhóm (Group A/B/C)**. Bảng có thể scroll dọc (max-height: 500px), phần header cố định (sticky) khi scroll.

### 4.2 Mô tả các cột

| Cột | Độ rộng | Căn lề | Mô tả |
|-----|---------|--------|-------|
| **No.** | 40px | Giữa | Số thứ tự hiển thị của tài liệu trong bảng (≠ form.no nội bộ) |
| **必須** | 50px | Giữa | Checkbox trạng thái chọn/bỏ chọn. Có thể click để toggle. Hiển thị badge +/- khi có manual override |
| **様式番号** | 300px | Trái | Mã hiệu mẫu biểu chính thức (ví dụ: 別記第６号の３様式, 参考様式第1-3号別紙) |
| **書類名** | 1fr (co giãn) | Trái | Tên đầy đủ của tài liệu bằng tiếng Nhật. Có thể xuống dòng nếu dài |
| **更新者** | 90px | Giữa | Tên người cập nhật cuối. Hiện tại là giá trị cố định: **田中 太郎** |
| **更新日時** | 110px | Giữa | Ngày cập nhật cuối. Hiện tại là giá trị cố định: **2024年01月15日** |

> **Lưu ý:** Tab này **không có** cột サンプルファイル (upload) và cột 操作 (edit/delete). Hai cột này chỉ xuất hiện ở tab 申請人書類 và 所属機関書類.

### 4.3 Nhóm tài liệu (Group Headers)

Tài liệu được chia thành 3 nhóm, hiển thị theo thứ tự A → B → C:

| Nhóm | Màu badge | Tiêu đề nhóm | Điều kiện hiển thị |
|------|-----------|-------------|-------------------|
| **A** | #4A9BAD (xanh ngọc) | 共通 省令様式・参考様式 | Luôn hiển thị khi có ít nhất 1 tài liệu phù hợp |
| **B** | #6ABDD4 (xanh nhạt) | 分野参考様式 | Chỉ khi visa = tokutei1/tokutei2 **VÀ** đã chọn 分野 |
| **C** | #E08050 (cam) | 別表・派遣用書類 | Chỉ khi điều kiện tag tương ứng được thỏa mãn |

Mỗi **Group Header** hiển thị:
- Badge màu với tên nhóm (A / B / C)
- Mô tả nhóm (ví dụ: 「共通 省令様式・参考様式」)
- Số lượng tài liệu trong nhóm đang hiển thị

> Nếu một nhóm không có tài liệu nào thỏa bộ lọc → **ẩn cả header của nhóm đó**

### 4.4 Màu sắc và trạng thái hàng

| Trạng thái | Màu nền | Ghi chú |
|----------|---------|---------|
| Hàng chẵn (even) | `#fafbfc` | Zebra stripe nhẹ |
| Hàng lẻ (odd) | `#ffffff` | Trắng |
| Hover | `#eef6f8` | Xanh nhạt khi di chuột |
| Unchecked | `#fefefe` + opacity | Tài liệu chưa được chọn |
| Manually added | Viền trái xanh lá `#4caf50` | Thêm thủ công ngoài auto |
| Manually removed | Viền trái đỏ `#e57373` + opacity 0.6 | Bỏ thủ công dù auto-check |

### 4.5 Thông báo không có dữ liệu

Khi không có tài liệu nào thỏa mãn bộ lọc + view toggle hiện tại:
> 「該当する書類がありません」

---

## 5. Chức năng Lưu (保存)

### 5.1 Nút 保存

- Nút nằm ở **góc phải trên** của Page Header, hiển thị mọi lúc
- Khi click: thực hiện lưu cho **tab đang active**

| Trạng thái | Màu nền | Ý nghĩa |
|----------|---------|---------|
| Bình thường | `#0099CC` (xanh dương) | Không có thay đổi chưa lưu |
| Có thay đổi | `#e07020` (cam) | hasUnsavedChanges = true |

### 5.2 Khi nào hasUnsavedChanges = true?

```
So sánh workingOverrides (trạng thái hiện tại)
với savedData.allOverrides[currentFilterKey] (trạng thái đã lưu)

Nếu khác nhau → hasUnsavedChanges = true → nút 保存 chuyển sang cam
```

### 5.3 Luồng xử lý khi bấm 保存

Khi người dùng bấm nút **保存**, hệ thống thực hiện tuần tự các bước sau:

**Bước 1 — Tổng hợp trạng thái ghi đè thủ công**

Hệ thống ghi nhận toàn bộ các thay đổi checkbox mà người dùng đã thực hiện thủ công (ghi đè so với auto-check) trong phiên làm việc hiện tại, ứng với bộ lọc đang được chọn.

**Bước 2 — Hợp nhất với dữ liệu đã lưu trước đó**

Hệ thống cập nhật trạng thái ghi đè của bộ lọc hiện tại vào toàn bộ dữ liệu đã lưu, đảm bảo không làm mất trạng thái của các bộ lọc khác:
- Nếu người dùng có thực hiện ghi đè thủ công → cập nhật/thêm mới trạng thái cho bộ lọc hiện tại
- Nếu người dùng không có ghi đè thủ công nào → xóa bỏ trạng thái của bộ lọc hiện tại (trả về mặc định)
- Trạng thái của các bộ lọc khác: **giữ nguyên, không thay đổi**

**Bước 3 — Lưu dữ liệu**

Hệ thống lưu toàn bộ thông tin sau vào bộ nhớ cục bộ của trình duyệt (localStorage):
- Bộ lọc hiện tại (在留資格, 申請種別, 分野). Riêng nội dung ô tìm kiếm **luôn được xóa trắng** trước khi lưu
- Các tags đang được chọn
- Toàn bộ trạng thái ghi đè thủ công của tất cả bộ lọc (đã được hợp nhất ở Bước 2)

**Bước 4 — Thông báo và cập nhật giao diện**

- Hiển thị thông báo xác nhận: **「保存しました。選択件数: X件」** (X = tổng số mẫu biểu đang được chọn)
- Nút **保存** chuyển về màu xanh (không còn thay đổi chưa lưu)

### 5.4 Cấu trúc dữ liệu localStorage

**Key:** `shinsei-shorui-data`

```json
{
  "version": 4,
  "lastFilters": {
    "visa": "tokutei1",
    "appType": "nintei",
    "sector": "kaigo",
    "searchText": ""
  },
  "lastTags": ["org:hojin"],
  "allOverrides": {
    "tokutei1|nintei|kaigo": {
      "101": true,
      "205": false
    },
    "gijinkoku|henko|": {
      "88": false
    }
  }
}
```

| Field | Mô tả |
|-------|-------|
| `version` | Phiên bản format. Chỉ đọc khi = 4, ngược lại bỏ qua và dùng trạng thái mặc định |
| `lastFilters` | Bộ lọc tại lần lưu cuối. `searchText` luôn là `""` |
| `lastTags` | Danh sách tags đang chọn tại lần lưu cuối |
| `allOverrides` | Toàn bộ ghi đè thủ công, key là filterKey, value là map `{form.no: boolean}` |

### 5.5 Phục hồi dữ liệu khi mở tab

```
Component mount
  → Đọc localStorage["shinsei-shorui-data"]
  → version ≠ 4 hoặc không tồn tại: dùng trạng thái mặc định (filter rỗng, không override)
  → version = 4:
       - Áp dụng lastFilters làm bộ lọc ban đầu
       - Áp dụng lastTags làm tags được chọn
       - Nạp allOverrides vào bộ nhớ
       - workingOverrides = allOverrides[currentFilterKey] || {}
```

### 5.6 Cảnh báo khi đổi filter có thay đổi chưa lưu

```
Người dùng thay đổi filter (visa/appType/sector) khi hasUnsavedChanges = true:
  → Hiện confirm dialog:
    "未保存の変更があります。変更を破棄して切り替えますか？"
    [キャンセル]  [OK]

  → Cancel: Không đổi filter, giữ nguyên trạng thái
  → OK: Bỏ workingOverrides hiện tại, chuyển sang filter mới
```

---

## 6. Nút 選択のみ / 未選択のみ

Hai nút này nằm trong **Toolbar** phía trên bảng, dùng để lọc view hiển thị của bảng (không ảnh hưởng đến dữ liệu thực tế).

| Nút | Hành vi |
|-----|---------|
| **選択のみ (X件)** | Chỉ hiển thị các hàng có checkbox = checked |
| **未選択のみ (Y件)** | Chỉ hiển thị các hàng có checkbox = unchecked |

- **Mặc định**: hiển thị chế độ `選択のみ`
- Số đếm **(X)** và **(Y)** trong nút được cập nhật **realtime** theo trạng thái checkbox và bộ lọc hiện tại
- Khi bấm vào nút đang active: không có thay đổi (nút giữ trạng thái hiện tại)
- Số đếm không phụ thuộc vào view đang chọn — X + Y = tổng số tài liệu đang hiển thị theo bộ lọc

---

## 7. Cảnh báo

### 7.1 Cảnh báo chưa chọn 在留資格

**Điều kiện hiển thị:** Người dùng chưa chọn 在留資格 (filter.visa = rỗng)

**Vị trí:** Ngay trên dữ liệu bảng, dưới header cột

**Nội dung:**
> ⚠ 在留資格を選択してください。現在すべての書類を表示しています。

**Kiểu hiển thị:** Banner cảnh báo với:
- Nền vàng nhạt `#FFF8DC`
- Viền `1px solid #E8D5A0`
- Viền trái đậm `4px solid` màu cam
- Icon `⚠` ở đầu

**Hành vi đi kèm:** Khi cảnh báo này hiển thị:
- **Toàn bộ** ~107 tài liệu được hiển thị (không lọc)
- **Không có** tài liệu nào được auto-check
- Người dùng vẫn có thể check/uncheck thủ công

### 7.2 Cảnh báo thay đổi chưa lưu khi đổi filter

**Điều kiện hiển thị:** Đổi bộ lọc (visa/appType/sector) khi hasUnsavedChanges = true

**Dạng:** `window.confirm()` (dialog trình duyệt)

**Nội dung:**
> 未保存の変更があります。変更を破棄して切り替えますか？

### 7.3 Thông báo lưu thành công

**Điều kiện hiển thị:** Sau khi bấm 保存 và lưu thành công

**Dạng:** `window.alert()` (dialog trình duyệt)

**Nội dung:**
> 保存しました。選択件数: X件

---

## 8. Logic hệ thống — Mô tả cho người dùng cuối

Mục này mô tả toàn bộ cơ chế hoạt động của tab theo ngôn ngữ nghiệp vụ, giúp người dùng hiểu hệ thống đang làm gì, tại sao lại hoạt động như vậy, và cách sử dụng hiệu quả nhất.

---

### 8.1 Hệ thống tự động xác định tài liệu cần thiết

Mục đích cốt lõi của tab này là giúp người dùng **không cần phải tự biết** mình cần nộp những tờ giấy nào. Thay vào đó, người dùng chỉ cần trả lời các câu hỏi về điều kiện của đương sự, hệ thống sẽ tự xác định và đánh dấu danh sách tài liệu phù hợp.

**Cơ chế hoạt động:**

Khi người dùng chọn **Tư cách lưu trú** và **Loại đơn**, hệ thống dò tìm trong cơ sở dữ liệu ~107 mẫu biểu và tự động **đánh dấu (check) tất cả các mẫu biểu có điều kiện khớp** với lựa chọn đó. Quá trình này xảy ra tức thì, không cần thao tác thêm.

**Tại sao chỉ chọn 2 điều kiện ban đầu chưa đủ chính xác?**

Nhiều mẫu biểu chỉ áp dụng cho một số lĩnh vực cụ thể (ví dụ: biểu mẫu dành riêng cho ngành nông nghiệp), hoặc chỉ áp dụng khi tổ chức là cá nhân kinh doanh thay vì pháp nhân. Nếu chỉ dừng ở 2 điều kiện cơ bản, hệ thống sẽ hiển thị **nhiều hơn mức cần thiết** — bao gồm cả những tài liệu không liên quan đến trường hợp cụ thể.

Vì vậy, người dùng nên chọn thêm:
- **Lĩnh vực ngành nghề** (nếu visa là Đặc định kỹ năng): để lọc ra các biểu mẫu theo ngành
- **Loại tổ chức** (法人 / 個人事業主): ảnh hưởng đến một số mẫu biểu đặc thù
- **Danh mục** (chỉ với 技術・人文知識・国際業務): phân loại theo nhóm doanh nghiệp
- **Hình thức tuyển dụng** (chỉ với Đặc định kỹ năng + nông/thủy sản): phân biệt trực tiếp hay phái cử

> **Nguyên tắc:** Càng chọn nhiều điều kiện chi tiết → danh sách tài liệu hiển thị càng chính xác, càng ít thừa.

---

### 8.2 Bộ lọc hoạt động theo thứ tự phụ thuộc

Các điều kiện lọc **không độc lập** với nhau mà hoạt động theo chuỗi phụ thuộc từ trên xuống. Điều này phản ánh đúng thực tế nghiệp vụ: một số điều kiện chỉ có ý nghĩa khi điều kiện cấp trên đã được xác định.

**Chuỗi phụ thuộc:**

```
Tư cách lưu trú (bắt buộc chọn đầu tiên)
    └─→ Loại đơn (chỉ có nghĩa sau khi biết tư cách lưu trú)
            └─→ Lĩnh vực (chỉ áp dụng cho Đặc định kỹ năng 1, 2)
                    └─→ Hình thức tuyển dụng (chỉ áp dụng khi lĩnh vực là nông nghiệp hoặc thủy sản)
         └─→ Loại tổ chức (áp dụng cho tất cả visa, sau khi có loại đơn)
                    └─→ Danh mục (chỉ áp dụng cho 技術・人文知識・国際業務, và không phải cá nhân kinh doanh nếu chọn danh mục 1)
```

**Hệ quả thực tế với người dùng:**

- Không thể chọn Loại đơn trước khi chọn Tư cách lưu trú
- Không thể chọn Lĩnh vực nếu visa không phải Đặc định kỹ năng, hoặc chưa chọn Loại đơn
- Khi đổi Tư cách lưu trú, tất cả điều kiện phía dưới bị xóa về mặc định — tránh mâu thuẫn dữ liệu
- Khi đổi Lĩnh vực sang ngành không phải nông/thủy sản, Hình thức tuyển dụng bị xóa

---

### 8.3 Danh sách tài liệu được chia theo 3 nhóm

Sau khi chọn điều kiện, các tài liệu phù hợp được hiển thị theo 3 nhóm, phản ánh tính chất của từng loại mẫu biểu:

**Nhóm A — 共通 省令様式・参考様式 (Mẫu biểu chung)**
Đây là các mẫu biểu theo quy định của Bộ Tư pháp (省令様式) và mẫu tham khảo (参考様式), áp dụng chung cho nhiều loại visa và loại đơn. Nhóm A luôn hiển thị khi điều kiện cơ bản (Tư cách lưu trú + Loại đơn) được chọn. Đây là nhóm quan trọng nhất, thường chiếm số lượng lớn nhất.

**Nhóm B — 分野参考様式 (Mẫu biểu theo lĩnh vực)**
Các mẫu biểu đặc thù cho từng ngành nghề trong Đặc định kỹ năng. Nhóm B **chỉ xuất hiện** khi visa là Đặc định kỹ năng (1 hoặc 2) **và** người dùng đã chọn một lĩnh vực cụ thể. Nếu chưa chọn lĩnh vực, nhóm B hoàn toàn bị ẩn.

**Nhóm C — 別表・派遣用書類 (Phụ lục và tài liệu phái cử)**
Các mẫu biểu điều kiện đặc biệt, chỉ xuất hiện khi các tổ hợp điều kiện cụ thể (loại tổ chức, danh mục, hình thức tuyển dụng) được thỏa mãn. Đây là nhóm có tính chọn lọc cao nhất.

> Nếu một nhóm không có mẫu biểu nào phù hợp với điều kiện hiện tại, tiêu đề nhóm đó sẽ tự động bị ẩn, không làm rối giao diện.

---

### 8.4 Người dùng có thể điều chỉnh thủ công

Danh sách tự động là điểm xuất phát dựa trên quy định chung, nhưng mỗi hồ sơ cụ thể có thể có những ngoại lệ. Vì vậy, người dùng có toàn quyền **điều chỉnh từng mẫu biểu**.

**Hai loại điều chỉnh có thể thực hiện:**

**(1) Bỏ check một mẫu biểu đã được tự động chọn**
Khi người dùng bỏ check một mẫu biểu nằm trong danh sách tự động, hệ thống ghi nhận đây là quyết định **chủ động loại bỏ**. Mẫu biểu đó sẽ hiển thị với dấu **[-]** màu đỏ trên ô check, và nền hàng chuyển sang màu nhạt có viền đỏ trái — giúp phân biệt rõ "đây là tài liệu tôi đã quyết định không nộp".

**(2) Thêm check một mẫu biểu chưa được tự động chọn**
Khi người dùng check một mẫu biểu không nằm trong danh sách tự động, hệ thống ghi nhận đây là **bổ sung thủ công**. Mẫu biểu đó hiển thị với dấu **[+]** màu xanh trên ô check, và nền hàng có viền xanh trái — giúp nhận biết "đây là tài liệu tôi thêm vào ngoài quy định chung".

**Khi nào dấu +/- biến mất?**

Nếu người dùng thay đổi rồi lại đưa về đúng trạng thái mà hệ thống đã tự chọn ban đầu, dấu +/- sẽ biến mất. Hệ thống hiểu rằng không còn sự khác biệt so với mặc định, và không cần lưu thông tin thừa.

> **Ví dụ:** Hệ thống tự check mẫu biểu số 5. Người dùng bỏ check → hiện [-]. Người dùng check lại → dấu [-] biến mất, trạng thái trở về mặc định.

---

### 8.5 Mỗi bộ điều kiện được quản lý độc lập

Một người dùng có thể xử lý nhiều loại hồ sơ khác nhau trong cùng một công việc. Ví dụ: hôm nay xử lý hồ sơ Đặc định kỹ năng, ngày mai xử lý hồ sơ gia hạn kỹ thuật nhân văn. Hệ thống được thiết kế để **mỗi tổ hợp điều kiện có bộ tài liệu riêng, không can thiệp lẫn nhau**.

**Cách hệ thống phân biệt các trường hợp:**

Hệ thống dùng tổ hợp **Tư cách lưu trú + Loại đơn + Lĩnh vực** làm "khóa nhận dạng" cho mỗi bộ tài liệu. Ví dụ:

| Khóa nhận dạng | Bộ tài liệu riêng |
|---------------|------------------|
| 特定技能1号 / 認定 / 介護 | Danh sách A + điều chỉnh thủ công dành riêng cho trường hợp này |
| 特定技能1号 / 認定 / 農業 | Danh sách khác + điều chỉnh thủ công riêng |
| 技術・人文・国際 / 更新 / (không có lĩnh vực) | Danh sách và điều chỉnh riêng |

Khi người dùng chuyển từ bộ điều kiện này sang bộ khác và quay lại, tất cả điều chỉnh thủ công của bộ cũ **vẫn được giữ nguyên**.

> **Lưu ý thực tế:** Các điều chỉnh thủ công (bộ lọc Tags như Loại tổ chức, Danh mục) **không** ảnh hưởng đến khóa nhận dạng — chúng ảnh hưởng đến *danh sách hiển thị* nhưng điều chỉnh thủ công vẫn được gắn với tổ hợp Tư cách lưu trú + Loại đơn + Lĩnh vực.

---

### 8.6 Lọc nhanh danh sách bằng ô tìm kiếm

Khi danh sách tài liệu dài (có thể lên đến vài chục mẫu biểu), người dùng có thể dùng **ô tìm kiếm** để nhanh chóng tìm một mẫu biểu cụ thể bằng từ khóa theo tên hoặc mã hiệu.

Ô tìm kiếm hoạt động theo thời gian thực — gõ đến đâu, danh sách lọc đến đó, không cần bấm Enter hay nút Tìm kiếm.

**Một số lưu ý quan trọng về tìm kiếm:**
- Tìm kiếm chỉ thu hẹp **danh sách đang hiển thị**, không thay đổi trạng thái check của bất kỳ mẫu biểu nào
- Tìm kiếm hoạt động song song với bộ lọc điều kiện — chỉ tìm trong phạm vi tài liệu đã được lọc ra
- Khi xóa từ khóa tìm kiếm, toàn bộ danh sách trở lại bình thường
- Nội dung ô tìm kiếm **không được lưu** khi bấm 保存 — sau khi lưu, ô tìm kiếm tự động bị xóa trắng. Đây là thiết kế có chủ đích: tìm kiếm là công cụ tra cứu tạm thời, không phải bộ lọc cần ghi nhớ lâu dài

---

### 8.7 Nút 選択のみ / 未選択のみ — Tập trung vào phần cần xem

Khi danh sách có nhiều mẫu biểu, việc xem lại toàn bộ có thể gây khó tập trung. Hai nút này cho phép người dùng **thu gọn danh sách về chỉ những gì mình cần xem**:

**「選択のみ」(Chỉ hiện tài liệu đã chọn)**
Ẩn toàn bộ tài liệu chưa check. Hữu ích khi người dùng muốn **xem lại toàn bộ danh sách sẽ nộp** để kiểm tra lần cuối trước khi lưu hoặc in ra.

**「未選択のみ」(Chỉ hiện tài liệu chưa chọn)**
Ẩn toàn bộ tài liệu đã check. Hữu ích khi người dùng muốn **xem những gì đang bị loại bỏ** — để cân nhắc xem có cần bổ sung thêm không.

Số đếm hiển thị trong ngoặc của mỗi nút **(X件)** được cập nhật tức thì theo mọi thay đổi checkbox, giúp người dùng nắm bắt nhanh tình trạng tổng thể mà không cần đếm thủ công.

> Hai nút này chỉ thay đổi **cách hiển thị** — không ảnh hưởng đến trạng thái check thực tế của bất kỳ mẫu biểu nào.

---

### 8.8 Trạng thái chưa lưu và nút Lưu

Hệ thống liên tục theo dõi xem người dùng có thay đổi nào **khác so với lần lưu gần nhất** không. Nếu có, nút **保存** chuyển sang màu cam như một lời nhắc nhở trực quan — người dùng không cần nhớ xem mình đã lưu chưa.

**Các hành động tạo ra trạng thái "chưa lưu":**
- Check hoặc bỏ check bất kỳ mẫu biểu nào

**Các hành động KHÔNG tạo ra trạng thái "chưa lưu":**
- Thay đổi điều kiện lọc (hệ thống tải dữ liệu đã lưu tương ứng với bộ điều kiện mới)
- Gõ vào ô tìm kiếm
- Bấm nút 選択のみ / 未選択のみ
- Cuộn trang, thu gọn/mở rộng bộ lọc

**Khi thay đổi điều kiện lọc trong khi chưa lưu:**

Nếu người dùng thay đổi bộ điều kiện (Tư cách lưu trú / Loại đơn / Lĩnh vực) trong khi đang có thay đổi chưa lưu, hệ thống sẽ **hỏi xác nhận** trước khi chuyển. Đây là cơ chế bảo vệ, tránh mất công điều chỉnh mà không hay biết.

- Nếu người dùng chọn **Hủy**: bộ điều kiện không đổi, mọi thứ giữ nguyên
- Nếu người dùng chọn **Đồng ý**: điều chỉnh thủ công hiện tại bị bỏ qua (không lưu), chuyển sang bộ điều kiện mới

---

### 8.9 Quá trình lưu và phục hồi dữ liệu

**Khi lưu (bấm 保存):**

Hệ thống lưu lại 3 loại thông tin:
1. **Bộ điều kiện hiện tại** (Tư cách lưu trú, Loại đơn, Lĩnh vực, Tags) — để lần sau mở lại tự động áp dụng ngay bộ lọc này
2. **Các điều chỉnh thủ công** cho bộ điều kiện hiện tại — để phục hồi đúng trạng thái check của từng mẫu biểu
3. **Các điều chỉnh thủ công** của tất cả bộ điều kiện khác đã lưu trước đó — **giữ nguyên, không bị xóa**

Sau khi lưu thành công, hệ thống hiển thị thông báo xác nhận kèm tổng số mẫu biểu đang được chọn.

**Khi mở lại tab:**

Hệ thống tự động đọc dữ liệu đã lưu và:
1. Áp dụng lại bộ điều kiện từ lần lưu cuối (Tư cách lưu trú, Loại đơn, Lĩnh vực, Tags)
2. Hiển thị danh sách tài liệu tương ứng với điều kiện đó
3. Áp dụng lại các điều chỉnh thủ công đã lưu cho bộ điều kiện này

Người dùng sẽ thấy màn hình **y hệt lần lưu cuối** — không cần chọn lại từ đầu.

**Phạm vi lưu trữ và giới hạn:**

Dữ liệu được lưu trong bộ nhớ cục bộ của trình duyệt (localStorage). Điều này đồng nghĩa với:

| Tình huống | Kết quả |
|-----------|---------|
| Đóng tab hoặc cửa sổ trình duyệt rồi mở lại | ✅ Dữ liệu được phục hồi |
| Tắt máy tính rồi bật lại, mở trình duyệt | ✅ Dữ liệu được phục hồi |
| Bấm F5 làm mới trang | ✅ Dữ liệu được phục hồi |
| Xóa lịch sử / cache trình duyệt | ❌ Dữ liệu bị mất hoàn toàn |
| Mở trên máy tính khác | ❌ Không đồng bộ — dữ liệu là riêng của từng máy |
| Mở bằng trình duyệt khác trên cùng máy | ❌ Không đồng bộ — mỗi trình duyệt lưu riêng |
| Dùng chế độ Ẩn danh (Incognito) | ⚠ Dữ liệu chỉ tồn tại trong phiên — đóng cửa sổ là mất |

---

### 8.10 Sơ đồ luồng sử dụng đầy đủ

```
╔══════════════════════════════════════════════════════════╗
║           MỞ TAB オンライン作成書類                        ║
╚══════════════════════════════════════════════════════════╝
                          │
                          ▼
          ┌───────────────────────────────┐
          │ Có dữ liệu đã lưu?            │
          └───────────────────────────────┘
              │ Có                  │ Không
              ▼                     ▼
   ┌──────────────────┐   ┌──────────────────────┐
   │ Tự động khôi phục│   │ Hiển thị trạng thái  │
   │ bộ lọc + check   │   │ mặc định (chưa chọn) │
   └──────────────────┘   └──────────────────────┘
              │                     │
              └──────────┬──────────┘
                         ▼
          ┌───────────────────────────────┐
          │ Chọn Tư cách lưu trú          │ (bắt buộc)
          └───────────────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────┐
          │ Chọn Loại đơn                 │ (bắt buộc)
          └───────────────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────┐
          │ Hệ thống tự động check        │
          │ các tài liệu phù hợp (Group A)│
          └───────────────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────┐         ┌─────────────────────┐
          │ Chọn thêm điều kiện? ─────────┼────Yes──▶ Lĩnh vực / Tags     │
          └───────────────────────────────┘         │ → Lọc tinh hơn      │
                    │ No                            │ → Group B/C hiện    │
                    │◀──────────────────────────────┘
                    ▼
          ┌───────────────────────────────┐
          │ Xem lại danh sách tài liệu    │
          │ [Có thể dùng tìm kiếm]        │
          │ [Có thể bật 選択のみ]         │
          └───────────────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────┐
          │ Cần điều chỉnh thủ công?      │
          └───────────────────────────────┘
              │ Có                  │ Không
              ▼                     │
   ┌──────────────────────┐         │
   │ Check / Bỏ check     │         │
   │ từng mẫu biểu        │         │
   │ (badge +/- hiện lên) │         │
   └──────────────────────┘         │
              │                     │
              └──────────┬──────────┘
                         ▼
          ┌───────────────────────────────┐
          │ Nút 保存 chuyển cam           │
          │ → Bấm 保存 để lưu            │
          └───────────────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────┐
          │ Thông báo: 保存しました X件   │
          │ Nút 保存 chuyển về xanh       │
          └───────────────────────────────┘
                         │
                         ▼
          ┌───────────────────────────────┐
          │ Chuyển sang bộ điều kiện khác?│
          └───────────────────────────────┘
              │ Có                  │ Không
              ▼                     ▼
   ┌──────────────────┐        ┌──────────┐
   │ Lặp lại từ bước  │        │  Kết thúc │
   │ "Chọn điều kiện" │        └──────────┘
   └──────────────────┘
```

---

### 8.11 Luồng điều chỉnh checkbox thủ công

Mô tả chi tiết cơ chế khi người dùng click vào ô check của một mẫu biểu bất kỳ.

```
Người dùng click vào checkbox của mẫu biểu [No. X]
                          │
                          ▼
          ┌───────────────────────────────────┐
          │ Hệ thống auto-check mẫu biểu X?  │
          └───────────────────────────────────┘
              │ Có (auto = true)     │ Không (auto = false)
              ▼                      ▼
   ┌──────────────────────┐  ┌──────────────────────┐
   │ Trạng thái hiện tại  │  │ Trạng thái hiện tại  │
   │ của X là gì?         │  │ của X là gì?         │
   └──────────────────────┘  └──────────────────────┘
       │ checked  │ unchecked      │ checked   │ unchecked
       ▼          ▼               ▼            ▼
   ┌────────┐  ┌──────────────┐ ┌──────────────┐ ┌────────┐
   │ Bỏ    │  │ Check lại    │ │ Bỏ check     │ │ Check  │
   │ check  │  │ (= auto)     │ │ (= auto)     │ │ lại    │
   └────────┘  └──────────────┘ └──────────────┘ └────────┘
       │            │                 │               │
       ▼            ▼                 ▼               ▼
   ┌────────┐  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐
   │override│  │ Xóa override │ │ Xóa override │ │ override[X]    │
   │[X]=false│ │ (trả về mặc │ │ (trả về mặc  │ │ = true         │
   │badge[-]│  │  định)       │  định)         │ │ badge [+]      │
   │viền đỏ │  │ Không badge  │ │ Không badge  │ │ viền xanh      │
   └────────┘  └──────────────┘ └──────────────┘ └────────────────┘
       │            │                 │               │
       └────────────┴─────────┬───────┴───────────────┘
                               ▼
                ┌──────────────────────────────┐
                │ So sánh workingOverrides      │
                │ với savedData.allOverrides    │
                │ → Có khác? → nút 保存 = cam  │
                │ → Giống?  → nút 保存 = xanh  │
                └──────────────────────────────┘
```

---

### 8.12 Luồng thay đổi bộ lọc (visa / appType / sector)

Mô tả hành vi hệ thống khi người dùng thay đổi bất kỳ dropdown nào trong Layer 1 hoặc Layer 2.

```
Người dùng thay đổi dropdown
(visa / appType / sector)
              │
              ▼
┌─────────────────────────────┐
│ hasUnsavedChanges = true?   │
└─────────────────────────────┘
      │ Không              │ Có
      ▼                    ▼
┌───────────┐   ┌──────────────────────────────────┐
│ Chuyển    │   │ Hiện confirm dialog:              │
│ filter    │   │ "未保存の変更があります。           │
│ ngay      │   │  変更を破棄して切り替えますか？"   │
└───────────┘   └──────────────────────────────────┘
      │                    │
      │           │ Cancel          │ OK
      │           ▼                 ▼
      │    ┌──────────────┐ ┌────────────────────┐
      │    │ Giữ nguyên   │ │ Bỏ workingOverrides│
      │    │ filter cũ    │ │ → Chuyển filter mới│
      │    │ (không đổi)  │ └────────────────────┘
      │    └──────────────┘         │
      │                             │
      └─────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────────┐
          │ Tính lại filterKey mới           │
          │ = "visa|appType|sector"          │
          └──────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────────┐
          │ Reset các trường phụ thuộc       │
          │ (theo quy tắc dependency chain)  │
          └──────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────────┐
          │ Tải overrides của filterKey mới  │
          │ từ allOverrides (nếu có)         │
          └──────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────────┐
          │ Tính lại auto-check theo filter  │
          │ mới → Cập nhật danh sách bảng   │
          └──────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────────┐
          │ Nút 保存 = xanh                 │
          │ (workingOverrides = savedData)   │
          └──────────────────────────────────┘
```

---

### 8.13 Luồng lưu và phục hồi dữ liệu (localStorage)

Mô tả chi tiết quá trình ghi và đọc dữ liệu từ bộ nhớ trình duyệt.

```
╔══════════════════════════════════╗
║         LUỒNG LƯU (保存)         ║
╚══════════════════════════════════╝

Người dùng bấm nút 保存
              │
              ▼
┌──────────────────────────────────┐
│ Thu thập workingOverrides        │
│ (chỉ các form có override ≠ auto)│
└──────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│ workingOverrides rỗng?           │
└──────────────────────────────────┘
      │ Có                │ Không
      ▼                   ▼
┌───────────────┐  ┌──────────────────────────┐
│ Xóa entry của │  │ Cập nhật entry của       │
│ filterKey hiện│  │ filterKey hiện tại với   │
│ tại khỏi      │  │ workingOverrides mới      │
│ allOverrides  │  └──────────────────────────┘
└───────────────┘         │
        │                 │
        └────────┬─────────┘
                 ▼
┌──────────────────────────────────┐
│ Ghi vào localStorage:            │
│  key: "shinsei-shorui-data"      │
│  {                               │
│    version: 4,                   │
│    lastFilters: {visa, appType,  │
│      sector, searchText: ""},    │
│    lastTags: [...],              │
│    allOverrides: {               │
│      "key1": {formNo: bool},     │
│      "key2": {formNo: bool},     │
│      ...tất cả filterKey khác    │
│    }                             │
│  }                               │
└──────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│ Hiển thị: 保存しました X件       │
│ Nút 保存 chuyển về xanh         │
│ hasUnsavedChanges = false        │
└──────────────────────────────────┘


╔══════════════════════════════════╗
║      LUỒNG PHỤC HỒI (Mount)      ║
╚══════════════════════════════════╝

Component khởi động (tab được mở)
              │
              ▼
┌──────────────────────────────────┐
│ Đọc localStorage                 │
│ ["shinsei-shorui-data"]          │
└──────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│ Tồn tại VÀ version = 4?         │
└──────────────────────────────────┘
      │ Không                │ Có
      ▼                      ▼
┌───────────────┐  ┌──────────────────────────┐
│ Dùng mặc định │  │ Áp dụng lastFilters      │
│ - filter rỗng │  │ Áp dụng lastTags         │
│ - không có    │  │ Nạp allOverrides vào bộ  │
│   override    │  │ nhớ                      │
└───────────────┘  └──────────────────────────┘
        │                    │
        │                    ▼
        │         ┌──────────────────────────┐
        │         │ filterKey hiện tại =     │
        │         │ "visa|appType|sector"    │
        │         │                          │
        │         │ workingOverrides =       │
        │         │ allOverrides[filterKey]  │
        │         │ || {}                    │
        │         └──────────────────────────┘
        │                    │
        └──────────┬──────────┘
                   ▼
    ┌──────────────────────────────────┐
    │ Tính auto-check theo filter hiện│
    │ Áp dụng workingOverrides lên    │
    │ auto-check → finalChecked       │
    └──────────────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │ Render bảng với trạng thái       │
    │ y hệt lần lưu cuối              │
    │ hasUnsavedChanges = false        │
    └──────────────────────────────────┘
```

---

### 8.14 Luồng hiển thị tài liệu theo bộ lọc (Filter → Display)

Mô tả cách hệ thống quyết định tài liệu nào xuất hiện trong bảng sau mỗi lần filter thay đổi.

```
Bộ lọc thay đổi (bất kỳ thay đổi nào)
              │
              ▼
┌─────────────────────────────────────────┐
│ Duyệt qua tất cả ~107 mẫu biểu         │
│ (vòng lặp cho từng form)                │
└─────────────────────────────────────────┘
              │
              ▼  [Với mỗi form]
┌─────────────────────────────────────────┐
│ CHECK 1: visaMatch                      │
│ form.visa = null → PASS                 │
│ form.visa ≠ null → filters.visa ∈ form.visa[]?│
└─────────────────────────────────────────┘
      │ FAIL → ẩn form       │ PASS
                             ▼
              ┌─────────────────────────────────────────┐
              │ CHECK 2: appTypeMatch                   │
              │ form.appType = null → PASS              │
              │ form.appType ≠ null → filters.appType   │
              │                       ∈ form.appType[]? │
              └─────────────────────────────────────────┘
                    │ FAIL → ẩn        │ PASS
                                       ▼
                        ┌─────────────────────────────────┐
                        │ CHECK 3: sectorMatch            │
                        │ form.sector = null → PASS       │
                        │ form.sector ≠ null:             │
                        │   visa phải là tokutei1/2       │
                        │   VÀ sector đã được chọn        │
                        │   VÀ filters.sector ∈ form.sector[]│
                        └─────────────────────────────────┘
                              │ FAIL → ẩn    │ PASS
                                             ▼
                                ┌────────────────────────────┐
                                │ CHECK 4: tagMatch          │
                                │ form.tags = [] → PASS      │
                                │ form.tags ≠ []:            │
                                │ Nhóm tag theo group        │
                                │ AND giữa các group         │
                                │ OR trong cùng group        │
                                └────────────────────────────┘
                                      │ FAIL → ẩn  │ PASS
                                                   ▼
                                        ┌──────────────────────┐
                                        │ CHECK 5: searchMatch │
                                        │ searchText rỗng→PASS │
                                        │ searchText ≠ rỗng:   │
                                        │ ⊆ form_no            │
                                        │ HOẶC ⊆ form_name     │
                                        │ (không phân biệt hoa)│
                                        └──────────────────────┘
                                              │ FAIL→ẩn │ PASS
                                                        ▼
                                              ┌──────────────────┐
                                              │ HIỂN THỊ form    │
                                              │ trong bảng       │
                                              │ (theo nhóm A/B/C)│
                                              └──────────────────┘

Sau khi duyệt hết tất cả form:
┌────────────────────────────────────────────────┐
│ Cập nhật:                                      │
│  • Số đếm nút: 選択のみ(Y) / 未選択のみ(Z)     │
│  • Group header: ẩn nhóm không có form nào     │
│  • auto-check list: tất cả form đang hiển thị  │
└────────────────────────────────────────────────┘
```
