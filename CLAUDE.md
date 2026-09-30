# CLAUDE.md

## 작업 방식
- 사용자는 한국어로 짧게 말하고 오타가 잦음. 답변은 한국어로, 짧고 실용적으로.
- 커밋 메시지는 한글. 커밋·푸시는 사용자 확인 후에만 진행.
- 광고, 추적 스크립트, 불필요한 외부 요소는 넣지 않는다.

## 프로젝트 개요
- STINGERNATION(자동차 동호회)의 공지·규칙과 차량 관리 정보를 보여주는 **단일 페이지 정적 사이트**.
- 빌드 도구·프레임워크·패키지 매니저 없음. 순수 HTML/CSS/JS (바닐라).
- 콘텐츠는 `data/*.json`에 있고, `js/app.js`가 fetch해서 `index.html`의 빈 컨테이너에 렌더링한다.
- 배포: GitHub Pages로 추정 (`app.js` 오류 문구에 언급). 워크플로 파일(`.github/`) 없음 → 상세 설정은 **확인 필요**.
- 저장소: `Newjackswing/stingernation`, 기본 브랜치 `main`.

## 구조
```
index.html          # 뼈대만 있음. 컨테이너 div + js/app.js 로드
css/style.css       # 전체 스타일 (약 900줄, 반응형 미디어쿼리 다수)
js/app.js           # JSON 로드 + 렌더 함수 + 사이드 네비/스크롤 하이라이트
data/
  site.json         # 제목, 부제, 로고 경로, 푸터
  notice.json       # 공지: 날짜, 프로필 형식, 규칙 목록
  vehicles.json     # 차량별 엔진오일 사양 (t20, t25, t33, t22, bmwx7)
  maintenance.json  # 소모품 교체 주기
  fluids.json       # 유체 용량/규격
  links.json        # 외부 링크 (인스타그램, DAG 펌웨어)
assets/             # logo.png, favicon.png
HKG2G_c18-7g3.zip   # DAG 펌웨어 (exe 1개 포함, 약 0.9MB)
```

`index.html` 컨테이너 id: `sidenav`, `site-header`, `notice`, `vehicles`, `maintenance`, `fluids`, `links`, `footer`.

## 페이지/링크 방식
- 페이지는 `index.html` 하나. 별도 규칙 페이지 없음 (멀티 페이지 구조 아님).
- 섹션 이동은 앵커(`#id`) 링크. 사이드 네비(`renderSideNav`)가 앵커 목록을 만들고, 스크롤 위치에 따라 active 표시.
- 섹션 id: `top`, `sec-notice`, 차량별 `vehicles[].id`, `sec-cycle`, `sec-fluid`, `sec-<links.id>`.
- 각 섹션 하단에 `↑ 맨 위로`(`#top`) 링크.
- 외부 링크는 `target="_blank" rel="noopener noreferrer"`.

## 콘텐츠 수정 방법
대부분 **JSON만 고치면 되고 JS/HTML은 건드릴 필요 없음.**

| 하고 싶은 것 | 수정 파일 | 방법 |
|---|---|---|
| 공지 날짜/제목 | `notice.json` | `date`, `title` |
| 규칙 추가/수정 | `notice.json` `rules[]` | `{number, text, type}`. `type`: `normal` 또는 `warning`(강조 표시). 번호는 문자열 `"16"` 형태로 직접 관리 |
| 프로필 양식 | `notice.json` `profile[]` | 문자열 배열 |
| 차량 추가 | `vehicles.json` `vehicles[]` | `{id, name, model, specs[], additionalSpecs[]?}`. `specs[].type`: `normal/cycle/qty/spec/warn/note` (그 외는 기본 스타일). 사이드 네비/개요 앵커는 자동 생성 |
| 교체 주기 행 | `maintenance.json` | 키가 한글 고정: `품목`, `교체 주기`, `비고` |
| 유체 행 | `fluids.json` | 키 고정: `품목`, `용량`, `규격 / 타입` |
| 링크 추가 | `links.json` | `{id, title, label, url, description, icon}`. `icon`은 `instagram`이면 📸, 그 외 ⚙ |
| 제목/푸터/로고 | `site.json` | |

