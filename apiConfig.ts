// /utils/apiConfig
// Add these new API Endpoints

// Gamification APIs (served by Apache PHP at /api/taskscms/)
const TASKSCMS_API_TARGET = 'http://100.75.157.95/api/taskscms';
const getTasksCmsBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_TASKSCMS_URL;
  if (envUrl) return envUrl;

  const isNativeApp = Capacitor.isNativePlatform();
  if (isNativeApp) {
    return 'https://app.activikid.hk/api/taskscms';
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/taskscms`;
  }

  return TASKSCMS_API_TARGET;
};

export const API_USERS_URL = `${getTasksCmsBaseUrl()}/user_information.php`;
export const API_TASKS_URL = `${getTasksCmsBaseUrl()}/tasks.php`;
export const API_COMPLETED_TASKS_URL = `${getTasksCmsBaseUrl()}/completed_tasks.php`;
export const API_VOUCHERS_URL = `${getTasksCmsBaseUrl()}/vouchers.php`;
export const API_USER_VOUCHERS_URL = `${getTasksCmsBaseUrl()}/user_vouchers.php`;
export const API_MEMBERSHIP_TIERS_URL = `${getTasksCmsBaseUrl()}/membership_tiers.php`;

export const getUsersUrl = () => API_USERS_URL;

export const getUserByIdUrl = (userId: number) =>
  `${API_USERS_URL}?user_id=${userId}`;

export const getUserByEmailUrl = (email: string) =>
  `${API_USERS_URL}?email=${email}`;

export const getTasksUrl = () => API_TASKS_URL;

export const getTaskByIdUrl = (taskId: number) =>
  `${API_TASKS_URL}?id=${taskId}`;

export const getCompletedTaskByUserIdUrl = (userId: number) =>
  `${API_COMPLETED_TASKS_URL}?user_id=${userId}`;

export const getCollectCompletedTaskUrl = () => API_COMPLETED_TASKS_URL;

export const getUserVouchersUrl = (userId: number) =>
  `${API_USER_VOUCHERS_URL}?user_id=${userId}`;

export const getVouchersUrl = () => API_VOUCHERS_URL;

export const getUserCollectedVouchersUrl = (userId: number) =>
  `${API_VOUCHERS_URL}?user_id=${userId}`;

export const getCollectVoucherUrl = () => API_VOUCHERS_URL;

export const getMembershipTiersUrl = () => API_MEMBERSHIP_TIERS_URL;

export const getMembershipTierByPointsUrl = (points: number) =>
  `${API_MEMBERSHIP_TIERS_URL}?points=${points}`;

