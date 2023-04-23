module.exports = (sequelize, DataType) =>{
    const contents = sequelize.define('contents',{
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sectionId: {
            type: DataType.INTEGER,
        },
        title: {
            type: DataType.STRING
        },
        des:{
            type: DataType.STRING
        },
        sort:{
            type: DataType.INTEGER
        }
    })
    contents.associate = (models) =>{
        contents.belongsTo(models.sectionId, { foreignKey: 'sectionId' }, { onDelete: 'cascade' });
    }
    return contents;
}