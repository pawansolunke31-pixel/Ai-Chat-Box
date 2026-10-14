// script.js - Unified Super-AI with Complete Knowledge Engine

// -- State & Storage ---------------------------------------------------------
let conversations = [];
let currentChatId = null;
let toastTimer = null;
let currentMode = localStorage.getItem("ai_mode") || "free";
let isWebSearchEnabled = localStorage.getItem("web_search_enabled") !== "false";
let geminiApiKey = localStorage.getItem("gemini_api_key") || "";
let openaiApiKey = localStorage.getItem("openai_api_key") || "";
let currentUser = null;
try {
  const rawUser = localStorage.getItem("ai_current_user");
  if (rawUser) currentUser = JSON.parse(rawUser);
} catch (e) {
  currentUser = null;
}
let userName = currentUser && currentUser.name ? currentUser.name : (localStorage.getItem("user_name") || "Guest");

// -- DOM Elements ------------------------------------------------------------
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("theme-toggle");
const settingsBtn = document.getElementById("settings-btn");
const quickPrompts = document.getElementById("quick-prompts");
const providerBadge = document.getElementById("provider-badge");
const webSearchToggle = document.getElementById("web-search-toggle");
const chatTitleHeading = document.getElementById("chat-title-heading");
const newChatBtn = document.getElementById("new-chat-btn");
const historyToggleBtn = document.getElementById("history-toggle-btn");
const historyDrawer = document.getElementById("history-drawer");
const closeDrawerBtn = document.getElementById("close-drawer-btn");
const drawerNewChatBtn = document.getElementById("drawer-new-chat-btn");
const conversationsList = document.getElementById("conversations-list");
const root = document.documentElement;

// Modal Elements
const settingsModal = document.getElementById("settings-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const aiModeSelect = document.getElementById("ai-mode-select");
const apiKeyContainer = document.getElementById("api-key-container");
const apiKeyInput = document.getElementById("api-key-input");
const apiKeyLabel = document.getElementById("api-key-label");
const userNameInput = document.getElementById("user-name-input");

// Attachment & Camera Elements
const cameraBtn = document.getElementById("camera-btn");
const fileUploadBtn = document.getElementById("file-upload-btn");
const fileInput = document.getElementById("file-input");
const attachmentTray = document.getElementById("attachment-tray");
const dropOverlay = document.getElementById("drop-overlay");

// Camera Modal Elements
const cameraModal = document.getElementById("camera-modal");
const closeCameraBtn = document.getElementById("close-camera-btn");
const cameraVideo = document.getElementById("camera-video");
const cameraCanvas = document.getElementById("camera-canvas");
const cameraSnapshotPreview = document.getElementById("camera-snapshot-preview");
const switchCameraBtn = document.getElementById("switch-camera-btn");
const shutterBtn = document.getElementById("shutter-btn");
const cameraPostActions = document.getElementById("camera-post-actions");
const retakePhotoBtn = document.getElementById("retake-photo-btn");
const acceptPhotoBtn = document.getElementById("accept-photo-btn");
const cameraStatusMsg = document.getElementById("camera-status-msg");

// Lightbox Elements
const lightboxModal = document.getElementById("lightbox-modal");
const closeLightboxBtn = document.getElementById("close-lightbox-btn");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

// Auth & User Profile Elements
const authLoginBtn = document.getElementById("auth-login-btn");
const userProfileMenuWrap = document.getElementById("user-profile-menu-wrap");
const userProfileBtn = document.getElementById("user-profile-btn");
const userAvatarInitials = document.getElementById("user-avatar-initials");
const userHeaderName = document.getElementById("user-header-name");
const userDropdownCard = document.getElementById("user-dropdown-card");
const dropdownAvatarCircle = document.getElementById("dropdown-avatar-circle");
const dropdownUserName = document.getElementById("dropdown-user-name");
const dropdownUserEmail = document.getElementById("dropdown-user-email");
const dropdownUserBadge = document.getElementById("dropdown-user-badge");
const dropdownSettingsBtn = document.getElementById("dropdown-settings-btn");
const dropdownHistoryBtn = document.getElementById("dropdown-history-btn");
const dropdownLogoutBtn = document.getElementById("dropdown-logout-btn");

// Auth Modal Elements
const authModal = document.getElementById("auth-modal");
const closeAuthModalBtn = document.getElementById("close-auth-modal-btn");
const authTabLogin = document.getElementById("auth-tab-login");
const authTabSignup = document.getElementById("auth-tab-signup");
const authAlert = document.getElementById("auth-alert");
const authForm = document.getElementById("auth-form");
const authNameGroup = document.getElementById("auth-name-group");
const authNameInput = document.getElementById("auth-name-input");
const authEmailInput = document.getElementById("auth-email-input");
const authPasswordInput = document.getElementById("auth-password-input");
const togglePasswordVisibilityBtn = document.getElementById("toggle-password-visibility-btn");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const authGoogleBtn = document.getElementById("auth-google-btn");
const authGuestBtn = document.getElementById("auth-guest-btn");

// Dedicated Gmail View & Google Identity Elements
const authStandardView = document.getElementById("auth-standard-view");
const authGmailView = document.getElementById("auth-gmail-view");
const gmailAuthForm = document.getElementById("gmail-auth-form");
const gmailEmailInput = document.getElementById("gmail-email-input");
const gmailNameInput = document.getElementById("gmail-name-input");
const gmailPasswordInput = document.getElementById("gmail-password-input");
const gmailSubmitBtn = document.getElementById("gmail-submit-btn");
const backToStandardBtn = document.getElementById("back-to-standard-btn");
const googleGisContainer = document.getElementById("google-gis-container");
const googleClientIdInput = document.getElementById("google-client-id-input");


// -- SVGs --------------------------------------------------------------------
const sunSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"></circle>
  <line x1="12" y1="1" x2="12" y2="3"></line>
  <line x1="12" y1="21" x2="12" y2="23"></line>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
  <line x1="1" y1="12" x2="3" y2="12"></line>
  <line x1="21" y1="12" x2="23" y2="12"></line>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
</svg>`;

const moonSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
</svg>`;


const editSvg = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
</svg>`;

const copySvg = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
</svg>`;

const botMiniSvg = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2a8 8 0 0 0-8 8v1a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-1a8 8 0 0 0-8-8z"/>
  <path d="M9 10h.01M15 10h.01"/>
</svg>`;

// -- Toast Helper ------------------------------------------------------------
function showToast(msg, duration = 3000) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), duration);
}

// -- Formatting --------------------------------------------------------------
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Global helper for code block copy button
window.copyCodeSnippet = function(btn) {
  const wrapper = btn.closest(".code-block-wrapper");
  if (!wrapper) return;
  const codeEl = wrapper.querySelector("code");
  if (!codeEl) return;
  const codeText = codeEl.textContent || "";
  copyMessageText(codeText);
  const origText = btn.textContent;
  btn.textContent = "Copied! ✓";
  btn.style.background = "#10b981";
  btn.style.color = "#ffffff";
  setTimeout(() => {
    btn.textContent = origText;
    btn.style.background = "";
    btn.style.color = "";
  }, 2000);
};

function formatMarkdown(text) {
  if (!text) return "";

  const codeBlocks = [];
  // 1. Extract and preserve code blocks (triple backticks)
  let processed = text.replace(/```([a-zA-Z0-9_\-\+]*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
    const id = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push({ lang: (lang || "code").trim(), code: code.trim() });
    return id;
  });

  // 2. Escape HTML special characters
  processed = processed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 3. Headers
  processed = processed.replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
  processed = processed.replace(/^## (.*$)/gim, '<h3 class="md-h3">$1</h3>');
  processed = processed.replace(/^# (.*$)/gim, '<h2 class="md-h2">$1</h2>');

  // 4. Bold and Italics
  processed = processed.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 5. Inline Code
  processed = processed.replace(/`([^`\r\n]+)`/g, '<code class="inline-code">$1</code>');

  // 6. Links
  processed = processed.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

  // 7. Bullet Lists & Numbered lists
  processed = processed.replace(/^\s*[-*•]\s+(.*)$/gim, '<div class="md-list-item">• $1</div>');
  processed = processed.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<div class="md-list-item"><span class="md-num">$1.</span> $2</div>');

  // 8. Line breaks (preserve spacing)
  processed = processed.replace(/\r?\n/g, '<br>');

  // 9. Reinsert formatted code blocks with copy button
  codeBlocks.forEach((block, i) => {
    const escaped = block.code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const blockHtml = `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang">${block.lang}</span>
          <button class="code-copy-btn" onclick="copyCodeSnippet(this)">Copy</button>
        </div>
        <pre class="code-pre"><code class="code-content">${escaped}</code></pre>
      </div>`;
    processed = processed.replace(`___CODE_BLOCK_${i}___`, blockHtml);
  });

  return processed;
}

// -- Multi-Conversation State Management -------------------------------------
function getConversationsStorageKey() {
  return currentUser ? `ai_conversations_${currentUser.id}` : "ai_conversations";
}

function loadConversationsFromStorage() {
  const key = getConversationsStorageKey();
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      conversations = JSON.parse(raw);
    } else {
      // If user has no saved conversations yet, copy current guest conversations
      const guestRaw = localStorage.getItem("ai_conversations");
      if (guestRaw && currentUser) {
        conversations = JSON.parse(guestRaw);
        saveConversationsToStorage();
      } else {
        conversations = [];
      }
    }
  } catch (e) {
    conversations = [];
  }

  currentChatId = localStorage.getItem(`${key}_current_chat_id`);
  if (!conversations || conversations.length === 0) {
    createNewConversation(false);
  } else if (!currentChatId || !conversations.some(c => c.id === currentChatId)) {
    currentChatId = conversations[0].id;
    localStorage.setItem(`${key}_current_chat_id`, currentChatId);
  }
}

function saveConversationsToStorage() {
  const key = getConversationsStorageKey();
  localStorage.setItem(key, JSON.stringify(conversations));
  if (currentChatId) {
    localStorage.setItem(`${key}_current_chat_id`, currentChatId);
  }
}

function getCurrentConversation() {
  return conversations.find(c => c.id === currentChatId) || conversations[0];
}

function createNewConversation(showWelcome = true) {
  const newId = "chat_" + Date.now();
  const newConv = {
    id: newId,
    title: "New Conversation",
    createdAt: new Date().toLocaleDateString(),
    messages: []
  };

  conversations.unshift(newConv);
  currentChatId = newId;
  saveConversationsToStorage();

  chatWindow.innerHTML = "";
  if (showWelcome) {
    const welcome = `👋 Hello ${userName}! I am your Unified AI Assistant combining ChatGPT, Gemini, and Google Search. What would you like to explore in this new chat?`;
    renderMessage(welcome, "bot");
    newConv.messages.push({ text: welcome, type: "bot", time: getCurrentTime() });
    saveConversationsToStorage();
    showToast("✨ Started new chat");
  }

  updateHeaderTitle("New Conversation");
  renderConversationsList();
  closeHistoryDrawer();
  userInput.focus();
}

function switchConversation(id) {
  const target = conversations.find(c => c.id === id);
  if (!target) return;

  currentChatId = id;
  localStorage.setItem("ai_current_chat_id", currentChatId);

  chatWindow.innerHTML = "";
  if (target.messages.length === 0) {
    renderMessage(`👋 Hello ${userName}! What would you like to discuss in this chat?`, "bot");
  } else {
    renderAllMessages();
  }

  updateHeaderTitle(target.title);
  renderConversationsList();
  closeHistoryDrawer();
  showToast(`Loaded: ${target.title}`);
}

function deleteConversation(id, event) {
  if (event) event.stopPropagation();

  conversations = conversations.filter(c => c.id !== id);
  if (conversations.length === 0) {
    createNewConversation(true);
  } else if (currentChatId === id) {
    switchConversation(conversations[0].id);
  } else {
    saveConversationsToStorage();
    renderConversationsList();
  }
  showToast("Chat deleted");
}

function updateHeaderTitle(title) {
  if (chatTitleHeading) {
    chatTitleHeading.textContent = title || "AI Assistant";
  }
}

function renderConversationsList() {
  if (!conversationsList) return;
  conversationsList.innerHTML = "";

  conversations.forEach(c => {
    const item = document.createElement("div");
    item.className = `conversation-item ${c.id === currentChatId ? 'active' : ''}`;
    item.onclick = () => switchConversation(c.id);

    const info = document.createElement("div");
    info.className = "conv-info";

    const titleEl = document.createElement("span");
    titleEl.className = "conv-title";
    titleEl.textContent = c.title || "Untitled Chat";

    const timeEl = document.createElement("span");
    timeEl.className = "conv-time";
    timeEl.textContent = `${c.createdAt || ""} • ${c.messages.length} msgs`;

    info.appendChild(titleEl);
    info.appendChild(timeEl);

    const delBtn = document.createElement("button");
    delBtn.className = "conv-delete-btn";
    delBtn.title = "Delete conversation";
    delBtn.innerHTML = `&times;`;
    delBtn.onclick = (e) => deleteConversation(c.id, e);

    item.appendChild(info);
    item.appendChild(delBtn);
    conversationsList.appendChild(item);
  });
}

function openHistoryDrawer() {
  renderConversationsList();
  historyDrawer.classList.remove("hidden");
}

function closeHistoryDrawer() {
  historyDrawer.classList.add("hidden");
}

// -- Message Rendering -------------------------------------------------------

// ============================================================================
// ATTACHMENT & CAMERA MODULE ENGINE
// ============================================================================
let stagedAttachments = [];
let cameraStream = null;
let currentFacingMode = "user";
let currentSnapshotDataUrl = null;

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Stage File
function stageFile(file) {
  const isImage = file.type.startsWith("image/");
  const reader = new FileReader();

  if (isImage) {
    reader.onload = (e) => {
      stagedAttachments.push({
        id: "att_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        type: "image",
        name: file.name,
        size: file.size,
        mimeType: file.type || "image/jpeg",
        dataUrl: e.target.result,
        file: file
      });
      renderAttachmentTray();
      showToast(`📷 Image attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  } else {
    // Document or text file
    reader.onload = (e) => {
      const isText = file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv") || file.name.endsWith(".json");
      stagedAttachments.push({
        id: "att_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        type: "doc",
        name: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
        dataUrl: isText ? null : (e.target.result || null),
        textContent: isText ? e.target.result : null,
        file: file
      });
      renderAttachmentTray();
      showToast(`📄 Document attached: ${file.name}`);
    };
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".csv") || file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  }
}

