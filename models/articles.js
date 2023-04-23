module.exports = (sequelize, DataType) => {
  const articles = sequelize.define("articles", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataType.INTEGER,
    },
    campaignId: {
      type: DataType.INTEGER,
    },
    orgId: {
      type: DataType.INTEGER,
    },
    title: {
      type: DataType.STRING,
    },
    datePublished: {
      type: DataType.DATE,
    },
    imageData: {
      type: DataType.STRING,
    },
    content: {
      type: DataType.TEXT,
    },
    categoryId: {
      type: DataType.INTEGER,
    },
    desShort: {
      type: DataType.TEXT,
    },
  });
  articles.associate = (models) => {
    articles.belongsTo(
      models.users,
      { foreignKey: "userId" },
      { onDelete: "SET NULL" }
    );
    articles.belongsTo(
      models.campaigns,
      { foreignKey: "campaignId" },
      { onDelete: "cascade" }
    );
    articles.belongsTo(
      models.categories,
      {
        foreignKey: "categoryId",
      },
      {
        onDelete: "SET NULL",
      }
    );
    articles.belongsTo(
      models.orgs,
      { foreignKey: "orgId" },
      { onDelete: "null" }
    );
    articles.hasMany(models.comments);
  };
  return articles;
};