주의 (수정 시 함께 확인):
- `renderSideNav`에 `sec-instagram`, `sec-firmware`가 **하드코딩**되어 있음. `links.json`에 항목을 추가/삭제하면 `js/app.js`의 네비 목록도 같이 고쳐야 함.
- 사이드 네비 라벨은 `name`에서 ` TURBO`→`T`, ` DIESEL`→`D`로 치환. 차량 이름 규칙이 바뀌면 확인.
- 사이드 네비 구분선 위치는 인덱스(`i === 1`, `data.vehicles.length + 2`)로 계산 → 항목 구조를 바꾸면 같이 수정.
- `notice.json`의 `rules` 끝에 `number`가 빈 문자열인 항목 5개가 있음 (빈 규칙이 화면에 출력될 수 있음). 의도 여부 **확인 필요**.
- 모든 값은 `escapeHtml`로 이스케이프됨 → JSON에 HTML 태그를 넣어도 렌더되지 않음. 이모지/일반 텍스트만 사용.
- 새 종류의 섹션이 필요하면: JSON 추가 → `DATA_FILES`에 등록 → `render*` 함수 작성 → `init()`의 `Promise.all`/호출 추가 → `index.html`에 컨테이너 div 추가 → `renderSideNav` 항목 추가.
- 다른 언어/외부 콘텐츠의 정확성(오일 규격, 주기 등)은 사용자가 준 값 그대로 유지. 임의로 바꾸지 말 것.

## 디자인·스타일 관례
- 폰트: Google Fonts의 `Bebas Neue`(브랜드 타이틀), `Noto Sans KR`(본문). `index.html`에서 로드.
- 색상은 `css/style.css` 상단 `:root` 변수 사용 (`--accent` 주황 `#ff9f00`, `--accent-strong`, `--red`, `--green`, `--blue`, `--purple`, `--bg`, `--surface`, `--border` 등). 새 색을 하드코딩하기보다 변수 재사용.
- 카드형 섹션(`.section`, `.notice-section`): 흰 배경, 둥근 모서리(`--radius: 16px`), 그림자.
- 반응형: 주요 브레이크포인트 `1300px`(사이드 네비 숨김), `900px`(모바일 네비 가로 스크롤), `650px`, `520px`, `360px`.
- 톤: 한국어, 존댓말/간결한 안내체. 언어 `lang="ko"`.
- 새 스타일은 `style.css` 안에 기존 섹션 주석 구분에 맞춰 추가. 별도 CSS 프레임워크 도입 금지.

## 미리보기 / 배포
- **`index.html`을 파일로 직접 열면 `fetch`가 막혀서 데이터가 안 뜸.** 로컬 서버 필요:
  ```
  python3 -m http.server 8000   # 저장소 루트에서, 브라우저로 http://localhost:8000
  ```
- 데이터는 `fetch(..., { cache: 'no-store' })`로 읽음 (캐시 안 됨).
- 배포는 `main`에 푸시하면 반영되는 GitHub Pages 방식으로 추정 → 정확한 설정·URL **확인 필요**.
- 테스트/린트/CI: 없음. 수정 후 JSON 문법(`python3 -m json.tool data/xxx.json`)과 브라우저 렌더를 직접 확인.

## 주의할 점
- 펌웨어 링크(`links.json`)는 `raw.githubusercontent.com/.../main/HKG2G_c18-7g3.zip`을 가리킴. zip 파일명을 바꾸거나 이동하면 링크도 같이 수정. 새 버전 교체 시 파일명 변경 여부 확인.
- 펌웨어 zip은 바이너리(exe 포함). 내용 열람·수정 금지, 교체는 사용자 요청 시에만.
- 차량 목록에 스팅어 외 `BMW X7`도 포함되어 있음 (동호회 정보 용도로 추정, 확인 필요).
- JSON은 UTF-8, 들여쓰기 2칸 유지. 키 이름(한글 포함)은 JS가 그대로 참조하므로 바꾸지 말 것.
- 개인정보: 공지에 차량번호 뒤 4자리는 선택사항. 실제 개인 정보를 JSON에 넣지 않는다.
