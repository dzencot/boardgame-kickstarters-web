// @ts-check

const getAuthToken = () => {
  const userData = JSON.parse(localStorage.getItem('user'));

  return userData?.jwt ? `Bearer ${userData.jwt}` : {};
};

export default getAuthToken;
