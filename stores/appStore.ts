import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserLocation {
    lat: number;
    lng: number;
    address: string;
    formattedAddress?: string;
}

export const useAppStore = defineStore('app', () => {
    const email = ref('');
    const password = ref(''); // Add password storage
    const phoneNumber = ref('');
    const selectedAvatar = ref('');
    const successMessage = ref('');
    const paymentResult = ref(false);
    const user = ref<any>(null);
    const validationErrors = ref<any>({});
    const tempUserId = ref(0);
    const userId = ref(0);
    const kid = ref<any>(null);

    // User location
    const userLocation = ref<UserLocation | null>(null);

    const setEmail = (newEmail: string) => {
        email.value = newEmail;
    };

    const setPassword = (newPassword: string) => {
        password.value = newPassword;
    };

    const clearEmail = () => {
        email.value = '';
    };

    const clearPassword = () => {
        password.value = '';
    };

    const setPhoneNumber = (newPhoneNumber: string) => {
        phoneNumber.value = newPhoneNumber;
    };

    const setSelectedAvatar = (avatarUrl: string) => {
        selectedAvatar.value = avatarUrl;
    };

    const setSuccessMessage = (message: string) => {
        successMessage.value = message;
    };

    const setPaymentResult = (result: boolean) => {
        paymentResult.value = result;
    };

    const setUser = (userData: any) => {
        console.log('📦 appStore: setUser called', userData ? `${userData.first_name} ${userData.last_name}` : 'null');
        user.value = userData;
    };

    const setValidationErrors = (errors: any) => {
        validationErrors.value = errors;
    };

    const clearValidationErrors = () => {
        validationErrors.value = {};
    };

    const setTempUserId = (id: number) => {
        tempUserId.value = id;
    };

    const setUserId = (id: number) => {
        userId.value = id;
    };

    const setKid = (kidsData: any) => {
        kid.value = kidsData;
    };

    const setUserLocation = (location: UserLocation) => {
        userLocation.value = location;
        // Also store in localStorage for persistence
        localStorage.setItem('userLocation', JSON.stringify(location));
    };

    const clearUserLocation = () => {
        userLocation.value = null;
        localStorage.removeItem('userLocation');
    };

    const clearUser = () => {
        user.value = null;
        // Keep email and password for convenience - do not clear them
        localStorage.removeItem('token');
    };

    const setErrorMessage = (message: string) => {
        successMessage.value = message;
    };

    // Load user location from localStorage on initialization
    const loadUserLocation = () => {
        const stored = localStorage.getItem('userLocation');
        if (stored) {
            try {
                userLocation.value = JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse stored user location:', e);
            }
        }
    };

    // Initialize location from localStorage
    loadUserLocation();

    return {
        email,
        password,
        phoneNumber,
        selectedAvatar,
        successMessage,
        paymentResult,
        user,
        validationErrors,
        tempUserId,
        userId,
        kid,
        userLocation,
        setEmail,
        setPassword,
        clearEmail,
        clearPassword,
        setPhoneNumber,
        setSelectedAvatar,
        setSuccessMessage,
        setPaymentResult,
        setUser,
        setValidationErrors,
        clearValidationErrors,
        setTempUserId,
        setUserId,
        setKid,
        setUserLocation,
        clearUserLocation,
        clearUser,
        setErrorMessage
    };
}, {
    persist: true
});
