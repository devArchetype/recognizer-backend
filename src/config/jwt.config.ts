const jwtConfig = {
  secret: process.env.JWT_PASS,
  signOptions: {
    expiresIn: '1d',
  },
};

export default jwtConfig;