// Render Attachment Tray
function renderAttachmentTray() {
  if (!attachmentTray) return;
  if (stagedAttachments.length === 0) {
    attachmentTray.classList.add("hidden");
    attachmentTray.innerHTML = "";
    return;
  }

  attachmentTray.classList.remove("hidden");
  attachmentTray.innerHTML = "";

  stagedAttachments.forEach((att, idx) => {
    const item = document.createElement("div");
    item.className = "staged-item";

    if (att.type === "image") {
      const img = document.createElement("img");
      img.src = att.dataUrl;
      img.className = "staged-thumb";
      img.alt = att.name;
      img.title = att.name;
      item.appendChild(img);
    } else {
      const docBadge = document.createElement("div");
      docBadge.className = "staged-doc-badge";
      const icon = att.name.endsWith(".pdf") ? "📕" : "📄";
      docBadge.innerHTML = `<span>${icon}</span><span class="staged-doc-name" title="${att.name}">${att.name}</span> <span class="staged-doc-size">${formatFileSize(att.size)}</span>`;
      item.appendChild(docBadge);
    }

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-staged-btn";
    removeBtn.innerHTML = "&times;";
    removeBtn.title = "Remove attachment";
    removeBtn.onclick = () => {
      stagedAttachments.splice(idx, 1);
      renderAttachmentTray();
    };

    item.appendChild(removeBtn);
    attachmentTray.appendChild(item);
  });
}

// File Input Change
if (fileInput) {
  fileInput.addEventListener("change", (e) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(stageFile);
      fileInput.value = "";
    }
  });
}

if (fileUploadBtn) {
  fileUploadBtn.addEventListener("click", () => {
    if (fileInput) fileInput.click();
  });
}

// Drag & Drop
window.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (dropOverlay) dropOverlay.classList.remove("hidden");
});

window.addEventListener("dragleave", (e) => {
  if (e.relatedTarget === null && dropOverlay) {
    dropOverlay.classList.add("hidden");
  }
});

window.addEventListener("drop", (e) => {
  e.preventDefault();
  if (dropOverlay) dropOverlay.classList.add("hidden");
  if (e.dataTransfer && e.dataTransfer.files) {
    Array.from(e.dataTransfer.files).forEach(stageFile);
  }
});

// Clipboard Paste
window.addEventListener("paste", (e) => {
  if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
    Array.from(e.clipboardData.files).forEach(stageFile);
  }
});

// -- Camera Module Logic -----------------------------------------------------
async function openCameraModal() {
  if (!cameraModal) return;
  cameraModal.classList.remove("hidden");
  cameraPostActions.classList.add("hidden");
  shutterBtn.classList.remove("hidden");
  switchCameraBtn.classList.remove("hidden");
  cameraSnapshotPreview.classList.add("hidden");
  cameraVideo.classList.remove("hidden");
  currentSnapshotDataUrl = null;

  if (cameraStatusMsg) {
    cameraStatusMsg.textContent = "Connecting to camera...";
    cameraStatusMsg.classList.remove("hidden");
  }

  try {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }

    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: currentFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    cameraVideo.srcObject = cameraStream;
    if (cameraStatusMsg) cameraStatusMsg.textContent = "Camera Live";
  } catch (err) {
    console.error("Camera access error:", err);
    if (cameraStatusMsg) {
      cameraStatusMsg.textContent = "Camera access denied or unavailable";
    }
    showToast("⚠️ Could not access camera. Please check browser permissions or upload via 📎 button.");
  }
}

