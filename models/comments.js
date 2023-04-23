module.exports = (sequelize, DataType) => {
    const comments = sequelize.define('',{
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId:{
            type: DataType.INTEGER
        },
        articleId: {
            type: DataType.INTEGER
        },
        content: {
            type: DataType.STRING
        }
    })
    comments.associate = function(models){
        comments.belongsTo(models.articles, {foreignKey: 'articleId'},{ onDelete: 'cascade' });
        comments.belongsTo(models.users, {foreignKey: 'userId'},{ onDelete: 'cascade' });
    }
    return comments;
}
