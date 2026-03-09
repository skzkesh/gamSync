<!-- This is a new UI Screen -->

<template>
  <ion-page key="vouchers-page">
    <ion-content :fullscreen="true" class="vouchers-page">
      <PageHeader title="Vouchers" status-bar-color="#FFFBEE" :fixed="true" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import {
  getVouchersUrl,
  getMembershipTiersUrl,
  getUserByEmailUrl,
  getCollectVoucherUrl,
  getUserVouchersUrl,
} from '@/utils/apiConfig';
import { useAppStore } from '@/stores/appStore';
import { ensureUserSynced } from '@/composables/useTaskscmsSync';

const appStore = useAppStore();

onMounted(async () => {
  await ensureUserSynced();
});

</script>

<style scoped>
.vouchers-page {
  --background: #FFFBEE;
}

.error {
  color: #c00;
}
</style>