function closeCameraModal() {
  if (!cameraModal) return;
  cameraModal.classList.add("hidden");
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  if (cameraVideo) cameraVideo.srcObject = null;
}

function switchCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  openCameraModal();
}

function capturePhoto() {
  if (!cameraVideo || !cameraCanvas) return;
  const width = cameraVideo.videoWidth || 640;
  const height = cameraVideo.videoHeight || 480;

  cameraCanvas.width = width;
  cameraCanvas.height = height;
  const ctx = cameraCanvas.getContext("2d");

  // Mirror effect if front camera
  if (currentFacingMode === "user") {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(cameraVideo, 0, 0, width, height);

  currentSnapshotDataUrl = cameraCanvas.toDataURL("image/jpeg", 0.92);
  cameraSnapshotPreview.src = currentSnapshotDataUrl;
  cameraSnapshotPreview.classList.remove("hidden");
  cameraVideo.classList.add("hidden");

  shutterBtn.classList.add("hidden");
  switchCameraBtn.classList.add("hidden");
  cameraPostActions.classList.remove("hidden");
}

function retakePhoto() {
  currentSnapshotDataUrl = null;
  cameraSnapshotPreview.classList.add("hidden");
  cameraVideo.classList.remove("hidden");
  shutterBtn.classList.remove("hidden");
  switchCameraBtn.classList.remove("hidden");
  cameraPostActions.classList.add("hidden");
}

function acceptPhoto() {
  if (!currentSnapshotDataUrl) return;
  stagedAttachments.push({
    id: "photo_" + Date.now(),
    type: "image",
    name: "Camera_Photo_" + new Date().toLocaleTimeString().replace(/:/g, "-") + ".jpg",
    size: Math.round(currentSnapshotDataUrl.length * 0.75),
    mimeType: "image/jpeg",
    dataUrl: currentSnapshotDataUrl
  });

  renderAttachmentTray();
  closeCameraModal();
  showToast("📸 Photo attached successfully!");
}

if (cameraBtn) cameraBtn.addEventListener("click", openCameraModal);
if (closeCameraBtn) closeCameraBtn.addEventListener("click", closeCameraModal);
if (switchCameraBtn) switchCameraBtn.addEventListener("click", switchCamera);
if (shutterBtn) shutterBtn.addEventListener("click", capturePhoto);
if (retakePhotoBtn) retakePhotoBtn.addEventListener("click", retakePhoto);
if (acceptPhotoBtn) acceptPhotoBtn.addEventListener("click", acceptPhoto);

if (cameraModal) {
  cameraModal.addEventListener("click", (e) => {
    if (e.target === cameraModal) closeCameraModal();
  });
}

// -- Lightbox Logic ----------------------------------------------------------
function openLightbox(src, caption = "") {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = src;
  if (lightboxCaption) lightboxCaption.textContent = caption;
  lightboxModal.classList.remove("hidden");
}

function closeLightbox() {
  if (lightboxModal) lightboxModal.classList.add("hidden");
}

if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);
if (lightboxModal) {
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal || e.target === closeLightboxBtn) closeLightbox();
  });
}


// -- Copy Message Helper -----------------------------------------------------
function copyMessageText(text) {
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Copied to clipboard!");
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const t = document.createElement("textarea");
  t.value = text;
  document.body.appendChild(t);
  t.select();
  try {
    document.execCommand("copy");
    showToast("📋 Copied to clipboard!");
  } catch (e) {
    showToast("⚠️ Could not copy");
  }
  document.body.removeChild(t);
}

// -- Inline Message Edit Mode ------------------------------------------------
function enterMessageEditMode(msgIndex, rowEl, bubbleEl, originalText, attachments = []) {
  if (bubbleEl.classList.contains("editing-mode")) return;

  const conv = getCurrentConversation();
  let actualIndex = msgIndex;
  if (actualIndex === null || !conv.messages[actualIndex]) {
    actualIndex = conv.messages.findIndex(m => m.type === "user" && m.text === originalText);
  }
  if (actualIndex === -1 || !conv.messages[actualIndex]) return;

  bubbleEl.classList.add("editing-mode");

  bubbleEl.innerHTML = `
    <div class="inline-edit-box">
      <textarea class="inline-edit-textarea" rows="1" aria-label="Edit message">${originalText}</textarea>
      <div class="inline-edit-actions">
        <button type="button" class="edit-cancel-btn">Cancel</button>
        <button type="button" class="edit-save-btn">Save & Submit</button>
      </div>
    </div>
  `;

  const textarea = bubbleEl.querySelector(".inline-edit-textarea");
  const cancelBtn = bubbleEl.querySelector(".edit-cancel-btn");
  const saveBtn = bubbleEl.querySelector(".edit-save-btn");

  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  const autoResizeEdit = () => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + "px";
  };
  autoResizeEdit();
  textarea.addEventListener("input", autoResizeEdit);

  cancelBtn.onclick = (e) => {
    e.stopPropagation();
    renderAllMessages();
  };

  const doSubmit = async () => {
    const updatedText = textarea.value.trim();
    if (!updatedText) {
      showToast("⚠️ Message cannot be empty");
      return;
    }

    if (updatedText === originalText) {
      renderAllMessages();
      return;
    }

    // Update message in conversation
    conv.messages[actualIndex].text = updatedText;
    conv.messages[actualIndex].time = getCurrentTime();

    // Truncate conversation to this message so AI responds fresh to the edited prompt
    conv.messages = conv.messages.slice(0, actualIndex + 1);
    saveConversationsToStorage();
    renderAllMessages();

    // Trigger AI response for the edited query
    showTyping();
    const reply = await getBotReply(updatedText, conv.messages[actualIndex].attachments || []);
    hideTyping();
    addMessage(reply, "bot");
    showToast("✨ Message updated & re-answered!");
  };

  saveBtn.onclick = (e) => {
    e.stopPropagation();
    doSubmit();
  };

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSubmit();
    } else if (e.key === "Escape") {
      renderAllMessages();
    }
  });
}

