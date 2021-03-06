'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
        onDelete: 'CASCADE',
      }),
        models.Post.hasMany(models.Comment);
    }
  }

  Post.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.STRING, allowNull: false },
      signale: { type: DataTypes.BOOLEAN, allowNull: false, default: false },
      imageUrl: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
