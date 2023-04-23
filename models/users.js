module.exports = (sequelize, DataType) => {
  const users = sequelize.define("users", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: {
      type: DataType.STRING,
    },
    password: {
      type: DataType.STRING,
    },
    roles: {
      type: DataType.INTEGER,
    },
    csrfToken: {
      type: DataType.STRING,
    },
    accessToken: {
      type: DataType.STRING,
    },
  });
  users.associate = (models) => {
    users.hasMany(models.inforusers);
    users.hasMany(models.orgs);
  };
  return users;
};
