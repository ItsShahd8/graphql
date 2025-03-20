export const getToken = () => {
    return sessionStorage.getItem("authToken"); // ✅ Token is now tab-specific
};

export const saveToken = (token) => {
    sessionStorage.setItem("authToken", token); // ✅ Token is saved only for this tab
};

export const removeToken = () => {
    sessionStorage.removeItem("authToken"); // ✅ Token is removed when user logs out
};