// -- Render All Messages -----------------------------------------------------
function renderAllMessages() {
  chatWindow.innerHTML = "";
  const conv = getCurrentConversation();
  if (!conv || !conv.messages) return;

  conv.messages.forEach((msg, idx) => {
    renderMessage(msg.text, msg.type, msg.time, msg.attachments || [], idx);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderMessage(text, type, time = getCurrentTime(), attachments = [], msgIndex = null) {
  const row = document.createElement("div");
  row.className = `message-row ${type}`;
  if (msgIndex !== null) {
    row.dataset.index = msgIndex;
  }

  if (type === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = botMiniSvg;
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  // Render attached images or documents if present
  if (attachments && attachments.length > 0) {
    const attContainer = document.createElement("div");
    attContainer.className = "message-attachments";

    attachments.forEach(att => {
      if (att.type === "image" && att.dataUrl) {
        const wrap = document.createElement("div");
        wrap.className = "attached-img-wrap";
        const img = document.createElement("img");
        img.src = att.dataUrl;
        img.className = "attached-img";
        img.alt = att.name || "Attached image";
        img.title = "Click to view full size";
        wrap.onclick = () => openLightbox(att.dataUrl, att.name);
        wrap.appendChild(img);
        attContainer.appendChild(wrap);
      } else {
        const badge = document.createElement("div");
        badge.className = "attached-doc-badge";
        const icon = att.name && att.name.endsWith(".pdf") ? "📕" : "📄";
        badge.innerHTML = `<span>${icon}</span><span>${att.name || "Document"}</span> <span style="opacity:0.7; font-size:0.7rem;">(${formatFileSize(att.size || 0)})</span>`;
        attContainer.appendChild(badge);
      }
    });

    bubble.appendChild(attContainer);
  }
  
  if (type === "bot") {
    const textDiv = document.createElement("div");
    textDiv.innerHTML = formatMarkdown(text);
    bubble.appendChild(textDiv);
  } else {
    if (text) {
      const textDiv = document.createElement("div");
      textDiv.className = "message-text-content";
      textDiv.textContent = text;
      bubble.appendChild(textDiv);
    }
  }

  const timeSpan = document.createElement("span");
  timeSpan.className = "message-time";
  timeSpan.textContent = time;
  bubble.appendChild(timeSpan);

  // Message Action Bar (Edit & Copy)
  const actionBar = document.createElement("div");
  actionBar.className = "message-action-bar";

  // Edit button for user messages
  if (type === "user") {
    const editBtn = document.createElement("button");
    editBtn.className = "msg-action-btn edit-msg-btn";
    editBtn.title = "Edit this message";
    editBtn.setAttribute("aria-label", "Edit message");
    editBtn.innerHTML = editSvg;
    editBtn.onclick = (e) => {
      e.stopPropagation();
      enterMessageEditMode(msgIndex, row, bubble, text, attachments);
    };
    actionBar.appendChild(editBtn);
  }

  // Copy button
  const copyBtn = document.createElement("button");
  copyBtn.className = "msg-action-btn copy-msg-btn";
  copyBtn.title = "Copy message";
  copyBtn.setAttribute("aria-label", "Copy message");
  copyBtn.innerHTML = copySvg;
  copyBtn.onclick = (e) => {
    e.stopPropagation();
    copyMessageText(text);
  };
  actionBar.appendChild(copyBtn);

  if (type === "user") {
    row.appendChild(actionBar);
    row.appendChild(bubble);
  } else {
    row.appendChild(bubble);
    row.appendChild(actionBar);
  }

  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(text, type, attachments = []) {
  const time = getCurrentTime();
  const conv = getCurrentConversation();
  const newIndex = conv.messages.length;
  conv.messages.push({ text, type, time, attachments });

  renderMessage(text, type, time, attachments, newIndex);

  if (type === "user" && (conv.title === "New Conversation" || !conv.title)) {
    const displayTitle = text || (attachments.length > 0 ? attachments[0].name : "New Conversation");
    conv.title = displayTitle.length > 28 ? displayTitle.substring(0, 26) + "..." : displayTitle;
    updateHeaderTitle(conv.title);
  }

  saveConversationsToStorage();
  renderConversationsList();
}

// -- Typing Indicator --------------------------------------------------------
function showTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.id = "typing-row";

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.innerHTML = botMiniSvg;

  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-dots";
  typingDiv.innerHTML = "<span></span><span></span><span></span>";

  row.appendChild(avatar);
  row.appendChild(typingDiv);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function hideTyping() {
  const typingRow = document.getElementById("typing-row");
  if (typingRow) typingRow.remove();
}

// ============================================================================
// 1. SMART INSTANT MATH & COMPUTATION ENGINE
// ============================================================================
function tryCalculateMath(input) {
  if (!input || typeof input !== "string") return null;
  const clean = input.trim().toLowerCase();

  // Handle percentage questions e.g. "15% of 250" or "what is 20% of 500"
  const percentMatch = clean.match(/(?:what is\s+|calculate\s+|find\s+)?(\d+(?:\.\d+)?)\s*%\s*(?:of)?\s*(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const p = parseFloat(percentMatch[1]);
    const total = parseFloat(percentMatch[2]);
    const result = (p / 100) * total;
    return `🧮 **Math Calculation:**\n${p}% of ${total} = **${result}**`;
  }

  // Strip prefixes & punctuation
  const stripped = clean
    .replace(/^(calculate|solve|evaluate|what is|compute|find|tell me)\s+/i, "")
    .replace(/[?!=]/g, "")
    .trim();

  // Match standard arithmetic: digits, operators, parens, decimal, powers
  if (/^[\d\s\+\-\*\/\.\(\)\^]+$/.test(stripped) && /[\+\-\*\/\^]/.test(stripped)) {
    try {
      const sanitized = stripped.replace(/\^/g, "**").replace(/[^0-9\+\-\*\/\.\(\)]/g, "");
      // Disallow illegal patterns
      if (!/(\*\*|\+\+|\-\-|\/\/)/.test(sanitized.replace(/\*\*/g, ""))) {
        const result = Function(`'use strict'; return (${sanitized})`)();
        if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
          return `🧮 **Math Calculation:**\n\`${stripped}\` = **${result}**`;
        }
      }
    } catch (e) {}
  }
  return null;
}

// ============================================================================
// 2. LIVE WEB & ENCYCLOPEDIC KNOWLEDGE RETRIEVAL
// ============================================================================
async function fetchFullWebKnowledge(query) {
  if (!query || typeof query !== "string") return null;

  const cleanQuery = query
    .replace(/^(tell me about|who is|what is|information regarding|info on|explain|where is|give me details on|details of|price of|can you explain|history of|summary of)\s+/i, "")
    .replace(/[?.,!]/g, "")
    .trim();

  if (!cleanQuery || cleanQuery.length < 2) return null;

  try {
    // 1. Direct Wikipedia REST Summary API (fastest & high-fidelity factual extract)
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
    const summaryRes = await fetch(summaryUrl, {
      headers: { "Accept": "application/json" }
    }).catch(() => null);

    if (summaryRes && summaryRes.ok) {
      const data = await summaryRes.json().catch(() => null);
      if (data && data.extract && data.type !== "disambiguation" && data.extract.length > 35) {
        return {
          title: data.title,
          extract: data.extract,
          url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`
        };
      }
    }

    // 2. Wikipedia OpenSearch lookup if direct title didn't resolve directly
    const sUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQuery)}&limit=3&format=json&origin=*`;
    const sRes = await fetch(sUrl).catch(() => null);
    if (sRes && sRes.ok) {
      const sData = await sRes.json().catch(() => null);
      if (sData && sData[1] && sData[1].length > 0) {
        for (const title of sData[1]) {
          const candRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`).catch(() => null);
          if (candRes && candRes.ok) {
            const candData = await candRes.json().catch(() => null);
            if (candData && candData.extract && candData.type !== "disambiguation" && candData.extract.length > 35) {
              return {
                title: candData.title,
                extract: candData.extract,
                url: candData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(candData.title)}`
              };
            }
          }
        }
      }
    }

    // 3. DuckDuckGo Instant Knowledge API
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl).catch(() => null);
    if (ddgRes && ddgRes.ok) {
      const ddgData = await ddgRes.json().catch(() => null);
      if (ddgData && ddgData.Abstract && ddgData.Abstract.length > 30) {
        return {
          title: ddgData.Heading || cleanQuery,
          extract: ddgData.Abstract,
          url: ddgData.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}`
        };
      }
    }
  } catch (e) {
    console.warn("Web knowledge lookup error:", e);
  }

  return null;
}

// ============================================================================
// 3. SMART BUILT-IN ENCYCLOPEDIA & ACCURATE OFFLINE RESPONSES
// ============================================================================
function getSmartOfflineReply(userText, attachments = []) {
  const clean = userText.trim().toLowerCase();

  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  // Name recognition & storage
  const nameMatch = userText.match(/(?:my name is|i am|call me|name's)\s+([a-zA-Z]+)/i);
  if (nameMatch && nameMatch[1]) {
    userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    localStorage.setItem("user_name", userName);
    return `Nice to meet you, **${userName}**! 👋 I have remembered your name. How can I assist you today?`;
  }

  if (clean.includes("what is my name") || clean.includes("who am i") || clean.includes("do you know my name")) {
    return userName ? `Your name is **${userName}**! 😊` : "You haven't told me your name yet. What should I call you?";
  }

  if (clean === "hi" || clean === "hello" || clean === "hey" || clean.startsWith("hi ") || clean.startsWith("hello ")) {
    return `Hello **${userName}**! 👋 I am your AI Assistant developed by **Pawan Solunke**. How can I help you today? Ask me any question, math problem, or code request!`;
  }

  // Developer credit query
  if (clean.includes("pawan") || clean.includes("who developed you") || clean.includes("who created you") || clean.includes("who made you") || clean.includes("developer") || clean.includes("creator")) {
    return `👨‍💻 **Developed by Pawan Solunke!**\n\nI am an advanced **AI Chat Assistant**, engineered and developed by **Pawan Solunke**.\n\n✨ **Key Capabilities:**\n• Multi-tier Intelligence (Free Unified AI, Google Gemini, OpenAI)\n• 📷 Live Camera module with photo capture & instant attachment\n• 📎 Document & code parser (PDF, TXT, CSV, JSON, code files)\n• 🌐 Live Web Search & knowledge grounding\n• 🧮 Instant Math & percentage calculator`;
  }

  // Programming: Python
  if (clean === "python" || clean.includes("what is python") || clean.includes("python language")) {
    return `🐍 **Python Programming Language**

**Python** is a high-level, interpreted, general-purpose programming language created by **Guido van Rossum** and first released in 1991.

### Key Highlights:
• **Design Philosophy:** Emphasizes code readability with significant indentation and clean syntax.
• **Typing:** Dynamically typed with automatic garbage collection.
• **Core Paradigms:** Supports Object-Oriented, Functional, and Procedural programming.
• **Popular Libraries:**
  - *Data Science & AI:* NumPy, Pandas, Scikit-learn, PyTorch, TensorFlow
  - *Web Development:* Django, Flask, FastAPI
  - *Automation:* Selenium, Requests, BeautifulSoup

### Example:
\`\`\`python
# Simple Python Hello World and List Comprehension
names = ["Alice", "Bob", "Pawan"]
greetings = [f"Hello, {name}!" for name in names]
print("\\n".join(greetings))
\`\`\``;
  }

  // Programming: JavaScript
  if (clean === "javascript" || clean.includes("what is javascript") || clean.includes("js")) {
    return `⚡ **JavaScript (JS)**

**JavaScript** is a lightweight, interpreted (or just-in-time compiled) programming language with first-class functions, famous as the scripting language for Web pages.

### Key Features:
• **Dynamic & Prototype-based:** Multi-paradigm language supporting event-driven, functional, and imperative programming.
• **Engines:** Powered by high-speed engines like V8 (Chrome, Node.js), SpiderMonkey (Firefox), and JavaScriptCore (Safari).
• **Runtime Ecosystem:** Runs in browsers and on servers via Node.js, Deno, and Bun.

### Example:
\`\`\`javascript
// Asynchronous fetch example in Modern JavaScript
async function getUserData(username) {
  const response = await fetch(\`https://api.github.com/users/\${username}\`);
  const data = await response.json();
  return data.name;
}
\`\`\``;
  }

  // Science: Photosynthesis
  if (clean.includes("photosynthesis")) {
    return `🌱 **Photosynthesis**

**Photosynthesis** is the biological process used by plants, algae, and certain bacteria to convert light energy into chemical energy stored in glucose.

### Chemical Equation:
\`6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\`

### Two Main Stages:
1. **Light-Dependent Reactions (Thylakoid Membrane):** Sunlight is absorbed by chlorophyll, splitting water molecules (H₂O) and generating ATP, NADPH, and oxygen (O₂).
2. **Light-Independent Reactions (Calvin Cycle / Stroma):** CO₂ is fixed into carbohydrates using the ATP and NADPH generated in the first stage.`;
  }

  // Lord Mahadev
  if (clean.includes("mahadev") || clean.includes("shiva") || clean.includes("bholenath") || clean.includes("shankar")) {
    return `🕉️ **Lord Mahadev (Shiva) - Complete Guide**

**1. Divine Identity:**
• **Mahādeva** literally translates to *"The Great God"* or *"Supreme Divine Reality"*.
• In the Hindu Trimurti (Brahma the Creator, Vishnu the Preserver, Shiva the Transformer), Shiva represents the **destroyer of ego, ignorance, and cosmic illusion (Maya)**.
• In Shaivism, he is worshipped as **Parashiva**—the timeless, formless, omnipresent consciousness.

**2. Sacred Iconography & Deep Symbolism:**
• **Trishula (Trident):** Symbolizes sovereignty over the three Gunas (*Sattva*, *Rajas*, *Tamas*) and time (past, present, future).
• **Third Eye (Trinetra):** The eye of transcendental intuition that burns away ignorance.
• **Holy River Ganga:** Flowing from his locks (*Jatadhari*), depicting the descent of spiritual wisdom to earth.
• **Neelkantha (The Blue Throat):** Drank the cosmic poison (*Halahala*) during *Samudra Manthan* to protect all beings.
• **Damru (Hourglass Drum):** Emits the primordial vibration of cosmic creation (*AUM*).`;
  }

  // iPhone 17 & Apple
  if (clean.includes("iphone 17") || clean.includes("iphone17") || (clean.includes("iphone") && clean.includes("17"))) {
    return `📱 **Apple iPhone 17 Series - Overview**

**1. Anticipated Models:**
• **iPhone 17 (Standard):** Baseline flagship with 6.27-inch LTPO OLED display.
• **iPhone 17 Air (Slim):** All-new ultra-thin chassis replacing the Plus model.
• **iPhone 17 Pro & iPhone 17 Pro Max:** Powered by A19 Pro silicon with 12GB RAM for on-device Apple Intelligence.

**2. Key Features:**
• **120Hz ProMotion on All Models:** Smooth refresh rates across both standard and Pro lineups.
• **Upgraded Front Camera:** 24MP sensor for significantly sharper video and selfies.
• **A19 Silicon:** Next-generation 3nm architecture delivering peak GPU and NPU performance.`;
  }

  // Cybersecurity
  if (clean.includes("cyber security") || clean.includes("cybersecurity") || clean.includes("security")) {
    return `🛡️ **Cybersecurity Guide**

**Cybersecurity** is the practice of protecting networks, devices, and data from unauthorized access or criminal use.

### The CIA Triad:
• **Confidentiality:** Ensuring sensitive data is accessed only by authorized parties (AES-256 encryption, IAM).
• **Integrity:** Maintaining the consistency, accuracy, and trustworthiness of data over its life cycle (SHA-256 hashing).
• **Availability:** Guaranteeing authorized users have dependable access to information systems (DDoS protection, redundancy).

### Key Best Practices:
• Enforce **Multi-Factor Authentication (MFA)**.
• Implement a **Zero-Trust Architecture** ("Never trust, always verify").
• Keep software and dependencies updated against known CVE vulnerabilities.`;
  }

  // Google
  if (clean.includes("google") && (clean.includes("who") || clean.includes("ceo") || clean.includes("founded") || clean.includes("info"))) {
    return `🌐 **Google LLC Overview**

• **Founders:** Larry Page and Sergey Brin (September 4, 1998, at Stanford University).
• **CEO:** Sundar Pichai (leading Google and Alphabet Inc.).
• **Headquarters:** Mountain View, California, USA.
• **Flagship Products:** Google Search, YouTube, Android, Google Chrome, Gmail, Google Cloud, and Gemini AI.`;
  }

  // Quantum computing
  if (clean.includes("quantum")) {
    return `⚛️ **Quantum Computing Overview**

Traditional computers calculate using binary bits (0 or 1). Quantum computers use **qubits**, which can exist in multiple states simultaneously.

### Core Principles:
• **Superposition:** Allows qubits to represent 0, 1, or both, enabling vast parallel computation.
• **Entanglement:** Qubits become fundamentally linked, so the state of one instantly dictates the state of another.
• **Quantum Interference:** Directs computational probabilities toward the correct solution while canceling errors.`;
  }

  // Jokes
  if (clean.includes("joke")) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "Why did the JavaScript developer wear glasses? Because they didn't C#! 😄",
      "There are 10 types of people in the world: those who understand binary, and those who don't. 💻",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍺"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Honest, helpful offline notice for unknown topics
  const topicTitle = userText.charAt(0).toUpperCase() + userText.slice(1);
  return `📡 **Offline Mode Notice**

I am currently operating in offline mode and do not have local cached records for **"${topicTitle}"**.

💡 **To get full, live answers:**
1. Switch to **Free Unified AI** in ⚙️ **Settings** (includes live reasoning and Google Search).
2. Make sure your internet connection is active.
3. Or enter a **Google Gemini** or **OpenAI** API key in ⚙️ **Settings** for unlimited live model responses.`;
}

// ============================================================================
// 4. UNIFIED FREE LIVE AI ENGINE WITH WEB KNOWLEDGE GROUNDING
// ============================================================================
async function getFreeLiveAIReply(userText, attachments = []) {
  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  // Retrieve grounded web knowledge if web search is enabled
  let webKnowledge = null;
  if (isWebSearchEnabled) {
    webKnowledge = await fetchFullWebKnowledge(userText);
  }

  // Build conversational history from current conversation (last 6 messages)
  const conv = getCurrentConversation();
  const historyMsgs = [];
  if (conv && conv.messages && conv.messages.length > 0) {
    const priorMsgs = conv.messages.slice(-7, -1);
    priorMsgs.forEach(m => {
      if (m.text && typeof m.text === "string") {
        historyMsgs.push({
          role: m.type === "user" ? "user" : "assistant",
          content: m.text
        });
      }
    });
  }

  // Build document text content from attachments
  let attachmentContext = "";
  if (attachments && attachments.length > 0) {
    const docParts = attachments
      .filter(a => a.textContent)
      .map(a => `[Attached Document "${a.name}"]:\n${a.textContent.slice(0, 10000)}`);
    if (docParts.length > 0) {
      attachmentContext = docParts.join("\n\n") + "\n\n";
    }
  }

  // Grounding web context
  let groundingContext = "";
  if (webKnowledge && webKnowledge.extract) {
    groundingContext = `\n\n[Verified Reference Knowledge]:\nTopic: ${webKnowledge.title}\nDetails: ${webKnowledge.extract}\nSource: ${webKnowledge.url}`;
  }

  const systemPrompt = `You are an intelligent, highly knowledgeable, and friendly AI Assistant.
- Provide accurate, factual, well-structured, and helpful answers for ${userName}.
- For programming questions, always format code in clean markdown code blocks with the proper language identifier.
- For factual or scientific queries, give verified and precise information.
- If reference knowledge is provided, incorporate it to guarantee maximum factual accuracy.
- Keep answers direct and proportional: concise for simple questions, comprehensive for in-depth inquiries.`;

  const messagesPayload = [
    { role: "system", content: systemPrompt },
    ...historyMsgs,
    { role: "user", content: `${attachmentContext}${userText}${groundingContext}` }
  ];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messagesPayload,
        model: "openai-fast"
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const text = await res.text();
      const cleanReply = text ? text.trim() : "";
      if (cleanReply.length > 0 && cleanReply !== "{}" && !cleanReply.includes("Payment Required")) {
        let finalReply = cleanReply;
        if (webKnowledge && webKnowledge.url && !finalReply.includes(webKnowledge.url)) {
          finalReply += `\n\n🌐 **Source:** [${webKnowledge.title}](${webKnowledge.url})`;
        }
        return finalReply;
      }
    }
  } catch (aiErr) {
    console.warn("Free AI service delayed or offline, checking web knowledge fallback...", aiErr);
  }

  // Fallback 1: If live AI failed but web knowledge was retrieved, return the verified extract directly
  if (webKnowledge && webKnowledge.extract) {
    return `🌐 **${webKnowledge.title}**\n\n${webKnowledge.extract}\n\n🔗 **Source Reference:** [Read full encyclopedic article](${webKnowledge.url})`;
  }

  // Fallback 2: Offline encyclopedia & helpful guidance
  return getSmartOfflineReply(userText, attachments);
}

// ============================================================================
// 5. GOOGLE GEMINI API (MULTIMODAL VISION & CHAT)
// ============================================================================
async function getGeminiReply(userText, attachments = []) {
  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  if (!geminiApiKey) {
    showToast("⚠️ Enter Gemini API Key in ⚙️ Settings or use Free Mode");
    return await getFreeLiveAIReply(userText, attachments);
  }

  const key = geminiApiKey.trim();
  const currentParts = [];

  // 1. Attach document texts
  if (attachments && attachments.length > 0) {
    attachments.filter(a => a.textContent).forEach(doc => {
      currentParts.push({
        text: `[Attached Document "${doc.name}"]:\n${doc.textContent.slice(0, 10000)}`
      });
    });

    // 2. Attach images for Gemini Multimodal Vision
    attachments.filter(a => a.type === "image" && a.dataUrl).forEach(img => {
      const base64Data = img.dataUrl.includes(",") ? img.dataUrl.split(",")[1] : img.dataUrl;
      currentParts.push({
        inline_data: {
          mime_type: img.mimeType || "image/jpeg",
          data: base64Data
        }
      });
    });
  }

  currentParts.push({ text: userText });

  // Multi-turn conversation contents
  const conv = getCurrentConversation();
  const contents = [];
  if (conv && conv.messages && conv.messages.length > 0) {
    const prior = conv.messages.slice(-7, -1);
    prior.forEach(m => {
      if (m.text) {
        contents.push({
          role: m.type === "user" ? "user" : "model",
          parts: [{ text: m.text }]
        });
      }
    });
  }
  contents.push({ role: "user", parts: currentParts });

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  // Try direct fast models: gemini-1.5-flash first, then gemini-2.0-flash, then gemini-1.5-pro
  const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
  for (const model of modelsToTry) {
    try {
      const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (genRes.ok) {
        const genData = await genRes.json();
        const reply = genData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      }
    } catch (err) {
      console.warn(`Gemini ${model} request failed:`, err);
    }
  }

  showToast("⚠️ Gemini API error - falling back to Free Unified AI");
  return await getFreeLiveAIReply(userText, attachments);
}

// ============================================================================
// 6. OPENAI (CHATGPT) API
// ============================================================================
async function getOpenAIReply(userText, attachments = []) {
  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  if (!openaiApiKey) {
    showToast("⚠️ Enter OpenAI Key in ⚙️ Settings");
    return await getFreeLiveAIReply(userText, attachments);
  }

  // Prepare document text if present
  let docContext = "";
  if (attachments && attachments.length > 0) {
    const docs = attachments
      .filter(a => a.textContent)
      .map(a => `[Attached Document "${a.name}"]:\n${a.textContent.slice(0, 8000)}`);
    if (docs.length > 0) docContext = docs.join("\n\n") + "\n\n";
  }

  // Conversation history
  const conv = getCurrentConversation();
  const historyMsgs = [];
  if (conv && conv.messages && conv.messages.length > 0) {
    const prior = conv.messages.slice(-7, -1);
    prior.forEach(m => {
      if (m.text) {
        historyMsgs.push({
          role: m.type === "user" ? "user" : "assistant",
          content: m.text
        });
      }
    });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey.trim()}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `You are ChatGPT. Answer with factual accuracy, clean formatting, and clear structured markdown for ${userName}.` },
          ...historyMsgs,
          { role: "user", content: `${docContext}${userText}` }
        ]
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "(No response received from OpenAI)";
    }
  } catch (e) {
    console.warn("OpenAI call error:", e);
  }

  return await getFreeLiveAIReply(userText, attachments);
}

