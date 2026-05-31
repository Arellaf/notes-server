const renderUser = (user) => {
  return {
    id: user._id,
    nickname: user.nickname,
    email: user.email,
  };
};

const renderLoginSuccess = (accessToken, user) => {
  return {
    accessToken,
    user: renderUser(user),
  };
};

const renderRefreshSuccess = (accessToken) => {
  return { accessToken };
};

const renderUserMessage = (message) => {
  return { message };
};

module.exports = {
  renderUser,
  renderLoginSuccess,
  renderRefreshSuccess,
  renderUserMessage,
};
