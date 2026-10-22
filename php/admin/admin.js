/**
 * Admin Dashboard Client Script
 * Handles Tab navigation, async file uploads, modals, and sorting
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching
    const tabBtns = document.querySelectorAll('.sidebar-nav button[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${tabId}`);
        });
        const headerTitle = document.getElementById('adminPageTitle');
        const activeBtn = document.querySelector(`.sidebar-nav button[data-tab="${tabId}"]`);
        if (headerTitle && activeBtn) {
            headerTitle.textContent = activeBtn.innerText.trim();
        }
        localStorage.setItem('sanjai_admin_tab', tabId);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    const savedTab = localStorage.getItem('sanjai_admin_tab') || 'certificates';
    if (document.getElementById(`tab-${savedTab}`)) {
        switchTab(savedTab);
    }

    // 2. File Upload Helpers with Instant Preview
    setupFileUpload('profilePhotoInput', 'profilePhotoPreview', 'profileImageField', 'profile');
    setupFileUpload('resumeFileInput', null, 'resumePathField', 'resume');
    setupFileUpload('certPhotoInput', 'certPhotoPreview', 'certImagePathField', 'certificate');
    setupFileUpload('campPhotoInput', 'campPhotoPreview', 'campImagePathField', 'certificate');
});

function setupFileUpload(inputId, previewImgId, hiddenFieldId, uploadType) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('change', async function() {
        const file = this.files[0];
        if (!file) return;

        // Size check: 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds the 5MB limit.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', uploadType);

        try {
            const res = await fetch('upload.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                if (hiddenFieldId) {
                    const hidden = document.getElementById(hiddenFieldId);
                    if (hidden) hidden.value = data.url;
                }
                if (previewImgId) {
                    const preview = document.getElementById(previewImgId);
                    if (preview) {
                        preview.src = data.url;
                        preview.style.display = 'block';
                    }
                }
                alert('File uploaded successfully!');
            } else {
                alert('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Upload request failed. Please check network or file permissions.');
        }
    });
}

function openEditModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeEditModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function confirmDelete(itemDesc) {
    return confirm(`Are you sure you want to delete ${itemDesc}? This action cannot be undone.`);
}