// ============================================================================
// 7. MASTER BOT REPLY DISPATCHER
// ============================================================================
async function getBotReply(userText, attachments = []) {
  const mathCheck = tryCalculateMath(userText);
  if (mathCheck) {
    await new Promise(r => setTimeout(r, 150));
    return mathCheck;
  }

  if (currentMode === "free") {
    return await getFreeLiveAIReply(userText, attachments);
  } else if (currentMode === "gemini") {
    return await getGeminiReply(userText, attachments);
  } else if (currentMode === "openai") {
    return await getOpenAIReply(userText, attachments);
  } else {
    await new Promise(r => setTimeout(r, 200));
    return getSmartOfflineReply(userText, attachments);
  }
}

// -- Send Handler ------------------------------------------------------------
async function handleSend() {
  const text = userInput.value.trim();
  const currentAttachments = [...stagedAttachments];

  if (!text && currentAttachments.length === 0) return;

  // Clear staged attachments
  stagedAttachments = [];
  renderAttachmentTray();

  addMessage(text, "user", currentAttachments);
  userInput.value = "";
  autoResizeTextarea();

  sendBtn.disabled = true;
  showTyping();

  const reply = await getBotReply(text, currentAttachments);

  hideTyping();
  addMessage(reply, "bot");
  sendBtn.disabled = false;
  userInput.focus();
}

