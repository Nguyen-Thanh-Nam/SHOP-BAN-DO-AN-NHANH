/**
 * Security Dashboard — App Logic
 * SHOP-BAN-DO-AN-NHANH · DevSecOps Project
 *
 * Tải dữ liệu từ scan-results.json và render toàn bộ dashboard
 */

// ================================================================
// Global State
// ================================================================
let DATA = null;
let activeSastFilter = 'all';

// ================================================================
// Utilities
// ================================================================
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return isoStr; }
}

function sevClass(sev) {
  const map = {
    CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium',
    LOW: 'low', ERROR: 'critical', WARNING: 'medium', INFO: 'info'
  };
  return map[sev?.toUpperCase()] || 'low';
}

function getCvssClass(score) {
  if (score >= 9) return 'cvss-critical';
  if (score >= 7) return 'cvss-high';
  return 'cvss-medium';
}

function stageStatusIcon(status) {
  const icons = { passed: '✅', failed: '❌', warning: '⚠️', skipped: '⏭️', running: '⏳' };
  return icons[status] || '—';
}

function stageStatusClass(status) {
  const cls = { passed: 'stage-passed', failed: 'stage-failed', warning: 'stage-warning', skipped: 'stage-skipped' };
  return cls[status] || 'stage-skipped';
}

function timelineDotClass(status) {
  const cls = {
    info: 'timeline-dot-info', success: 'timeline-dot-success',
    warning: 'timeline-dot-warning', failed: 'timeline-dot-failed',
    critical: 'timeline-dot-critical', skipped: 'timeline-dot-skipped'
  };
  return cls[status] || 'timeline-dot-info';
}

/** Animate a number counting up */
function animateCount(el, target, duration = 800) {
  const start = performance.now();
  const update = time => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * ease);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/** Animate a progress bar */
function animateBar(fillEl, pct, delay = 0) {
  fillEl.style.width = '0%';
  setTimeout(() => {
    fillEl.style.width = pct + '%';
  }, delay);
}

// ================================================================
// Header
// ================================================================
function renderHeader() {
  const m = DATA.metadata;
  $('hdr-commit').textContent = m.commit;
  $('hdr-branch').textContent = m.branch;
  $('hdr-date').textContent = formatDate(m.scanDate);
  $('pipeline-id').textContent = m.pipelineId;
  $('pipeline-link').href = m.pipelineUrl;
  $('footer-pipeline-id').textContent = m.pipelineId;

  const risk = DATA.riskSummary.overallRisk;
  const badge = $('overall-risk-badge');
  $('overall-risk-text').textContent = `RISK: ${risk}`;
  const colorMap = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e' };
  badge.style.color = colorMap[risk] || '#38bdf8';
  badge.style.borderColor = (colorMap[risk] || '#38bdf8') + '66';
  badge.style.background = (colorMap[risk] || '#38bdf8') + '18';
}

// ================================================================
// Pipeline Stages
// ================================================================
function renderPipeline() {
  const ps = DATA.pipelineSummary;
  $('pipeline-status-text').textContent = `${ps.status.toUpperCase()} · ${ps.passedStages}/${ps.totalStages} stages passed`;
  $('pipeline-duration').textContent = ps.duration;

  const container = $('pipeline-stages');
  ps.stages.forEach((stage, i) => {
    const div = el('div', `pipeline-stage ${stageStatusClass(stage.status)}`);
    div.innerHTML = `
      <div class="stage-number">Stage ${i + 1}</div>
      <div class="stage-status-icon">${stageStatusIcon(stage.status)}</div>
      <div class="stage-name">${stage.name.toUpperCase()}</div>
      <div class="stage-tool">${stage.tool}</div>
      <div class="stage-duration">${stage.duration}</div>
    `;
    container.appendChild(div);
  });

  // Timeline
  const tl = $('pipeline-timeline');
  DATA.pipelineTimeline.forEach((item, i) => {
    const div = el('div', `timeline-item status-${item.status}`);
    div.style.animationDelay = `${i * 60}ms`;
    div.innerHTML = `
      <div class="timeline-dot ${timelineDotClass(item.status)}"></div>
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-event">${item.event}</div>
    `;
    tl.appendChild(div);
  });
}

