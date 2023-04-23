module.exports = (sequelize, DataType) => {
  const inforusers = sequelize.define("inforusers", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataType.INTEGER,
    },
    firstName: {
      type: DataType.STRING,
    },
    middleName: {
      type: DataType.STRING,
    },
    lastName: {
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
    bankAccountNumber: {
      type: DataType.STRING,
    },
    bankName: {
      type: DataType.STRING,
    },
  });
  inforusers.associate = (models) => {
    inforusers.belongsTo(
      models.users,
      { foreignKey: "userId" },
      { onDelete: "cascade" }
    );
  };
  return inforusers;
};