// -- Clear Current Chat ------------------------------------------------------
function clearCurrentChat() {
  const conv = getCurrentConversation();
  conv.messages = [];
  saveConversationsToStorage();
  chatWindow.innerHTML = "";
  renderMessage(`Chat cleared. What would you like to discuss next, ${userName}? ✨`, "bot");
  conv.messages.push({ text: `Chat cleared. What would you like to discuss next, ${userName}? ✨`, type: "bot", time: getCurrentTime() });
  saveConversationsToStorage();
  renderConversationsList();
  showToast("Chat cleared.");
}

// -- Auto-Resize Textarea ----------------------------------------------------
function autoResizeTextarea() {
  userInput.style.height = "auto";
  const newHeight = Math.min(userInput.scrollHeight, 110);
  userInput.style.height = Math.max(newHeight, 44) + "px";
  userInput.style.overflowY = userInput.scrollHeight > 110 ? "auto" : "hidden";
}

// -- Theme Toggle ------------------------------------------------------------
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.innerHTML = theme === "dark" ? sunSvg : moonSvg;
  themeToggle.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  localStorage.setItem("theme", theme);
}

// -- Web Search Toggle -------------------------------------------------------
function toggleWebSearch() {
  isWebSearchEnabled = !isWebSearchEnabled;
  localStorage.setItem("web_search_enabled", isWebSearchEnabled);
  updateWebSearchUI();
  showToast(isWebSearchEnabled ? "🌐 Live Web Search: Enabled" : "🌐 Live Web Search: Disabled");
}

function updateWebSearchUI() {
  if (webSearchToggle) {
    if (isWebSearchEnabled) {
      webSearchToggle.classList.add("active");
      webSearchToggle.innerHTML = '<span class="pulse-dot"></span> 🌐 Web Search: ON';
    } else {
      webSearchToggle.classList.remove("active");
      webSearchToggle.innerHTML = '🌐 Web Search: OFF';
    }
  }
}

// -- Provider Badge Update ---------------------------------------------------
function updateProviderBadge() {
  const labels = {
    free: "Unified AI (ChatGPT + Gemini + Web)",
    gemini: "Google Gemini (Official)",
    openai: "OpenAI ChatGPT (Official)",
    offline: "Smart Offline (Local)"
  };
  providerBadge.textContent = labels[currentMode] || "AI Assistant";
}

// -- Settings Modal Handlers -------------------------------------------------
function openSettingsModal() {
  aiModeSelect.value = currentMode;
  userNameInput.value = userName;
  if (googleClientIdInput) {
    googleClientIdInput.value = localStorage.getItem("ai_google_client_id") || "";
  }
  updateApiKeyFieldVisibility();
  settingsModal.classList.remove("hidden");
}

