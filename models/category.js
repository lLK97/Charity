module.exports = (sequelize, DataType) => {
  const categories = sequelize.define("categories", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataType.STRING(50),
    },
    des: {
      type: DataType.TEXT,
    },
  });
  categories.associate = (models) => {
    categories.hasMany(models.articles);
  };
  return categories;
};
