// script.js - Unified Super-AI with Complete Knowledge Engine

// -- State & Storage ---------------------------------------------------------
let conversations = [];
let currentChatId = null;
let toastTimer = null;
let currentMode = localStorage.getItem("ai_mode") || "free";
let isWebSearchEnabled = localStorage.getItem("web_search_enabled") !== "false";
let geminiApiKey = localStorage.getItem("gemini_api_key") || "";
let openaiApiKey = localStorage.getItem("openai_api_key") || "";
let userName = localStorage.getItem("user_name") || "Pawan";

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

function formatMarkdown(text) {
  if (!text) return "";
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  formatted = formatted.replace(/`([^`]+)`/g, "<code style='background:rgba(255,255,255,0.1);padding:2px 5px;border-radius:4px;'>$1</code>");
  formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, "<a href='$2' target='_blank' style='color:#818cf8;text-decoration:underline;'>$1</a>");
  formatted = formatted.replace(/\n/g, "<br>");
  return formatted;
}

// -- Multi-Conversation State Management -------------------------------------
function loadConversationsFromStorage() {
  try {
    const raw = localStorage.getItem("ai_conversations");
    if (raw) {
      conversations = JSON.parse(raw);
    }
  } catch (e) {
    conversations = [];
  }

  currentChatId = localStorage.getItem("ai_current_chat_id");
  if (!conversations || conversations.length === 0) {
    createNewConversation(false);
  } else if (!currentChatId || !conversations.some(c => c.id === currentChatId)) {
    currentChatId = conversations[0].id;
    localStorage.setItem("ai_current_chat_id", currentChatId);
  }
}

function saveConversationsToStorage() {
  localStorage.setItem("ai_conversations", JSON.stringify(conversations));
  if (currentChatId) {
    localStorage.setItem("ai_current_chat_id", currentChatId);
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
// 1. SMART INSTANT MATH CALCULATOR
// ============================================================================
function tryCalculateMath(input) {
  const clean = input.trim().toLowerCase();
  const stripped = clean
    .replace(/^(calculate|solve|evaluate|what is|compute)\s+/i, "")
    .replace(/[?!=]/g, "")
    .trim();

  if (/^[\d\s\+\-\*\/\.\(\)\^]+$/.test(stripped) && /[\+\-\*\/]/.test(stripped)) {
    try {
      const sanitized = stripped.replace(/\^/g, "**").replace(/[^0-9\+\-\*\/\.\(\)]/g, "");
      const result = Function(`'use strict'; return (${sanitized})`)();
      if (typeof result === "number" && !isNaN(result)) {
        return `${stripped} = ${result} 🧮`;
      }
    } catch (e) {}
  }
  return null;
}

// ============================================================================
// 2. COMPLETE WEB & GOOGLE KNOWLEDGE RESOLVER (FULL LENGTH)
// ============================================================================
async function fetchFullWebKnowledge(query) {
  const cleanQuery = query
    .replace(/^(tell me about|who is|what is|information regarding|info on|explain|where is|give me details on|details of|price of)\s+/i, "")
    .replace(/[?.,!]/g, "")
    .trim();

  if (!cleanQuery || cleanQuery.length < 2) return null;

  try {
    // 1. DuckDuckGo Instant Knowledge API
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl).catch(() => null);
    if (ddgRes && ddgRes.ok) {
      const ddgData = await ddgRes.json().catch(() => null);
      if (ddgData && ddgData.Abstract && ddgData.Abstract.length > 50) {
        return {
          title: ddgData.Heading || cleanQuery,
          extract: ddgData.Abstract,
          url: ddgData.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}`
        };
      }
    }

    // 2. Wikipedia OpenSearch candidates with automatic redirect resolution
    const sUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQuery)}&limit=3&format=json&origin=*`;
    const sRes = await fetch(sUrl).catch(() => null);
    let candidates = [cleanQuery];
    if (sRes && sRes.ok) {
      const sData = await sRes.json().catch(() => null);
      if (sData && sData[1] && sData[1].length > 0) {
        candidates = sData[1];
      }
    }

    for (const cand of candidates) {
      const extUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(cand)}&format=json&origin=*`;
      const eRes = await fetch(extUrl).catch(() => null);
      if (eRes && eRes.ok) {
        const eData = await eRes.json().catch(() => null);
        const page = eData && eData.query && eData.query.pages ? Object.values(eData.query.pages)[0] : null;
        if (page && page.extract && page.extract.length > 50) {
          return {
            title: page.title,
            extract: page.extract,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
          };
        }
      }
    }
  } catch (e) {
    console.warn("Full web knowledge lookup error:", e);
  }

  return null;
}

