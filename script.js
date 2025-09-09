// --------- HELPERS ---------
const qs = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
const show = id => { 
  qsa('.screen').forEach(el => el.classList.remove('active')); 
  qs(`#${id}`).classList.add('active'); 
};

// Persist login in this session
const Auth = {
  isLoggedIn: () => sessionStorage.getItem('loggedIn') === '1',
  login(){ sessionStorage.setItem('loggedIn', '1'); },
  logout(){ sessionStorage.removeItem('loggedIn'); }
};

// --------- DATA: CATEGORIES & WEBSITES ---------
const CATEGORIES = [
  { id: 'ideas', name: 'Ideas', icon: '💡', sites: [
      { title: "ChatGPT", url: "https://chat.openai.com" },
      { title: "Claude AI", url: "https://claude.ai" },
      { title: "Perplexity", url: "https://www.perplexity.ai" },
      { title: "Gemini", url: "https://gemini.google.com" },
      { title: "Copy.ai", url: "https://www.copy.ai" },
  ]},
  { id: 'text2img', name: 'Text to Image', icon: '🖼️', sites: [
      { title: "Craiyon", url: "https://www.craiyon.com" },
      { title: "NightCafe", url: "https://creator.nightcafe.studio" },
      { title: "DeepAI", url: "https://deepai.org/machine-learning-model/text2img" },
      { title: "Stable Diffusion", url: "https://stability.ai" },
      { title: "Fotor", url: "https://www.fotor.com" },
  ]},
  { id: 'copywriting', name: 'Copy Writing', icon: '✍️', sites: [
      { title: "Copy.ai", url: "https://www.copy.ai" },
      { title: "Jasper", url: "https://www.jasper.ai" },
      { title: "Rytr", url: "https://rytr.me" },
      { title: "WriteSonic", url: "https://writesonic.com" },
      { title: "Simplified", url: "https://simplified.com" },
  ]},
  { id: 'designing', name: 'Designing', icon: '🎨', sites: [
      { title: "Canva", url: "https://www.canva.com" },
      { title: "Figma", url: "https://www.figma.com" },
      { title: "Remove.bg", url: "https://www.remove.bg" },
      { title: "Looka", url: "https://looka.com" },
      { title: "VistaCreate", url: "https://create.vista.com" },
  ]},
  { id: 'website', name: 'Website Creating', icon: '🌐', sites: [
      { title: "Wix", url: "https://www.wix.com" },
      { title: "WordPress", url: "https://wordpress.com" },
      { title: "Webflow", url: "https://webflow.com" },
      { title: "Google Sites", url: "https://sites.google.com" },
      { title: "Carrd", url: "https://carrd.co" },
  ]},
  { id: 'videos', name: 'Videos', icon: '🎬', sites: [
      { title: "Pictory", url: "https://pictory.ai" },
      { title: "Synthesia", url: "https://www.synthesia.io" },
      { title: "RunwayML", url: "https://runwayml.com" },
      { title: "Flexclip", url: "https://www.flexclip.com" },
      { title: "Lumen5", url: "https://lumen5.com" },
  ]},
  { id: 'automation', name: 'Automation', icon: '⚙️', sites: [
      { title: "Zapier", url: "https://zapier.com" },
      { title: "IFTTT", url: "https://ifttt.com" },
      { title: "Make", url: "https://www.make.com" },
      { title: "Automate.io", url: "https://automate.io" },
      { title: "n8n", url: "https://n8n.io" },
  ]},
];

// --------- DOM ---------
const grid = qs('#categoriesGrid');
const sitesList = qs('#sitesList');
const emptyState = qs('#emptyState');
const catTitle = qs('#catTitle');
const viewer = qs('#viewer');
const viewerTitle = qs('#viewerTitle');
const viewerFrame = qs('#viewerFrame');
const viewerOpenNew = qs('#viewerOpenNew');
const viewerClose = qs('#viewerClose');
const viewerNote = qs('#viewerNote');

// --------- EVENTS ---------
qs('#togglePass').addEventListener('click', () => {
  const input = qs('#password');
  input.type = input.type === 'password' ? 'text' : 'password';
});

