module.exports = (sequelize, DataType) => {
  const donations = sequelize.define("donations", {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    campaignId: {
      type: DataType.INTEGER,
    },
    donorId: {
      type: DataType.INTEGER,
    },
    amount: {
      type: DataType.INTEGER,
    },
    notes: {
      type: DataType.STRING,
    },
  });
  donations.associate = function (models) {
    donations.belongsTo(models.donors, {
      foreignKey: "donorId",
      onDelete: "cascade",
    });
    donations.belongsTo(models.campaigns, {
      foreignKey: "campaignId",
      onDelete: "cascade",
    });
  };

  return donations;
};
