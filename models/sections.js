module.exports = (sequelize, DataType) => {
  const sections = sequelize.define("sections", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    articleId: {
      type: DataType.INTEGER,
    },
    sort: {
      type: DataType.INTEGER,
    },
  });
  sections.associate = (models) => {
    sections.belongsTo(
      models.articles,
      { foreignKey: "articleId" },
      { onDelete: "cascade" }
    );
    sections.hasMany(models.contents);
    sections.hasMany(models.imagecontents);
  };
  return sections;
};
