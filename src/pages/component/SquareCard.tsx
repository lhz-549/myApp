import React from 'react';
import {View, Image, Text} from "@tarojs/components";
import './SquareCard.scss';
import Taro from "@tarojs/taro";

const SquareCard = ({ cards }) => {

  const handleItemClick = (item) => {
    Taro.navigateTo({
      url: `/pages/article/index?title=${item.title}&image=${item.image}&id=${item.id}&articleCategory=${item.articleCategory}&views=${item.views}&articleText=${item.articleText}&date=${item.date}`,
    });
  };

  return (
    <View className='card'>
      <View className='photos'>
        {cards.map((item, index) => (
          <View className='card-image-text' key={index} onClick={() => handleItemClick(item)}>
            <View className='card-image-out'>
              <Image className="card-image" src={item.image} mode='cover' alt={item.title} />
            </View>
            <Text className='card-title'>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default SquareCard;