function closeSettingsModal() {
  settingsModal.classList.add("hidden");
}

function updateApiKeyFieldVisibility() {
  const mode = aiModeSelect.value;
  if (mode === "gemini") {
    apiKeyContainer.classList.remove("hidden");
    apiKeyLabel.textContent = "Google Gemini API Key:";
    apiKeyInput.value = geminiApiKey;
    apiKeyInput.placeholder = "AIzaSy...";
  } else if (mode === "openai") {
    apiKeyContainer.classList.remove("hidden");
    apiKeyLabel.textContent = "OpenAI API Key:";
    apiKeyInput.value = openaiApiKey;
    apiKeyInput.placeholder = "sk-...";
  } else {
    apiKeyContainer.classList.add("hidden");
  }
}

// Preserve API key as user types
if (apiKeyInput) {
  apiKeyInput.addEventListener("input", () => {
    if (aiModeSelect.value === "gemini") {
      geminiApiKey = apiKeyInput.value.trim();
    } else if (aiModeSelect.value === "openai") {
      openaiApiKey = apiKeyInput.value.trim();
    }
  });
}

function saveSettings() {
  currentMode = aiModeSelect.value;
  localStorage.setItem("ai_mode", currentMode);

  if (userNameInput.value.trim()) {
    userName = userNameInput.value.trim();
    localStorage.setItem("user_name", userName);
  }

  if (googleClientIdInput) {
    const cid = googleClientIdInput.value.trim();
    localStorage.setItem("ai_google_client_id", cid);
    initGoogleIdentityServices();
  }

  if (currentMode === "gemini") {
    geminiApiKey = apiKeyInput.value.trim();
    localStorage.setItem("gemini_api_key", geminiApiKey);
  } else if (currentMode === "openai") {
    openaiApiKey = apiKeyInput.value.trim();
    localStorage.setItem("openai_api_key", openaiApiKey);
  }

  updateProviderBadge();
  closeSettingsModal();
  showToast(`Settings applied: ${providerBadge.textContent}`);
}

// -- Event Listeners ---------------------------------------------------------
sendBtn.addEventListener("click", handleSend);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

userInput.addEventListener("input", autoResizeTextarea);
clearBtn.addEventListener("click", clearCurrentChat);

newChatBtn.addEventListener("click", () => createNewConversation(true));
drawerNewChatBtn.addEventListener("click", () => createNewConversation(true));

historyToggleBtn.addEventListener("click", openHistoryDrawer);
closeDrawerBtn.addEventListener("click", closeHistoryDrawer);

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

if (webSearchToggle) {
  webSearchToggle.addEventListener("click", toggleWebSearch);
}

settingsBtn.addEventListener("click", openSettingsModal);
closeModalBtn.addEventListener("click", closeSettingsModal);
aiModeSelect.addEventListener("change", updateApiKeyFieldVisibility);
saveSettingsBtn.addEventListener("click", saveSettings);

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    closeSettingsModal();
  }
});

if (quickPrompts) {
  quickPrompts.addEventListener("click", (e) => {
    const chip = e.target.closest(".prompt-chip");
    if (chip) {
      userInput.value = chip.dataset.prompt;
      handleSend();
    }
  });
}

// ============================================================================
// CHATGPT-STYLE AUTHENTICATION & USER PROFILE ENGINE
// ============================================================================
let currentAuthTab = "login";

function getUsersFromStorage() {
  try {
    const raw = localStorage.getItem("ai_users");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  
  // Seed default demonstration account
  const seedUsers = [
    {
      id: "usr_pawan",
      name: "Pawan Solunke",
      email: "pawan@example.com",
      password: "password123",
      createdAt: new Date().toLocaleDateString()
    }
  ];
  localStorage.setItem("ai_users", JSON.stringify(seedUsers));
  return seedUsers;
}

function saveUsersToStorage(usersList) {
  localStorage.setItem("ai_users", JSON.stringify(usersList));
}

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function updateAuthUI() {
  if (currentUser) {
    if (authLoginBtn) authLoginBtn.classList.add("hidden");
    if (userProfileMenuWrap) userProfileMenuWrap.classList.remove("hidden");

    const initials = getInitials(currentUser.name);
    if (currentUser.avatar) {
      if (userAvatarInitials) {
        userAvatarInitials.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`;
      }
      if (dropdownAvatarCircle) {
        dropdownAvatarCircle.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`;
      }
    } else {
      if (userAvatarInitials) userAvatarInitials.textContent = initials;
      if (dropdownAvatarCircle) dropdownAvatarCircle.textContent = initials;
    }

    const firstName = currentUser.name.split(" ")[0];
    if (userHeaderName) userHeaderName.textContent = firstName;
    if (dropdownUserName) dropdownUserName.textContent = currentUser.name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = currentUser.email || "";

    if (dropdownUserBadge) {
      if (currentUser.provider === "gmail" || currentUser.provider === "google") {
        dropdownUserBadge.classList.remove("hidden");
        dropdownUserBadge.innerHTML = "✓ Gmail Verified";
      } else {
        dropdownUserBadge.classList.add("hidden");
      }
    }

    userName = firstName;
    localStorage.setItem("user_name", userName);
  } else {
    if (authLoginBtn) authLoginBtn.classList.remove("hidden");
    if (userProfileMenuWrap) userProfileMenuWrap.classList.add("hidden");
    if (userDropdownCard) userDropdownCard.classList.add("hidden");
    if (userProfileBtn) userProfileBtn.setAttribute("aria-expanded", "false");
    if (dropdownUserBadge) dropdownUserBadge.classList.add("hidden");
  }
}

function showAuthAlert(message, type = "error") {
  if (!authAlert) return;
  authAlert.textContent = message;
  authAlert.className = `auth-alert ${type}`;
  authAlert.classList.remove("hidden");
}

function hideAuthAlert() {
  if (!authAlert) return;
  authAlert.classList.add("hidden");
  authAlert.textContent = "";
}

function setAuthTab(tab) {
  currentAuthTab = tab;
  hideAuthAlert();

  if (tab === "login") {
    authTabLogin.classList.add("active");
    authTabSignup.classList.remove("active");
    authNameGroup.classList.add("hidden");
    authSubmitBtn.querySelector("span").textContent = "Log In";
    document.getElementById("auth-modal-title").textContent = "Welcome Back";
  } else {
    authTabSignup.classList.add("active");
    authTabLogin.classList.remove("active");
    authNameGroup.classList.remove("hidden");
    authSubmitBtn.querySelector("span").textContent = "Create Account";
    document.getElementById("auth-modal-title").textContent = "Create Your Account";
  }
}

function openAuthModal(defaultTab = "login") {
  showStandardAuthView();
  setAuthTab(defaultTab);
  hideAuthAlert();
  if (authForm) authForm.reset();
  if (authPasswordInput) authPasswordInput.type = "password";
  if (authModal) authModal.classList.remove("hidden");
  setTimeout(() => {
    if (defaultTab === "signup" && authNameInput) {
      authNameInput.focus();
    } else if (authEmailInput) {
      authEmailInput.focus();
    }
  }, 120);
}

function closeAuthModal() {
  if (authModal) authModal.classList.add("hidden");
  hideAuthAlert();
}

function handleAuthSubmit() {
  hideAuthAlert();
  const email = authEmailInput.value.trim().toLowerCase();
  const password = authPasswordInput.value;

  if (!email || !password) {
    showAuthAlert("Please fill in all required fields.", "error");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAuthAlert("Please enter a valid email address.", "error");
    return;
  }

  if (password.length < 6) {
    showAuthAlert("Password must be at least 6 characters.", "error");
    return;
  }

  const users = getUsersFromStorage();

  if (currentAuthTab === "login") {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      showAuthAlert("Invalid email or password. Demo account: pawan@example.com / password123", "error");
      return;
    }

    currentUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email
    };
    localStorage.setItem("ai_current_user", JSON.stringify(currentUser));
    showAuthAlert(`Welcome back, ${currentUser.name}! Logging in...`, "success");

    setTimeout(() => {
      closeAuthModal();
      updateAuthUI();
      loadConversationsFromStorage();
      renderAllMessages();
      renderConversationsList();
      showToast(`👋 Welcome back, ${currentUser.name}!`);
    }, 450);

  } else {
    const name = authNameInput.value.trim();
    if (!name) {
      showAuthAlert("Please enter your full name.", "error");
      return;
    }

    const exists = users.some(u => u.email === email);
    if (exists) {
      showAuthAlert("An account with this email already exists. Please Log In.", "error");
      return;
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: name,
      email: email,
      password: password,
      createdAt: new Date().toLocaleDateString()
    };
    users.push(newUser);
    saveUsersToStorage(users);

    currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
    localStorage.setItem("ai_current_user", JSON.stringify(currentUser));

    showAuthAlert("Account created successfully! Logging you in...", "success");

    setTimeout(() => {
      closeAuthModal();
      updateAuthUI();
      loadConversationsFromStorage();
      renderAllMessages();
      renderConversationsList();
      showToast(`🎉 Account created! Welcome, ${name}!`);
    }, 450);
  }
}