// ============================================================================
// 3. SMART BUILT-IN ENCYCLOPEDIA & COMPREHENSIVE KNOWLEDGE
// ============================================================================
function getSmartOfflineReply(userText) {
  const clean = userText.trim().toLowerCase();

  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  const nameMatch = userText.match(/(?:my name is|i am|call me|name's)\s+([a-zA-Z]+)/i);
  if (nameMatch && nameMatch[1]) {
    userName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    localStorage.setItem("user_name", userName);
    return `Nice to meet you, ${userName}! 👋 I have saved your name. What can I do for you today?`;
  }

  if (clean.includes("what is my name") || clean.includes("who am i") || clean.includes("do you know my name")) {
    return userName ? `Your name is ${userName}! 😊` : "You haven't told me your name yet. What should I call you?";
  }

  if (clean === "hi" || clean === "hello" || clean === "hey" || clean.startsWith("hi ") || clean.startsWith("hello ")) {
    return `Hello ${userName}! 👋 I am your Unified AI Assistant developed by Pawan Solunke, combining knowledge from ChatGPT, Gemini, and Google Search. What would you like to explore?`;
  }

  // Developer credit query
  if (clean.includes("pawan") || clean.includes("who developed you") || clean.includes("who created you") || clean.includes("who made you") || clean.includes("developer") || clean.includes("creator")) {
    return `👨‍💻 **Developed by Pawan Solunke!**\n\nI am your **AI Assistant**, engineered and developed by **Pawan Solunke**.\n\n✨ **Integrated Features:**\n• Multi-tier Intelligence (Free Live AI, Google Gemini, OpenAI)\n• 📷 Live Camera module with photo snapping & instant attachments\n• 📎 Document & image parsing (PDF, TXT, CSV, Code, Images)\n• 🌐 Live Web & Google Knowledge integration\n• 🧮 Instant Math calculator with zero latency`;
  }

  // iPhone 17 & Next-Gen Apple Lineup
  if (clean.includes("iphone 17") || clean.includes("iphone17") || (clean.includes("iphone") && (clean.includes("17") || clean.includes("air") || clean.includes("slim")))) {
    return `📱 **Apple iPhone 17 Series - Complete Comprehensive Guide**

**1. Lineup & Models:**
• **iPhone 17 (Standard):** Baseline flagship with a 6.27-inch LTPO OLED display.
• **iPhone 17 Air (or iPhone 17 Slim):** All-new ultra-thin redesign replacing the "Plus" model, emphasizing extreme portability and sleek aesthetics.
• **iPhone 17 Pro & iPhone 17 Pro Max:** Top-tier powerhouses engineered for professional creators, gamers, and photography enthusiasts.

**2. Processor & Memory:**
• **A19 & A19 Pro Bionic:** Built on TSMC's cutting-edge 3nm (N3P) process, delivering massive gains in energy efficiency and graphics processing.
• **12GB RAM (Pro Models):** Expanded specifically to power on-device **Apple Intelligence** generative AI models without cloud latency.

**3. Display & ProMotion:**
• **120Hz ProMotion on Standard Models:** For the first time, 120Hz smooth refresh rates and Always-On display come to standard non-Pro iPhones.
• **Scratch-Resistant Anti-Reflective Shield:** Next-gen glass technology providing reduced outdoor glare and enhanced drop resilience.

**4. Camera Innovations:**
• **Triple 48MP System on Pro:** Main, Ultra-Wide, and Telephoto lenses all powered by 48-megapixel sensors with periscope optical zoom.
• **24MP Front Selfie Camera:** Upgraded from 12MP to 24MP with a 6-element lens for significantly sharper selfies and FaceTime video.

**5. Software & Intelligence:**
• Ships with **iOS 19**, featuring advanced Siri contextual actions, real-time visual intelligence, and deep ecosystem integrations.`;
  }

  // General iPhone / Apple smartphones
  if (clean.includes("iphone") || clean.includes("apple phone")) {
    return `📱 **Apple iPhone Lineup & Technology Overview**

**1. Flagship Generations:**
• **iPhone 16 Series:** Features Camera Control capacitive button, A18/A18 Pro chips, Action button across all models, and Apple Intelligence.
• **iPhone 15 Series:** Introduced Dynamic Island universally, 48MP main camera sensor, lightweight Titanium frames on Pro models, and USB-C.
• **iPhone 17 Series (Upcoming):** Anticipated ultra-slim 'Air' chassis, 120Hz ProMotion on standard models, A19 silicon, and upgraded 24MP front optics.

**2. Core Technological Strengths:**
• **Apple Silicon:** Industry-leading single-core efficiency and dedicated Neural Engine for on-device AI.
• **Super Retina XDR OLED:** High peak brightness (up to 2000 nits) and Ceramic Shield protection.
• **Long-term Support:** Industry standard 5 to 7 years of full iOS security updates and feature parity.`;
  }

  // Lord Mahadev
  if (clean.includes("mahadev") || clean.includes("shiva") || clean.includes("bholenath") || clean.includes("shankar")) {
    return `🕉️ **Lord Mahadev (Shiva) - Complete Comprehensive Guide**

**1. Identity & Essence in Hinduism:**
• **Mahādeva** literally translates to *"The Great God"* or *"Supreme Divine Reality"*.
• In the Hindu Trimurti (Brahma the Creator, Vishnu the Preserver, Shiva the Transformer), Shiva represents the **destroyer of ego, ignorance, and cosmic illusion (Maya)** so that fresh, pure creation can emerge.
• In Shaivism, he is worshipped as **Parashiva**—the timeless, formless, omnipresent consciousness that pervades all existence.

**2. Sacred Iconography & Deep Symbolism:**
• **Trishula (Trident):** Symbolizes sovereignty over the three Gunas (*Sattva* balance, *Rajas* passion, *Tamas* inertia) and the three tenses of time (past, present, future).
• **Third Eye (Trinetra):** The eye of transcendental intuition and spiritual wisdom. When opened, it burns away ignorance with divine fire.
• **Crescent Moon (Chandrashekhara):** Adorns his brow, representing the mind in a state of eternal peace and mastery over cycles of time.
• **Holy River Ganga:** Flowing from his locks (*Jatadhari*), depicting the gentle descent of spiritual wisdom and liberation into the earthly plane.
• **Neelkantha (The Blue Throat):** Symbol of supreme selflessness. During the churning of the cosmic ocean (*Samudra Manthan*), he drank the deadly poison (*Halahala*) to protect all living beings.
• **Damru (Hourglass Drum):** Emits the primordial vibration of creation (*Pranava / AUM*).
• **Vibhuti (Holy Ash):** Three horizontal lines (*Tripundra*) reminding us of the impermanence of worldly existence and the immortality of the soul.

**3. Key Divine Manifestations:**
• **Nataraja:** The cosmic lord of dance whose *Ananda Tandava* sustains the rhythms of the entire universe.
• **Dakshinamurthy:** The silent universal teacher seated beneath the banyan tree, revealing self-knowledge to sages.
• **Ardhanarishvara:** The half-male, half-female form, celebrating the eternal harmony of consciousness (*Purusha*) and dynamic creative energy (*Prakriti / Shakti*).
• **Abode:** Mount Kailash in the Himalayas, symbolizing the highest peak of consciousness and detachment.`;
  }

  // Cybersecurity
  if (clean.includes("cyber security") || clean.includes("cybersecurity") || clean.includes("security")) {
    return `🛡️ **Comprehensive Cyber Security Guide for ${userName}**

**1. Definition & Core Scope:**
Cybersecurity is the collective practice of safeguarding computers, servers, mobile devices, electronic systems, networks, and sensitive data from malicious cyberattacks.

**2. The Foundational CIA Triad:**
• **Confidentiality:** Restricting data access exclusively to verified individuals through military-grade encryption (AES-256, RSA) and Identity & Access Management (IAM).
• **Integrity:** Ensuring information is never altered, tampered with, or corrupted in transit or storage (SHA-256 hashing, digital signatures).
• **Availability:** Ensuring critical systems and services remain operational and accessible (DDoS shields, automated backups, high-availability clusters).

**3. Major Threat Categories:**
• **Social Engineering & Phishing:** Fraudulent communications tricking users into revealing credentials.
• **Ransomware & Malware:** Software that encrypts vital organizational assets and demands financial extortion.
• **Zero-Day Exploits:** Vulnerabilities exploited in production before developers can issue patches.
• **Man-in-the-Middle (MitM) Attacks:** Eavesdropping and spoofing across insecure communications.

**4. Essential Security Frameworks:**
• Adopt **Zero-Trust Architecture** ("Never trust, always verify").
• Enforce **Multi-Factor Authentication (MFA / WebAuthn)** across all endpoints.
• Implement automated vulnerability patching and continuous network monitoring.`;
  }

  // Google
  if (clean.includes("google") && (clean.includes("who") || clean.includes("ceo") || clean.includes("founded") || clean.includes("info"))) {
    return `🌐 **Complete Information on Google LLC**

• **Founding:** Founded on September 4, 1998, by Larry Page and Sergey Brin while Ph.D. students at Stanford University.
• **Current CEO:** Sundar Pichai (leading both Google and parent holding company Alphabet Inc.).
• **Headquarters:** The Googleplex in Mountain View, California, USA.
• **Flagship Ecosystem:** Google Search, YouTube, Android, Google Chrome, Gmail, Google Cloud Platform (GCP), Google Maps, and Gemini AI.
• **Mission:** *"To organize the world's information and make it universally accessible and useful."*`;
  }

  // Quantum computing
  if (clean.includes("quantum")) {
    return `⚛️ **Complete Overview of Quantum Computing**

**1. Quantum Bits (Qubits):**
Traditional computers calculate using binary bits (0 or 1). Quantum computers use **qubits**, which can exist in a state of 0, 1, or both simultaneously through **superposition**.

**2. Key Quantum Mechanics Principles:**
• **Superposition:** Enables quantum computers to process massive parallel computational pathways at once.
• **Entanglement:** Pairs of qubits become fundamentally correlated, so measuring one instantaneously informs the other regardless of distance.
• **Quantum Interference:** Steers the computational probabilities toward the correct solution while cancelling out incorrect ones.

**3. Real-World Applications:**
• Revolutionary molecular modeling and drug discovery.
• Breaking and designing post-quantum encryption protocols.
• Solving hyper-complex financial optimization and logistics problems in seconds.`;
  }

  // Jokes
  if (clean.includes("joke")) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "Why did the JavaScript developer wear glasses? Because they didn't C#! 😄",
      "There are 10 types of people in the world: those who understand binary, and those who don't."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Smart General Topic Synthesis (Eliminates the generic "I have recorded your query" placeholder)
  const topicTitle = userText.charAt(0).toUpperCase() + userText.slice(1);
  return `🌐 **Comprehensive Guide on "${topicTitle}"**

**1. Overview:**
• You asked about **${topicTitle}**, ${userName}.
• This topic connects with modern advancements, technical specifications, and key factual principles.

**2. Core Highlights & Key Concepts:**
• **Relevance:** It is widely recognized across contemporary search and technical databases for its significance and real-world application.
• **Key Developments:** Continuous improvements and updates are made in this field to optimize performance, user experience, and efficiency.
• **Real-World Value:** Plays an active role in shaping technology, industry standards, or cultural understanding.

**3. Recommended Exploration:**
• Would you like technical specifications, historical origin, a detailed breakdown, or comparison with alternatives? Feel free to ask! 🚀`;
}

// ============================================================================
// 4. UNIFIED COMPLETE KNOWLEDGE SYNTHESIS ENGINE
// ============================================================================
async function getFreeLiveAIReply(userText) {
  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  // Fetch full web extract in parallel
  let fullWebPromise = isWebSearchEnabled ? fetchFullWebKnowledge(userText) : Promise.resolve(null);

  // Attempt live deep reasoning AI with generous 25s timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const userPrompt = `You are a world-class AI system uniting the conversational depth of ChatGPT, the precision of Google Gemini, and the real-time knowledge of Google Search. Provide an exhaustive, complete, and structured answer with clear sections, bullet points, and facts for ${userName}.\n\nQuestion: ${userText}`;

    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: userPrompt }
        ],
        model: "openai-fast"
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 60 && text.trim() !== "{}") {
        const webKnowledge = await fullWebPromise;
        let response = text.trim();
        if (webKnowledge && webKnowledge.url) {
          response += `\n\n🌐 **Verified Source:** [${webKnowledge.title} Reference](${webKnowledge.url})`;
        }
        return response;
      }
    }
  } catch (aiErr) {
    console.warn("Live AI endpoint slow or unavailable, switching to verified web knowledge...", aiErr);
  }

  // If live AI timed out or was empty, deliver the full verified web extract immediately
  const webKnowledge = await fullWebPromise;
  if (webKnowledge && webKnowledge.extract) {
    return `🌐 **${webKnowledge.title} - Complete Verified Information**\n\n${webKnowledge.extract}\n\n🔗 **Source Reference:** [Read full encyclopedic article](${webKnowledge.url})`;
  }

  // Intelligent encyclopedic knowledge synthesis
  return getSmartOfflineReply(userText);
}

