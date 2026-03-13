<!-- 
/src/views/KidProfilePage.vue

This is the (updated) KidProfilePage.vue with added "Click this text tp sync user"
When the text is clicked, it will direct to empty VoucherPage.vue to synchronize user.
We can confirm that the user is added to our database from the users API.
-->

<template>
    <ion-page key="kid-profile">
        <ion-content :fullscreen="true" class="profile-page">
            

            <div class="profile-content">
                <!-- Header Section with Greeting and Icons -->
                <div class="header-wrapper">
                    <AppHeader
                        :on-saved-click="handleSavedClick"
                        :on-settings-click="handleSettingsClick"
                    />
                </div>

                <!-- Profile Section -->
                <div class="profile-section">
                    <!-- My Kid Card -->
                    <div class="my-kid-card">
                        <div class="my-kid-card-inner">
                            <p class="my-kid-title">{{ t('kidProfile.myKid') || 'My Kid' }}</p>
                            
                            <div class="kid-profile-content">
                                <div class="kid-info-section">
                                    <p class="kid-name">{{ kid?.name || 'Corn Yuen' }}</p>
                                    <ProfilePictureEditor
                                        :avatar-url="kid?.profile_picture_path"
                                        size="80px"
                                        :auto-save="true"
                                        :kids-id="kid?.id"
                                        :edit-icon="editIcon"
                                        :edit-button-text="t('kidProfile.editPicture') || 'Edit picture'"
                                        @update:avatar-url="(url) => { if (kid) kid.profile_picture_path = url; }"
                                    />
                                </div>

                                <div class="action-buttons">
                                    <div class="action-button-item" @click="navigateToBasicInfo">
                                        <div class="action-icon-wrapper">
                                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.33333 4.66667H18.6667C19.3739 4.66667 20.0522 4.94762 20.5523 5.44772C21.0524 5.94781 21.3333 6.62609 21.3333 7.33333V20.6667C21.3333 21.3739 21.0524 22.0522 20.5523 22.5523C20.0522 23.0524 19.3739 23.3333 18.6667 23.3333H9.33333C8.62609 23.3333 7.94781 23.0524 7.44772 22.5523C6.94762 22.0522 6.66667 21.3739 6.66667 20.6667V7.33333C6.66667 6.62609 6.94762 5.94781 7.44772 5.44772C7.94781 4.94762 8.62609 4.66667 9.33333 4.66667Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M10.6667 2.33333V7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M17.3333 2.33333V7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <p class="action-button-label">{{ t('kidProfile.basicInfo') || 'Basic info' }}</p>
                                    </div>
                                    <div class="action-button-item" @click="navigateToPersonality">
                                        <div class="action-icon-wrapper">
                                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.33333 18.6667C9.33333 18.6667 11.1667 20.6667 14 20.6667C16.8333 20.6667 18.6667 18.6667 18.6667 18.6667M10.5 10.5H10.5083M17.5 10.5H17.5083M25.6667 14C25.6667 20.4433 20.4433 25.6667 14 25.6667C7.55667 25.6667 2.33333 20.4433 2.33333 14C2.33333 7.55667 7.55667 2.33333 14 2.33333C20.4433 2.33333 25.6667 7.55667 25.6667 14Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <p class="action-button-label">{{ t('kidProfile.personality') || 'Personality' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sync user -->
                    <div class="sync-user-section">
                        <button
                            type="button"
                            @click="navigateToVouchers"
                        >
                            Click this text to sync user
                        </button>
                    </div>

                    <!-- Info Card -->
                    <div class="info-card" :class="{ 'info-card-chinese': isChinese }">
                        <div class="info-card-inner">
                            <p class="info-card-text">
                                {{ t('kidProfile.recommendationsDescription') }}
                            </p>
                            <p class="info-card-text">
                                {{ t('kidProfile.completeProfileDescription') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, onIonViewWillEnter } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import AppHeader from '@/components/ui/AppHeader.vue';
import ProfilePictureEditor from '@/components/ui/ProfilePictureEditor.vue';
import { getKidsApi } from '@/api/member';
import {
    getUserByEmailUrl,
} from '@/utils/apiConfig';
import { useAppStore } from '@/stores/appStore';
import { ensureUserSynced } from '@/composables/useTaskscmsSync';
import editIcon from '@/assets/icons/edit.png';
import defaultAvatar from '@/assets/icons/meerkat 1.png';

const { t, locale } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const kid = ref<any>(null);

const loading = ref(true);
const error = ref<string | null>(null);

const isChinese = computed(() => locale.value === 'zh-HK');

const isUserStored = ref(false);
const userData = ref<any>(null);

async function fetchUserByEmail() {
  try {
    const email = appStore.user?.email;
    if (!email) {
      console.log('No user email, skipping user fetch');
      isUserStored.value = false;
      return { exists: false, user: null };
    }

    const url = getUserByEmailUrl(email);
    console.log('Fetching user from:', url);

    const resp = await fetch(url, { cache: 'reload' });

    if (resp.status === 404) {
      console.log('User not found (404)');
      isUserStored.value = false;
      return { exists: false, user: null };
    }

    if (!resp.ok) {
      throw new Error(`HTTP error ${resp.status}: ${resp.statusText}`);
    }

    const data = await resp.json();
    console.log('API response:', data);

    const userData = data;
    console.log('App store:', appStore.user);
    console.log('Data:', data);

    if (!userData || (Array.isArray(userData) && userData.length === 0)) {
      console.log('User data is empty');
      isUserStored.value = false;
      return { exists: false, user: null };
    }

    if (data.success === false) {
      console.log('API returned success: false');
      isUserStored.value = false;
      return { exists: false, user: null, message: data.message };
    }

    // User found
    isUserStored.value = true;
    console.log('User found:', userData);
    
    return { exists: true, user: userData };

  } catch (err) {
    console.error('Error fetching user:', err);
    isUserStored.value = false;
    return { exists: false, user: null, error: err instanceof Error ? err.message : String(err) };
  }
}

onIonViewWillEnter(async () => {
    const resp = await getKidsApi();
    if (resp.data && resp.data.success) {
        kid.value = resp.data.data;
    }

    // Check if user email exists in our database; if not, do nothing (no auto-sync).
    const userResult = await fetchUserByEmail();
    if (userResult.exists && userResult.user) {
        userData.value = userResult.user;
    } else {
        // User not in DB: do nothing
        userData.value = null;
    }
});

const handleSavedClick = () => {
    router.push('/saved');
};

const handleSettingsClick = () => {
    router.push('/settings');
};

const navigateToBasicInfo = () => {
    router.push('/basic-info');
};

const navigateToPersonality = () => {
    router.push('/personality');
};

const navigateToVouchers = async () => {
    // Sync user to our database (tasks CMS), then go to Vouchers. When page is reloaded/re-entered, user will be defined.
    await ensureUserSynced();
    router.push('/vouchers');
};
</script>

<style scoped>
.profile-page {
    --background: #FFFBEE;
}

.profile-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 2px var(--page-padding-x, 16px) 100px;
}

.header-wrapper {
    margin: 0 0;
    padding: 0 0;
}

.header-wrapper :deep(.header-section) {
    padding-left: 0;
    padding-right: 0;
}

.profile-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.my-kid-card {
    background: #FFFBEE;
    border-radius: 24px;
    padding: 12px;
}

.my-kid-card-inner {
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.my-kid-title {
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    color: #120D26;
    margin: 0;
}

.kid-profile-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
}

.kid-info-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
}

.kid-name {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #000000;
    margin: 0;
}

/* Increase edit photo button size to match other buttons */
.kid-info-section :deep(.edit-button) {
    gap: 4px;
}

.kid-info-section :deep(.edit-icon),
.kid-info-section :deep(.edit-icon-svg) {
    width: 16px;
    height: 16px;
}

.kid-info-section :deep(.edit-button-text) {
    font-size: 14px;
    line-height: 20px;
}


.action-buttons {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
    justify-content: center;
    padding: 0 var(--page-padding-x, 16px);
    width: 100%;
}

.action-button-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    cursor: pointer;
    flex: 0 0 70px;
}

.action-icon-wrapper {
    background: #FCE38A;
    border-radius: 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
}

.action-icon-wrapper svg {
    width: 32px;
    height: 32px;
}

.action-button-label {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #000000;
    text-align: center;
    margin: 0;
}

.info-card {
    background: #FFFBEE;
    border-radius: 24px;
    padding: 12px;
}

.info-card-inner {
    background: #FFFFFF;
    border: 1px solid #FFFFFF;
    border-radius: 8px;
    padding: 10px;
}

.info-card-text {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 26px;
    color: #120D26;
    margin: 0 0 10px 0;
}

.info-card-text:last-child {
    margin-bottom: 0;
}

/* Increased line spacing for Chinese language */
.info-card-chinese .info-card-text {
    line-height: 30px;
    margin: 0 0 12px 0;
}

.info-card-chinese .info-card-inner {
    padding: 12px;
}

</style>