// ✅ Fixed Username & Password + WhatsApp
const correctUser = "irfan";           // username
const correctPass = "12345";           // password
const adminWhatsapp = "923150658934";  // WhatsApp (country code ke sath)

qs('#loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = qs('#email').value.trim();
  const pass = qs('#password').value.trim();

  if (email === correctUser && pass === correctPass) {
    Auth.login();
    show('screen-credits'); // first show credits
  } else {
    // ❌ Incorrect -> open WhatsApp directly (with pre-filled message)
    const msg = `Hello Admin, Wrong login attempt.\nUsername: ${encodeURIComponent(email)}`;
    window.open(`https://wa.me/${adminWhatsapp}?text=${msg}`, "_blank");
  }
});

qs('#btnGetStart').addEventListener('click', () => {
  renderCategories();
  show('screen-home');
});

qs('#btnLogout').addEventListener('click', () => {
  Auth.logout();
  show('screen-login');
});

qs('#btnBackHome').addEventListener('click', () => {
  closeViewer(); // iframe reset
  show('screen-home'); // back to home
});

viewerClose.addEventListener('click', closeViewer);
viewer.addEventListener('click', (e)=>{ if(e.target === viewer) closeViewer(); });

function closeViewer(){ 
  viewer.classList.add('hidden'); 
  viewerFrame.src = 'about:blank';  
  viewerFrame.removeAttribute('srcdoc'); 
}

// --------- RENDER CATEGORIES ---------
function renderCategories(){
  grid.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const card = document.createElement('button');
    card.className = 'card-cat';
    card.innerHTML = `<div class="ico">${cat.icon}</div><h4>${cat.name}</h4>`;
    card.addEventListener('click', () => openCategory(cat.id));
    grid.appendChild(card);
  });
}

// --------- OPEN CATEGORY ---------
function openCategory(catId){
  const cat = CATEGORIES.find(c => c.id === catId);
  if(!cat) return;
  catTitle.textContent = cat.name;

  sitesList.innerHTML = '';
  if(!cat.sites || cat.sites.length === 0){
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    cat.sites.forEach((site, idx) => {
      const row = document.createElement('div');
      row.className = 'list-item';
      row.innerHTML = `
        <div class="ico">🔗</div>
        <div class="text">
          <div class="title">${idx+1}. ${site.title}</div>
        </div>
        <div class="link">
          <button class="btn small" data-url="${site.url}" data-title="${site.title}">Open</button>
        </div>
      `;
      row.querySelector('button').addEventListener('click', () => openSite(site.title, site.url));
      sitesList.appendChild(row);
    });
  }

  show('screen-category');
}

// --------- OPEN SITE (Viewer with fallback) ---------
function openSite(title, url){
  viewerTitle.textContent = title;
  viewerOpenNew.href = url;

  try {
    viewerFrame.src = url;
    viewer.classList.remove('hidden');

    // agar 3s ke andar kuch load nahi hota → new tab open
    setTimeout(() => {
      try {
        if (!viewerFrame.contentDocument || viewerFrame.contentDocument.body.innerHTML.trim() === "") {
          closeViewer();
          window.open(url, "_blank");
        }
      } catch (err) {
        closeViewer();
        window.open(url, "_blank");
      }
    }, 3000);

  } catch (err) {
    closeViewer();
    window.open(url, "_blank");
  }
}

// --------- INIT ---------
(function init(){
  if (Auth.isLoggedIn()) {
    show('screen-credits');  
  } else {
    show('screen-login');
  }
})();
// --------- ABOUT & CONTACT NAVIGATION ---------
const goAbout = qs('#goAbout');
const goContact = qs('#goContact');
const backAbout = qs('#btnBackFromAbout');
const backContact = qs('#btnBackFromContact');

if (goAbout) {
  goAbout.addEventListener('click', () => show('screen-about'));
}
if (goContact) {
  goContact.addEventListener('click', () => show('screen-contact'));
}
if (backAbout) {
  backAbout.addEventListener('click', () => show('screen-home'));
}
if (backContact) {
  backContact.addEventListener('click', () => show('screen-home'));
}