// Dedicated Gmail View Switchers
function showGmailAuthView() {
  if (authStandardView) authStandardView.classList.add("hidden");
  if (authGmailView) authGmailView.classList.remove("hidden");
  hideAuthAlert();
  if (gmailEmailInput) {
    gmailEmailInput.value = "";
    gmailEmailInput.focus();
  }
  if (gmailNameInput) gmailNameInput.value = "";
  if (gmailPasswordInput) gmailPasswordInput.value = "";
  initGoogleIdentityServices();
}

function showStandardAuthView() {
  if (authGmailView) authGmailView.classList.add("hidden");
  if (authStandardView) authStandardView.classList.remove("hidden");
  hideAuthAlert();
}

// Personal Gmail Login Handler
function handleGmailAuthSubmit() {
  hideAuthAlert();
  const email = gmailEmailInput ? gmailEmailInput.value.trim().toLowerCase() : "";
  let name = gmailNameInput ? gmailNameInput.value.trim() : "";
  const password = gmailPasswordInput ? gmailPasswordInput.value : "";

  if (!email) {
    showAuthAlert("Please enter your Gmail address.", "error");
    return;
  }

  const isGmail = /^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$/i.test(email);
  if (!isGmail) {
    showAuthAlert("Please enter a valid personal Gmail address ending in @gmail.com", "error");
    return;
  }

  if (!password || password.length < 6) {
    showAuthAlert("Password must be at least 6 characters.", "error");
    return;
  }

  if (!name) {
    const prefix = email.split("@")[0].replace(/[._-]+/g, " ");
    name = prefix.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  const users = getUsersFromStorage();
  let user = users.find(u => u.email === email);

  if (user) {
    if (user.password && user.password !== password) {
      showAuthAlert("Incorrect password for this Gmail account.", "error");
      return;
    }
    if (name) user.name = name;
    user.provider = "gmail";
    saveUsersToStorage(users);
  } else {
    user = {
      id: "usr_gmail_" + Date.now(),
      name: name,
      email: email,
      password: password,
      provider: "gmail",
      createdAt: new Date().toLocaleDateString()
    };
    users.push(user);
    saveUsersToStorage(users);
  }

  currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: "gmail"
  };
  localStorage.setItem("ai_current_user", JSON.stringify(currentUser));

  showAuthAlert(`Signed in as ${user.name}! Syncing your chats...`, "success");

  setTimeout(() => {
    closeAuthModal();
    updateAuthUI();
    loadConversationsFromStorage();
    renderAllMessages();
    renderConversationsList();
    showToast(`✉️ Signed in with Gmail as ${user.name}!`);
  }, 450);
}

// Google Identity Services (GIS) / 1-Tap OAuth
function initGoogleIdentityServices() {
  const clientId = localStorage.getItem("ai_google_client_id") || "";
  if (!googleGisContainer) return;

  if (clientId && window.google && window.google.accounts && window.google.accounts.id) {
    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      googleGisContainer.innerHTML = "";
      google.accounts.id.renderButton(googleGisContainer, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "signin_with",
        logo_alignment: "left",
        width: 320
      });
      return;
    } catch (err) {
      console.warn("GIS button initialization error:", err);
    }
  }

  googleGisContainer.innerHTML = `
    <div class="gis-helper-info">
      <span>🔑 Enter your personal Gmail below to sign in directly & sync your chats.</span>
    </div>
  `;
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) return;
  const payload = parseJwt(response.credential);
  if (!payload || !payload.email) return;

  const users = getUsersFromStorage();
  let user = users.find(u => u.email === payload.email);

  if (!user) {
    user = {
      id: "usr_google_" + (payload.sub || Date.now()),
      name: payload.name || payload.email.split("@")[0],
      email: payload.email,
      avatar: payload.picture || "",
      provider: "google",
      createdAt: new Date().toLocaleDateString()
    };
    users.push(user);
    saveUsersToStorage(users);
  } else {
    if (payload.picture) user.avatar = payload.picture;
    if (payload.name) user.name = payload.name;
    user.provider = "google";
    saveUsersToStorage(users);
  }

  currentUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    provider: "google"
  };
  localStorage.setItem("ai_current_user", JSON.stringify(currentUser));

  closeAuthModal();
  updateAuthUI();
  loadConversationsFromStorage();
  renderAllMessages();
  renderConversationsList();
  showToast(`🌐 Verified Google Sign-In as ${user.name}!`);
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem("ai_current_user");
  userName = "Guest";
  localStorage.setItem("user_name", userName);

  if (userDropdownCard) userDropdownCard.classList.add("hidden");
  if (userProfileBtn) userProfileBtn.setAttribute("aria-expanded", "false");

  updateAuthUI();
  loadConversationsFromStorage();
  renderAllMessages();
  renderConversationsList();
  showToast("🚪 Logged out. You are now in Guest mode.");
}

// Auth Event Listeners
if (authLoginBtn) authLoginBtn.addEventListener("click", () => openAuthModal("login"));
if (closeAuthModalBtn) closeAuthModalBtn.addEventListener("click", closeAuthModal);
if (authTabLogin) authTabLogin.addEventListener("click", () => setAuthTab("login"));
if (authTabSignup) authTabSignup.addEventListener("click", () => setAuthTab("signup"));

if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleAuthSubmit();
  });
}

if (togglePasswordVisibilityBtn && authPasswordInput) {
  togglePasswordVisibilityBtn.addEventListener("click", () => {
    const isPassword = authPasswordInput.type === "password";
    authPasswordInput.type = isPassword ? "text" : "password";
    togglePasswordVisibilityBtn.style.color = isPassword ? "var(--accent-color)" : "";
  });
}

if (authGoogleBtn) authGoogleBtn.addEventListener("click", showGmailAuthView);
if (backToStandardBtn) backToStandardBtn.addEventListener("click", showStandardAuthView);
if (authGuestBtn) authGuestBtn.addEventListener("click", closeAuthModal);

if (gmailAuthForm) {
  gmailAuthForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleGmailAuthSubmit();
  });
}

if (authModal) {
  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuthModal();
  });
}

// User Profile Dropdown Listeners
if (userProfileBtn && userDropdownCard) {
  userProfileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = userProfileBtn.getAttribute("aria-expanded") === "true";
    userProfileBtn.setAttribute("aria-expanded", !isExpanded);
    userDropdownCard.classList.toggle("hidden", isExpanded);
  });
}

if (dropdownSettingsBtn) {
  dropdownSettingsBtn.addEventListener("click", () => {
    if (userDropdownCard) userDropdownCard.classList.add("hidden");
    if (userProfileBtn) userProfileBtn.setAttribute("aria-expanded", "false");
    openSettingsModal();
  });
}

if (dropdownHistoryBtn) {
  dropdownHistoryBtn.addEventListener("click", () => {
    if (userDropdownCard) userDropdownCard.classList.add("hidden");
    if (userProfileBtn) userProfileBtn.setAttribute("aria-expanded", "false");
    openHistoryDrawer();
  });
}

if (dropdownLogoutBtn) {
  dropdownLogoutBtn.addEventListener("click", handleLogout);
}

// Close profile dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (userDropdownCard && !userDropdownCard.classList.contains("hidden")) {
    if (userProfileMenuWrap && !userProfileMenuWrap.contains(e.target)) {
      userDropdownCard.classList.add("hidden");
      if (userProfileBtn) userProfileBtn.setAttribute("aria-expanded", "false");
    }
  }
});

// -- Initializer -------------------------------------------------------------
(function init() {
  if (!localStorage.getItem("ai_mode") || localStorage.getItem("ai_mode") === "offline" || localStorage.getItem("ai_mode") === "gemini") {
    currentMode = "free";
    localStorage.setItem("ai_mode", "free");
  }

  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);
  updateProviderBadge();
  updateWebSearchUI();
  updateAuthUI();
  initGoogleIdentityServices();

  loadConversationsFromStorage();

  const conv = getCurrentConversation();
  if (conv) {
    updateHeaderTitle(conv.title);
    if (conv.messages.length === 0) {
      const welcome = `👋 Hello ${userName}! I am your Unified AI Assistant combining ChatGPT, Gemini, and Google Search. Start chatting or click '+ New Chat' anytime!`;
      renderMessage(welcome, "bot");
      conv.messages.push({ text: welcome, type: "bot", time: getCurrentTime() });
      saveConversationsToStorage();
    } else {
      renderAllMessages();
    }
  }

  renderConversationsList();
  userInput.focus();
})();

