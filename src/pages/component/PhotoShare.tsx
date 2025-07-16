import React, {useState} from 'react';
import { View, Text, Image } from '@tarojs/components';
import './PhotoShare.scss';
import Taro from "@tarojs/taro";

const PhotoShare = ({ items }) => {

  const handleItemClick = (item) => {
    Taro.navigateTo({
      url: `/pages/article/index?title=${item.title}&image=${item.image}&id=${item.id}&articleCategory=${item.articleCategory}&views=${item.views}&articleText=${item.articleText}&date=${item.date}`,
    });
  };

  return (
    <View className='photo-share-container'>
      <View className='photos'>
        {items.map((item, index) => (
          <View className='photo-item' key={index} onClick={() => handleItemClick(item)}>
            <View className='photo-image-container'>
              <Image className='photo-image' src={item.image} mode='cover' />
            </View>
            <Text className='photo-text'>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default PhotoShare;