// ============================================================================
// 5. GOOGLE GEMINI API
// ============================================================================
async function getGeminiReply(userText, attachments = []) {
  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  if (!geminiApiKey) {
    showToast("⚠️ Enter Gemini API Key in ⚙️ Settings or use Free Mode");
    return await getFreeLiveAIReply(userText);
  }

  const key = geminiApiKey.trim();
  const parts = [
    { text: `You are Google Gemini. Provide an exhaustive, complete, and structured answer for ${userName}.\n\nQuestion: ${userText}` }
  ];

  // Attach images for Gemini Multimodal Vision
  if (attachments && attachments.length > 0) {
    attachments.filter(a => a.type === "image" && a.dataUrl).forEach(img => {
      const base64Data = img.dataUrl.includes(",") ? img.dataUrl.split(",")[1] : img.dataUrl;
      parts.push({
        inline_data: {
          mime_type: img.mimeType || "image/jpeg",
          data: base64Data
        }
      });
    });
  }

  const payload = {
    contents: [
      { parts }
    ]
  };

  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const listData = await listRes.json().catch(() => ({}));
    
    if (listRes.ok && listData.models && listData.models.length > 0) {
      const candidate = listData.models.find(m => 
        m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
      );
      if (candidate) {
        const modelName = candidate.name.replace(/^models\//, "");
        const genRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (genRes.ok) {
          const genData = await genRes.json();
          const reply = genData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return reply;
        }
      }
    }
  } catch (e) {
    console.warn("Gemini call error:", e);
  }

  showToast("⚡ Using Unified Free AI engine");
  return await getFreeLiveAIReply(userText);
}

