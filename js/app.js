const DATA_FILES = {
  site: 'data/site.json',
  notice: 'data/notice.json',
  vehicles: 'data/vehicles.json',
  maintenance: 'data/maintenance.json',
  fluids: 'data/fluids.json',
  links: 'data/links.json'
};

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path} 로드 실패: HTTP ${response.status}`);
  return response.json();
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function specClass(type) {
  return ['cycle', 'qty', 'spec', 'warn', 'note'].includes(type) ? type : '';
}

function renderHeader(site) {
  document.querySelector('#site-header').innerHTML = `
    <div class="logo-wrap">
      <img src="${escapeHtml(site.logo)}" alt="STINGERNATION 로고" class="site-logo">
    </div>
    <header class="header" id="top">
      <div class="brand">${escapeHtml(site.title)}</div>
      <div class="subtitle">${escapeHtml(site.subtitle)}</div>
    </header>
  `;
}

function renderNotice(notice) {
  document.querySelector('#notice').innerHTML = `
    <section class="notice-section" id="sec-notice">
      <div class="section-title"><span class="icon">📢</span> 공지사항</div>
      <div class="notice-box">
        <div class="notice-header">
          <div class="notice-brand">${escapeHtml(notice.title)}</div>
          <div class="notice-date">${escapeHtml(notice.date)}</div>
        </div>
        <div class="notice-block">
          <div class="notice-block-title">프로필 기준</div>
          <div class="notice-profile">
            ${notice.profile.map(x => `<code>${escapeHtml(x)}</code>`).join('<br>')}
          </div>
        </div>
        <div class="notice-block">
          <div class="notice-block-title">공지사항 / 프로필 시행 규칙</div>
          <ol class="notice-rules">
            ${notice.rules.map(rule => `
              <li class="${rule.type === 'warning' ? 'warning' : ''}">
                <span class="rnum">${escapeHtml(rule.number)}</span>
                <span>${escapeHtml(rule.text)}</span>
              </li>
            `).join('')}
          </ol>
        </div>
      </div>
    </section>
  `;
}

function renderVehicles(data) {
  const container = document.querySelector('#vehicles');
  const anchors = data.vehicles.map(v => `
    <a href="#${escapeHtml(v.id)}" class="eng-anchor">
      ${escapeHtml(v.name)}
      <span>${escapeHtml(v.model)}</span>
    </a>
  `).join('');

  container.innerHTML = `
    <section class="section" id="engine-overview">
      <div class="section-title"><span class="icon">🛢️</span> 엔진 오일 사양</div>
      <div class="engine-overview"><div class="eng-anchors">${anchors}</div></div>
    </section>

    ${data.vehicles.map(v => renderVehicle(v)).join('')}
  `;
}

function renderVehicle(vehicle) {
  const rows = vehicle.specs.map(spec => `
    <tr>
      <td class="item">${escapeHtml(spec.label)}</td>
      <td class="${specClass(spec.type)}">${escapeHtml(spec.value)}</td>
    </tr>
  `).join('');

  const additional = vehicle.additionalSpecs?.length ? `
    <div class="table-wrap subtable">
      <table>
        <thead><tr><th>항목</th><th>내용</th></tr></thead>
        <tbody>
          ${vehicle.additionalSpecs.map(spec => `
            <tr><td class="item">${escapeHtml(spec.label)}</td><td class="${specClass(spec.type)}">${escapeHtml(spec.value)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  return `
    <section class="section vehicle-section" id="${escapeHtml(vehicle.id)}">
      <div class="eng-sec-title">
        <span class="eng-disp">${escapeHtml(vehicle.name)}</span>
        <span class="eng-model">${escapeHtml(vehicle.model)}</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>항목</th><th>내용</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${additional}
      <a href="#top" class="back-top">↑ 맨 위로</a>
    </section>
  `;
}

function renderMaintenance(data) {
  const container = document.querySelector('#maintenance');
  container.innerHTML = `
    <section class="section" id="sec-cycle">
      <div class="section-title"><span class="icon">🔧</span> 소모품 교체 주기</div>
      <div class="data-table">
        <table>
          <thead><tr><th>품목</th><th>교체 주기</th><th>비고</th></tr></thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td class="item">${escapeHtml(item['품목'])}</td>
                <td>${escapeHtml(item['교체 주기'])}</td>
                <td>${escapeHtml(item['비고'])}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <a href="#top" class="back-top">↑ 맨 위로</a>
    </section>
  `;
}

function renderFluids(data) {
  const container = document.querySelector('#fluids');
  container.innerHTML = `
    <section class="section" id="sec-fluid">
      <div class="section-title"><span class="icon">🧪</span> 유체 용량 및 규격</div>
      <div class="data-table">
        <table>
          <thead><tr><th>품목</th><th>용량</th><th>규격 / 타입</th></tr></thead>
          <tbody>
            ${data.items.map(item => `
              <tr>
                <td class="item">${escapeHtml(item['품목'])}</td>
                <td>${escapeHtml(item['용량'])}</td>
                <td>${escapeHtml(item['규격 / 타입'])}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <a href="#top" class="back-top">↑ 맨 위로</a>
    </section>
  `;
}

function renderLinks(data) {
  const container = document.querySelector('#links');
  container.innerHTML = data.items.map(item => `
    <section class="section" id="sec-${escapeHtml(item.id)}">
      <div class="section-title"><span class="icon">${item.icon === 'instagram' ? '📸' : '⚙'}</span> ${escapeHtml(item.title)}</div>
      <div class="link-list">
        <a class="external-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
          <div class="link-icon">${item.icon === 'instagram' ? '◎' : '⚙'}</div>
          <div>
            <div class="link-title">${escapeHtml(item.label)}</div>
            <div class="link-sub">${escapeHtml(item.description)}</div>
          </div>
          <div class="link-arrow">→</div>
        </a>
      </div>
    </section>
  `).join('');
}

function renderFooter(site) {
  document.querySelector('#footer').innerHTML = `<footer>${escapeHtml(site.footer)}</footer>`;
}

function renderSideNav(data) {
  const items = [
    ['top', 'TOP', '처음'],
    ['sec-notice', '📢', '공지'],
    ...data.vehicles.map(v => [v.id, v.name.replace(' TURBO', 'T').replace(' DIESEL', 'D'), v.model]),
    ['sec-cycle', '🔧', '교체주기'],
    ['sec-fluid', '🧪', '유체용량'],
    ['sec-instagram', '📸', '인스타그램'],
    ['sec-firmware', '⚙', 'DAG펌웨어']
  ];

  const nav = document.querySelector('#sidenav');

  nav.innerHTML = items.map(([id, label, sub], i) => `
    ${i === 1 || i === data.vehicles.length + 2 ? '<div class="nav-divider"></div>' : ''}
    <a href="#${escapeHtml(id)}" data-target="${escapeHtml(id)}">${escapeHtml(label)}<span class="nav-sub">${escapeHtml(sub)}</span></a>
  `).join('');

  const links = [...nav.querySelectorAll('a[data-target]')];
  const sections = links
    .map(link => ({
      id: link.dataset.target,
      link,
      element: document.getElementById(link.dataset.target)
    }))
    .filter(item => item.element);

  let activeId = null;
  let ticking = false;

  function setActive(id, autoScrollNav = true) {
    if (!id || id === activeId) return;

    activeId = id;

    // 반드시 하나만 활성화
    links.forEach(link => link.classList.remove('active'));

    const activeLink = links.find(link => link.dataset.target === id);
    if (!activeLink) return;

    activeLink.classList.add('active');

    // 모바일에서 활성 메뉴가 네비게이션 영역 밖으로 나간 경우에만 가로 이동
    if (autoScrollNav && window.innerWidth <= 900) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      if (
        linkRect.left < navRect.left + 6 ||
        linkRect.right > navRect.right - 40
      ) {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }

  function onScroll() {
    const mobileOffset = window.innerWidth <= 900 ? nav.getBoundingClientRect().bottom + 12 : 120;

    // 네비게이션 기준선을 지나간 섹션 중 가장 마지막 섹션 하나만 선택
    let current = sections[0]?.id;

    for (const item of sections) {
      if (item.element.getBoundingClientRect().top <= mobileOffset) {
        current = item.id;
      } else {
        break;
      }
    }

    // 페이지 최하단에서는 마지막 메뉴 선택
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1]?.id;
    }

    setActive(current, true);
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      setActive(link.dataset.target, false);
    });
  });

  window.addEventListener('scroll', () => {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', onScroll);
  onScroll();
}
async function init() {
  try {
    const [site, notice, vehicles, maintenance, fluids, links] = await Promise.all([
      loadJson(DATA_FILES.site),
      loadJson(DATA_FILES.notice),
      loadJson(DATA_FILES.vehicles),
      loadJson(DATA_FILES.maintenance),
      loadJson(DATA_FILES.fluids),
      loadJson(DATA_FILES.links)
    ]);

    renderHeader(site);
    renderNotice(notice);
    renderVehicles(vehicles);
    renderMaintenance(maintenance);
    renderFluids(fluids);
    renderLinks(links);
    renderFooter(site);
    renderSideNav(vehicles);
  } catch (error) {
    console.error(error);
    document.querySelector('main').innerHTML = `
      <div class="error-box">
        데이터를 불러오지 못했습니다.<br>
        GitHub Pages에서는 정상 작동하지만 index.html을 파일로 직접 열면 JSON fetch가 차단될 수 있습니다.
      </div>
    `;
  }
}

init();
