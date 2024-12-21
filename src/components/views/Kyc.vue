<template>
    <div v-if="!kycAvailable">
        <Kycsubmit />
    </div>
    <div v-if="kycAvailable">
        <h3>KYC Submitted</h3>
        <ul>
            <li><strong>Name:</strong> {{ kycData.name }}</li>
            <li><strong>Email:</strong> {{ kycData.email }}</li>
            <li><strong>Status:</strong> {{ kycData.status }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Kycsubmit from './Kycsubmit.vue';
import ApiService from '@/api/api.service';

const kycAvailable = ref(false);
const kycData = ref({
    _id: '',
    name: '',
    email: '',
    status: ''
});

onMounted(async () => {
    try {
        const response = await ApiService.getKycStatus();
        if (response.status === 200) {
            kycData.value = response.data.data; // Store KYC data
            kycAvailable.value = true;
        } else {
            kycAvailable.value = false;
        }
    } catch (error) {
        console.error('Error fetching KYC status:', error);
    }
});
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}

li {
    margin: 5px 0;
}

strong {
    color: #333;
}
</style>