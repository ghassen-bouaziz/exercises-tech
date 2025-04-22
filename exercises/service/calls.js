import service from './service';

// Login function
const handleLogin = async () => {
    const loginData = {
        email: 'test@test.com',
        password: 'password'
    };

    const { success, error } = await service.login(loginData.email, loginData.password);
    if (!success) return alert(error);

    const href = loginResponse.user.isAdmin ? '/admin/dashboard' : '/dashboard';
    window.location.href = href;
};

// Register function
const handleRegister = async () => {
    const registerData = {
        email: 'test@test.com',
        password: 'password'
    };

    const { success, error } = await service.register(registerData);
    if (!success) return alert(error);

    window.location.href = '/dashboard';
};

// Get user profile function
const handleGetUserProfile = async () => {
    const { success, error, user } = await service.getUserProfile();
    if (!success) return alert(error);
    console.log(user);
};

// Update user profile function
const handleUpdateUserProfile = async () => {
    const updateData = {
        name: 'John Doe',
        email: 'john.doe@example.com'
    };

    const { success, error, user } = await service.updateUserProfile(updateData);
    if (!success) return alert(error);
    console.log(user);
};

// Logout function
const handleLogout = async () => {
    const { success, error } = service.logout();
    if (!success) return alert(error);
    window.location.href = '/login';
};

