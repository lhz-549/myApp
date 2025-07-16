import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import './ArticleList.scss';
import Taro from '@tarojs/taro';

const ArticleList = ({ articles }) => {
  const handleItemClick = (article) => {
    //console.log(article);
    Taro.navigateTo({
      //url: `/pages/article/index?id=${article.id}&title=${article.title}&date=${article.date}&views=${article.views}&image=${article.image}`,
      url: `/pages/article/index?id=${article.id}&articleCategory=${article.articleCategory}&views=${article.views}&title=${article.title}&articleText=${article.articleText}&date=${article.date}&image=${article.image}`,
    });
  };

  return (
    <View className="article-list">
      {articles.map(article => (
        <View className="article-item" key={article.id} onClick={() => handleItemClick(article)}>
          <View className="article-text">
            <Text className="article-title">{article.title}</Text>
            <Text className="article-date">{article.date}</Text>
          </View>
          <Image className="article-image" src={article.image} />
        </View>
      ))}
    </View>
  );
};

export default ArticleList;
