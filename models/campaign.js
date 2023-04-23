module.exports = (sequelize, DataType) => {
  const campaigns = sequelize.define("campaigns", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataType.INTEGER,
    },
    startDate: {
      type: DataType.DATE,
    },
    endDate: {
      type: DataType.DATE,
    },
    target: {
      type: DataType.BIGINT,
    },
  });
  campaigns.associate = (models) => {
    campaigns.belongsTo(models.users, {
      foreignKey: "userId",
      onDelete: "SET NULL",
    });
    campaigns.hasMany(models.articles);
  };
  return campaigns;
};