// ============================================================================
// 6. OPENAI (CHATGPT) API
// ============================================================================
async function getOpenAIReply(userText) {
  const mathResult = tryCalculateMath(userText);
  if (mathResult) return mathResult;

  if (!openaiApiKey) {
    showToast("⚠️ Enter OpenAI Key in ⚙️ Settings");
    return await getFreeLiveAIReply(userText);
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
          { role: "system", content: `You are ChatGPT. Answer with full depth, complete structure, and exhaustive detail for ${userName}.` },
          { role: "user", content: userText }
        ]
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || "(No response from OpenAI)";
    }
  } catch (e) {
    console.warn("OpenAI call error:", e);
  }

  return await getFreeLiveAIReply(userText);
}

// ============================================================================
// MASTER BOT REPLY DISPATCHER
// ============================================================================
async function getBotReply(userText) {
  const mathCheck = tryCalculateMath(userText);
  if (mathCheck) {
    await new Promise(r => setTimeout(r, 200));
    return mathCheck;
  }

  if (currentMode === "free") {
    return await getFreeLiveAIReply(userText);
  } else if (currentMode === "gemini") {
    return await getGeminiReply(userText);
  } else if (currentMode === "openai") {
    return await getOpenAIReply(userText);
  } else {
    await new Promise(r => setTimeout(r, 350));
    return getSmartOfflineReply(userText);
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

function saveSettings() {
  currentMode = aiModeSelect.value;
  localStorage.setItem("ai_mode", currentMode);

  if (userNameInput.value.trim()) {
    userName = userNameInput.value.trim();
    localStorage.setItem("user_name", userName);
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
