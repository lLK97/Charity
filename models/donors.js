module.exports = (sequelize, DataType) => {
  const donors = sequelize.define("donors", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataType.INTEGER,
    },
    isUser: {
      type: DataType.INTEGER,
    },
    name: {
      type: DataType.STRING,
    },
    firstName: {
      type: DataType.STRING,
    },
    lastName: {
      type: DataType.STRING,
    },
    middleName: {
      type: DataType.STRING,
    },
    email: {
      type: DataType.STRING,
    },
    phone: {
      type: DataType.STRING,
    },
    address: {
      type: DataType.STRING,
    },
  });
  donors.associate = function (models) {
    donors.belongsTo(models.users, {
      foreignKey: "userId",
      onDelete: "SET NULL",
    });
    donors.hasMany(models.donations);
  };
  return donors;
};