// ================================================================
// Risk Summary
// ================================================================
function renderRisk() {
  const rs = DATA.riskSummary;

  // Risk Cards
  const cards = $('risk-cards');
  const cardDefs = [
    { cls: 'total',    num: rs.totalFindings,          label: 'Total Findings',   sub: 'Tổng lỗ hổng' },
    { cls: 'critical', num: rs.bySeverity.critical,     label: 'CRITICAL',         sub: 'Phải sửa ngay' },
    { cls: 'high',     num: rs.bySeverity.high,         label: 'HIGH',             sub: 'Sửa sớm (< 7 ngày)' },
    { cls: 'medium',   num: rs.bySeverity.medium,       label: 'MEDIUM',           sub: 'Lập kế hoạch sửa' },
    { cls: 'low',      num: rs.bySeverity.low,          label: 'LOW',              sub: 'Theo dõi' },
  ];

  cardDefs.forEach(def => {
    const div = el('div', `risk-card ${def.cls}`);
    div.innerHTML = `
      <div class="risk-number" id="rc-num-${def.cls}">0</div>
      <div class="risk-label">${def.label}</div>
      <div class="risk-sublabel">${def.sub}</div>
    `;
    cards.appendChild(div);
    // Animate on visible
    setTimeout(() => animateCount($(`rc-num-${def.cls}`), def.num, 900), 200);
  });

  // OWASP List
  const owaspMap = {
    A01_BrokenAccessControl: 'A01 — Broken Access Control',
    A02_CryptographicFailures: 'A02 — Cryptographic Failures',
    A03_Injection: 'A03 — Injection',
    A04_InsecureDesign: 'A04 — Insecure Design',
    A05_SecurityMisconfiguration: 'A05 — Security Misconfiguration',
    A06_VulnerableComponents: 'A06 — Vulnerable Components',
    A07_AuthenticationFailures: 'A07 — Auth Failures',
    A08_SoftwareDataIntegrity: 'A08 — Software Integrity Failures',
    A09_SecurityLogging: 'A09 — Security Logging',
    A10_SSRF: 'A10 — SSRF',
  };

  const owaspList = $('owasp-list');
  Object.entries(rs.owaspCoverage).forEach(([key, count]) => {
    const item = el('div', 'owasp-item');
    const code = key.split('_')[0];
    item.innerHTML = `
      <span class="owasp-code">${code}</span>
      <span class="owasp-name">${owaspMap[key]}</span>
      <span class="owasp-count ${count > 0 ? 'has-findings' : 'no-findings'}">${count > 0 ? count + ' ⚠️' : '✅ 0'}</span>
    `;
    owaspList.appendChild(item);
  });

  // Category Bars
  const catData = rs.byCategory;
  const maxCat = Math.max(...Object.values(catData));
  const catColors = {
    secrets: '#ef4444',
    injection: '#f97316',
    brokenAccessControl: '#a78bfa',
    cryptographicFailures: '#38bdf8',
    securityMisconfiguration: '#eab308',
    dependencies: '#22c55e'
  };
  const catNames = {
    secrets: '🔑 Secrets bị lộ',
    injection: '💉 Injection',
    brokenAccessControl: '🔓 Broken Access Control',
    cryptographicFailures: '🔐 Cryptographic Failures',
    securityMisconfiguration: '⚙️ Security Misconfiguration',
    dependencies: '📦 Dependency Vulns'
  };

  const catBars = $('category-bars');
  Object.entries(catData).forEach(([key, count]) => {
    const pct = Math.round((count / maxCat) * 100);
    const item = el('div', 'cat-item');
    item.innerHTML = `
      <div class="cat-header">
        <span class="cat-name">${catNames[key] || key}</span>
        <span class="cat-count">${count}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="cat-bar-${key}" style="background:${catColors[key] || '#38bdf8'}; width:0%"></div>
      </div>
    `;
    catBars.appendChild(item);
    setTimeout(() => {
      const fill = $(`cat-bar-${key}`);
      if (fill) fill.style.width = pct + '%';
    }, 400);
  });
}

