module.exports = (sequelize, DataType) => {
  const orgs = sequelize.define("orgs", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataType.INTEGER,
    },
    title: {
      type: DataType.STRING,
    },
    address: {
      type: DataType.STRING,
    },
    detail: {
      type: DataType.TEXT,
    },
    linkWebsite: {
      type: DataType.STRING,
    },
    imageData: {
      type: DataType.TEXT,
    },
    phone: {
      type: DataType.INTEGER,
    },
    email: {
      type: DataType.STRING,
    },
  });
  orgs.associate = (models) => {
    orgs.belongsTo(
      models.users,
      { foreignKey: "userId" },
      { onDelete: "null" }
    );
    orgs.hasMany(models.articles);
  };
  return orgs;
};
