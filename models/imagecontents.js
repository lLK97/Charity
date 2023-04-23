module.exports = (sequelize, DataType) => {
    const imagecontents = sequelize.define('imagecontents',{
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        imageContentId: {
            type: DataType.INTEGER,
        },
        title: {
            type: DataType.STRING,
        },
        imageData : {
            type: DataType.STRING,
        },
        sort: {
            type: DataType.INTEGER,
        }
    });
    imagecontents.associate = (models) =>{
        imagecontents.belongsTo(models.contents, { foreignKey: 'imageContentId' }, { onDelete: 'cascade' })
    }
    return imagecontents;
}