// ================================================================
// Secrets Detection
// ================================================================
function renderSecrets() {
  const sd = DATA.secretsDetection;
  $('secrets-count').textContent = sd.totalFindings;

  const tbody = $('secrets-tbody');
  sd.findings.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="finding-id">${f.id}</td>
      <td><code style="font-size:0.65rem">${f.ruleId}</code></td>
      <td class="finding-file">${f.file}</td>
      <td class="finding-line">${f.line}</td>
      <td><span class="sev-badge sev-${f.severity}">${f.severity}</span></td>
      <td style="font-size:0.78rem; color:var(--text-secondary); max-width:280px">${f.description}</td>
      <td><span class="action-btn">Thu hồi ngay</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ================================================================
// SAST
// ================================================================
function renderSast() {
  const sast = DATA.sast;
  $('sast-files').textContent = sast.scannedFiles + ' files scanned';

  const errorCount  = sast.findings.filter(f => f.severity === 'ERROR').length;
  const warnCount   = sast.findings.filter(f => f.severity === 'WARNING').length;

  $('sast-count-all').textContent = sast.findings.length;
  $('sast-count-error').textContent = errorCount;
  $('sast-count-warning').textContent = warnCount;

  function renderCards(filter) {
    const container = $('sast-cards');
    container.innerHTML = '';
    const filtered = filter === 'all' ? sast.findings : sast.findings.filter(f => f.severity === filter);

    filtered.forEach((f, i) => {
      const card = el('div', 'sast-card');
      card.style.animationDelay = `${i * 40}ms`;
      card.setAttribute('data-sev', f.severity);
      card.innerHTML = `
        <div class="sast-card-header">
          <div>
            <div class="sast-card-title">${f.title}</div>
          </div>
          <span class="sev-badge sev-${f.severity}">${f.severity}</span>
        </div>
        <div class="sast-meta">
          <span class="sast-file">${f.file}:${f.startLine}</span>
          <span class="sast-owasp">${f.owasp} · ${f.cwe}</span>
          <code style="font-size:0.65rem; background:rgba(56,189,248,0.08); padding:0.1rem 0.35rem; border-radius:0.2rem">${f.checkId}</code>
        </div>
        <p class="sast-message">${f.message}</p>
        ${f.codeSnippet ? `<div class="code-snippet">${escapeHtml(f.codeSnippet)}</div>` : ''}
        ${f.fix ? `<div class="sast-fix"><span class="sast-fix-icon">💡</span><span class="sast-fix-code">Fix: ${f.fix}</span></div>` : ''}
      `;
      container.appendChild(card);
    });
  }

  renderCards('all');

  // Filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCards(btn.dataset.filter);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ================================================================
// Dependencies
// ================================================================
function renderDependencies() {
  const dep = DATA.dependencyVulnerabilities;

  function renderDepSummary(containerId, data) {
    const container = $(containerId);
    const items = [
      { label: 'CRITICAL', count: data.byCritical, color: '#ef4444' },
      { label: 'HIGH',     count: data.byHigh,     color: '#f97316' },
      { label: 'MEDIUM',   count: data.byMedium,   color: '#eab308' },
      { label: 'LOW',      count: data.byLow,      color: '#22c55e' },
    ];
    items.forEach(item => {
      const div = el('div', 'dep-stat');
      div.innerHTML = `<div class="dep-stat-dot" style="background:${item.color}"></div>
        <span style="color:${item.color}">${item.count}</span>
        <span style="color:var(--text-muted);font-size:0.7rem">${item.label}</span>`;
      container.appendChild(div);
    });
    const total = el('div', 'dep-stat');
    total.innerHTML = `<span style="color:var(--text-muted);font-size:0.72rem">${data.totalPackages} packages scanned</span>`;
    container.appendChild(total);
  }

  function renderDepTable(tbodyId, vulns) {
    const tbody = $(tbodyId);
    vulns.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:600;color:var(--text-primary)">${v.packageName}</td>
        <td class="mono" style="color:var(--critical);font-size:0.7rem">${v.version}</td>
        <td class="mono" style="color:var(--status-passed);font-size:0.7rem">${v.fixedVersion || 'N/A'}</td>
        <td><a href="${v.link}" target="_blank" style="font-size:0.65rem; font-family:var(--font-mono)">${v.cve}</a></td>
        <td><span class="cvss-score ${getCvssClass(v.cvssScore)}">${v.cvssScore}</span></td>
        <td><span class="sev-badge sev-${v.severity}">${v.severity}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderDepSummary('backend-dep-bar', dep.backend);
  renderDepSummary('frontend-dep-bar', dep.frontend);
  renderDepTable('backend-dep-tbody', dep.backend.vulnerabilities);
  renderDepTable('frontend-dep-tbody', dep.frontend.vulnerabilities);
}

// ================================================================
// SBOM
// ================================================================
function renderSbom() {
  const sbom = DATA.sbom;
  const grid = $('sbom-grid');

  [
    { key: 'backend',  icon: '⚙️', title: 'Backend', subtitle: 'Node.js + Express.js' },
    { key: 'frontend', icon: '🌐', title: 'Frontend', subtitle: 'Next.js + React' },
  ].forEach(({ key, icon, title, subtitle }) => {
    const data = sbom[key];
    const totalLic = Object.values(data.licenseStats).reduce((a, b) => a + b, 0);

    const licRows = Object.entries(data.licenseStats)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => {
        const pct = Math.round((count / totalLic) * 100);
        return `
          <div class="license-row">
            <span class="license-name">${name}</span>
            <div class="license-bar-track">
              <div class="license-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="license-count">${count}</span>
          </div>
        `;
      }).join('');

    const card = el('div', 'sbom-card');
    card.innerHTML = `
      <div class="sbom-card-header">
        <div class="sbom-card-icon">${icon}</div>
        <div>
          <div class="sbom-card-title">${title}</div>
          <div class="sbom-card-subtitle">${subtitle} · CycloneDX 1.6</div>
        </div>
      </div>
      <div class="sbom-stats">
        <div class="sbom-stat">
          <div class="sbom-stat-number">${data.totalComponents}</div>
          <div class="sbom-stat-label">Total Components</div>
        </div>
        <div class="sbom-stat">
          <div class="sbom-stat-number">${data.topLevelDeps}</div>
          <div class="sbom-stat-label">Direct Deps</div>
        </div>
      </div>
      <div class="subsection-title" style="margin-bottom:0.5rem; font-size:0.75rem">📜 License Distribution</div>
      <div class="license-chart">${licRows}</div>
    `;
    grid.appendChild(card);
  });
}

// ================================================================
// Container Security
// ================================================================
function renderContainer() {
  const cs = DATA.containerSecurity;
  const signing = DATA.imageSigning;
  const container = $('container-cards');

  const cards = [
    {
      icon: '🐳',
      title: 'Docker Build',
      status: cs.backend.status,
      desc: cs.backend.reason,
      detail: `Base: ${cs.backend.baseImage}`,
      sub: `Dockerfile issues: ${cs.backend.dockerfileIssues.length} (all FIXED)`
    },
    {
      icon: '🔍',
      title: 'Trivy Image Scan',
      status: 'SKIPPED',
      desc: cs.backend.reason,
      detail: 'Stage 2 SAST failed',
      sub: 'Container scan không chạy'
    },
    {
      icon: '🔏',
      title: 'Cosign Signing',
      status: signing.status,
      desc: signing.reason,
      detail: `Tool: ${signing.tool}`,
      sub: `Policy: ${signing.policy}`
    }
  ];

  cards.forEach(c => {
    const cls = c.status === 'PASSED' ? 'stage-passed' : c.status === 'FAILED' ? 'stage-failed' : 'stage-skipped';
    const div = el('div', `card ${cls}`);
    div.innerHTML = `
      <div style="font-size:2rem; margin-bottom:0.75rem">${c.icon}</div>
      <h3 style="margin-bottom:0.5rem; font-size:1rem">${c.title}</h3>
      <span class="stage-badge badge-${c.status.toLowerCase()}" style="margin-left:0; margin-bottom:0.75rem; display:inline-flex">${c.status}</span>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.4rem">${c.desc}</p>
      <p style="font-size:0.72rem; color:var(--text-secondary)">${c.detail}</p>
      <p style="font-size:0.7rem; color:var(--text-muted); margin-top:0.25rem">${c.sub}</p>
    `;
    container.appendChild(div);
  });

  // Bypass simulation
  const bypass = signing.simulatedBypass;
  $('bypass-content').innerHTML = `
    <div class="bypass-scenario scenario-attempt">
      <div class="scenario-title">🎯 Hành động của Attacker (Bài thực hành 2)</div>
      <div class="terminal-block">
        <div><span class="term-prompt">$</span> <span class="term-cmd"># Cố gắng deploy image chưa ký trực tiếp vào cluster</span></div>
        <div><span class="term-prompt">$</span> <span class="term-cmd">docker pull nginx:latest</span></div>
        <div><span class="term-info">Pulling from library/nginx...</span></div>
        <div><span class="term-prompt">$</span> <span class="term-cmd">docker tag nginx:latest registry.gitlab.com/project/backend:malicious</span></div>
        <div><span class="term-prompt">$</span> <span class="term-cmd">docker push registry.gitlab.com/project/backend:malicious</span></div>
        <div><span class="term-info">Pushed successfully (KHÔNG qua pipeline!)</span></div>
        <div><span class="term-prompt">$</span> <span class="term-cmd">kubectl apply -f malicious-deployment.yaml</span></div>
        <div><span class="term-info">Thời gian: ${bypass.timestamp}</span></div>
      </div>
    </div>
    <div class="bypass-scenario scenario-result">
      <div class="scenario-title">🛡️ Kết quả: Kyverno BLOCK thành công!</div>
      <div class="terminal-block">
        <div><span class="term-error">Error from server: admission webhook</span></div>
        <div><span class="term-error">'kyverno-resource.kyverno.svc'</span></div>
        <div><span class="term-error">denied the request:</span></div>
        <div><span class="term-error">${bypass.error}</span></div>
        <br/>
        <div><span class="term-ok">✅ Kết quả: ${bypass.result}</span></div>
        <div><span class="term-ok">✅ Cluster được bảo vệ!</span></div>
        <div><span class="term-ok">✅ Chỉ image đã được Cosign</span></div>
        <div><span class="term-ok">   ký bởi GitLab CI mới được</span></div>
        <div><span class="term-ok">   phép deploy vào production.</span></div>
        <br/>
        <div><span class="term-dim"># GitLab Audit Log ghi nhận</span></div>
        <div><span class="term-dim"># unauthorized deploy attempt</span></div>
      </div>
    </div>
  `;
}

// ================================================================
// Remediation Plan
// ================================================================
function renderRemediation() {
  const plans = [
    {
      cls: 'immediate',
      priority: '🚨 NGAY LẬP TỨC (< 24h)',
      title: 'Thu hồi Credentials bị lộ',
      items: [
        { icon: '🔑', text: 'Thu hồi Gmail App Password (MAIL_PASS) — Tài khoản đang bị compromise!' },
        { icon: '💳', text: 'Revoke Stripe Live Key (sk_live_51...) trên Stripe Dashboard' },
        { icon: '☁️',  text: 'Deactivate AWS Access Key (AKIAIOSFODNN7EXAMPLE) trên IAM Console' },
        { icon: '📁', text: 'Thêm .env vào .gitignore NGAY để ngăn commit tiếp theo' },
        { icon: '🔒', text: 'Rotate JWT secrets — thay bằng random 256-bit string' },
        { icon: '🧹', text: 'Xóa secrets khỏi git history: git-filter-repo hoặc BFG Repo Cleaner' }
      ]
    },
    {
      cls: 'short-term',
      priority: '⚡ NGẮN HẠN (< 1 tuần)',
      title: 'Vá lỗ hổng Injection & Dependencies',
      items: [
        { icon: '💉', text: 'Fix tất cả 5 SQL Injection: dùng parameterized queries với mysql2' },
        { icon: '📦', text: 'Cập nhật mongoose → 9.6.5 (fix CVE-2024-53900 CRITICAL)' },
        { icon: '⬆️',  text: 'Cập nhật next.js → 16.1.0 (fix CVE-2025-48788 auth bypass)' },
        { icon: '🌐', text: 'Cấu hình CORS whitelist: cors({ origin: ["https://yourdomain.com"] })' },
        { icon: '⛑️',  text: 'Thêm Helmet.js: npm install helmet && app.use(helmet())' },
        { icon: '🚦', text: 'Thêm rate limiting: express-rate-limit (max 5 requests/15min trên /login)' }
      ]
    },
    {
      cls: 'long-term',
      priority: '📋 DÀI HẠN (< 1 tháng)',
      title: 'Kiến trúc Bảo mật Toàn diện',
      items: [
        { icon: '🏗️',  text: 'Dùng GitLab CI Variables / HashiCorp Vault để quản lý secrets' },
        { icon: '🔏', text: 'Thiết lập Cosign signing + Kyverno policy để verify tất cả images' },
        { icon: '📋', text: 'Tích hợp DAST (OWASP ZAP) vào pipeline stage sau container build' },
        { icon: '📊', text: 'Thiết lập SBOM tracking — cập nhật mỗi lần build mới' },
        { icon: '🛡️',  text: 'Triển khai WAF (Web Application Firewall) trước Express API' },
        { icon: '📝', text: 'Security audit logs — tập trung vào failed logins, privilege changes' }
      ]
    }
  ];

  const grid = $('remediation-grid');
  plans.forEach(plan => {
    const card = el('div', `remediation-card ${plan.cls}`);
    const items = plan.items.map(i => `
      <div class="rem-item">
        <span class="rem-icon">${i.icon}</span>
        <span>${i.text}</span>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="remediation-priority">${plan.priority}</div>
      <div class="remediation-title">${plan.title}</div>
      <div class="remediation-items">${items}</div>
    `;
    grid.appendChild(card);
  });
}

// ================================================================
// Scroll-to-top
// ================================================================
function initScrollTop() {
  const btn = $('scroll-top-btn');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ================================================================
// Main
// ================================================================
async function init() {
  try {
    const res = await fetch('./data/scan-results.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    DATA = await res.json();

    renderHeader();
    renderPipeline();
    renderRisk();
    renderSecrets();
    renderSast();
    renderDependencies();
    renderSbom();
    renderContainer();
    renderRemediation();
    initScrollTop();

    console.log('%c🛡️ Security Dashboard loaded successfully', 'color:#38bdf8;font-weight:700;font-size:14px');
    console.log('Data:', DATA.metadata);

  } catch (err) {
    console.error('Failed to load scan data:', err);
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;
                  background:#060b14;color:#ef4444;font-family:monospace;text-align:center;padding:2rem">
        <div>
          <div style="font-size:3rem;margin-bottom:1rem">❌</div>
          <h2 style="margin-bottom:0.5rem">Không thể tải dữ liệu bảo mật</h2>
          <p style="color:#6b7280;margin-bottom:1rem">${err.message}</p>
          <p style="color:#4a6880;font-size:0.8rem">
            Đảm bảo file <code style="color:#38bdf8">data/scan-results.json</code> tồn tại<br/>
            và mở file qua HTTP server (không phải file:// protocol)
          </p>
          <br/>
          <code style="color:#86efac;font-size:0.75rem">
            # Chạy HTTP server tại thư mục security-dashboard/<br/>
            python -m http.server 8080<br/>
            # Rồi mở: http://localhost:8080
          </code>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
